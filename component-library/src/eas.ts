import {
  EAS,
  SchemaEncoder,
  SchemaItem,
  TransactionSigner,
  OffchainConfig,
  Offchain,
  OffchainAttestationVersion,
  SchemaRegistry,
  MerkleValue,
  PrivateData,
  Attestation,
} from "@ethereum-attestation-service/eas-sdk";
import axios from "axios";
import { ethers, AbstractProvider, Provider, Signer } from "ethers";

export type EASChainConfig = {
  chainId: number;
  chainName: string;
  version: string;
  contractAddress: string;
  schemaRegistryAddress: string;
  etherscanURL: string;
  /** Must contain a trailing dot (unless mainnet). */
  subdomain: string;
  contractStartBlock: number;
  rpcProvider: string;
};


export const EAS_CHAIN_CONFIGS: EASChainConfig[] = [
  {
    chainId: 11155111,
    chainName: "sepolia",
    subdomain: "sepolia.",
    version: "0.26",
    contractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    schemaRegistryAddress: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
    etherscanURL: "https://sepolia.etherscan.io",
    contractStartBlock: 2958570,
    rpcProvider: `https://sepolia.infura.io/v3/`,
  },
];

function getChainId() {
  return Number(11155111);
}

export const CHAINID = getChainId();

export const activeChainConfig = EAS_CHAIN_CONFIGS.find(
  (config) => config.chainId === CHAINID
);


export const baseURL = `https://${activeChainConfig!.subdomain}easscan.org`;
export const EAS_CONTRACT_ADDRESS =
  "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

export let easProvider: EAS;
export let easContractAddress: string;

const provider = ethers.getDefaultProvider("sepolia");
const eas = new EAS(EAS_CONTRACT_ADDRESS);
// @ts-expect-error MUST be a signer to do write operations! but not for read/write
easProvider = eas.connect(provider);

export const createConnection = (
  provider: Provider,
  easContractAddress: string = EAS_CONTRACT_ADDRESS
) => {
  const eas = new EAS(easContractAddress);
  easContractAddress = easContractAddress;

  // @ts-expect-error MUST be a signer to do write operations! but not for read/write
  // TODO Create PR
  easProvider = eas.connect(provider);
};

export const getAttestation = async (uid: string) => {
  const response = await axios.post<Attestation>(
    `${baseURL}/graphql`,
    {
      query:
        "query Query($where: AttestationWhereUniqueInput!) {\n  attestation(where: $where) {\n    id\n    attester\n    recipient\n    revocationTime\n    expirationTime\n    time\n    txid\n    data\n  }\n}",
      variables: {
        where: {
          id: uid,
        },
      },
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  console.log(response.data)
  // @ts-ignore
  return response.data.data.attestation;
};

export const createAttestation = async (
  signer: Signer,
  schemaUid: string,
  schema: string,
  data: SchemaItem[],
  recipient: string = "0x0000000000000000000000000000000000000000",
  expirationTime: number = 0,
  revocable: boolean = true
) => {
  const schemaEncoder = new SchemaEncoder(schema);
  const encodedData = schemaEncoder.encodeData(data);

  const eas = new EAS(easContractAddress);
  eas.connect(signer);

  const transaction = await eas.attest({
    schema: schemaUid,
    data: {
      recipient,
      expirationTime: BigInt(expirationTime),
      revocable,
      data: encodedData,
    },
  });

  const newAttestationUID = await transaction.wait();

  return newAttestationUID;
};

export const createPrivateDataAttestation = async (
  signer: Signer,
  values: MerkleValue[],
  schema: string,
  proofIndexes: number[] | null,
  recipient: string = "0x0000000000000000000000000000000000000000",
  expirationTime: number = 0,
  revocable: boolean = true
) => {
  const eas = new EAS(easContractAddress);
  eas.connect(signer);

  const privateData = new PrivateData(values);
  const schemaEncoder = new SchemaEncoder(schema);

  const fullTree = privateData.getFullTree();
  const encodedData = schemaEncoder.encodeData([
    { name: "dataRoot", value: fullTree.root, type: "bytes32" },
  ]);

  const transaction = await eas.attest({
    schema,
    data: {
      recipient,
      expirationTime: BigInt(expirationTime),
      revocable,
      data: encodedData,
    },
  });

  const newAttestationUID = await transaction.wait();

  if (proofIndexes) {
    return [newAttestationUID, privateData.generateMultiProof(proofIndexes)];
  }

  return newAttestationUID;
};

export const revokeAttestation = async (
  signer: Signer,
  schemaUid: string,
  data: { uid: string; value?: bigint }
) => {
  const eas = new EAS(easContractAddress);
  eas.connect(signer);

  const transaction = await eas.revoke({
    schema: schemaUid,
    data,
  });

  eas.timestamp;

  return await transaction.wait();
};

export const createOffchainAttestation = async (
  eas: EAS,
  privateKey: string,
  provider: Provider | null = null,
  schema: string,
  data: SchemaItem[],
  recipient: string = "0x0000000000000000000000000000000000000000",
  expirationTime: number = 0,
  revocable: boolean = true,
  refUID: string = "0x0000000000000000000000000000000000000000"
) => {
  const offchain = await eas.getOffchain();

  const schemaEncoder = new SchemaEncoder(schema);
  const encodedData = schemaEncoder.encodeData(data);

  const signer = new ethers.Wallet(privateKey, provider);

  const offchainAttestation = await offchain.signOffchainAttestation(
    {
      recipient,
      expirationTime: BigInt(expirationTime),
      time: BigInt(Math.floor(Date.now() / 1000)),
      revocable,
      schema,
      refUID,
      data: encodedData,
    },
    signer
  );

  return offchainAttestation;
};

export const createDelegateAttestation = async (
  easContractAddress: string,
  sender: TransactionSigner,
  privateKey: string,
  provider: Provider | null = null,
  schemaUid: string,
  schema: string,
  data: SchemaItem[],
  recipient: string = "0x0000000000000000000000000000000000000000",
  expirationTime: number = 0,
  revocable: boolean = true,
  refUID: string = "0x0000000000000000000000000000000000000000",
  deadline: number = 0,
  value: number = 0
) => {
  const eas = new EAS(easContractAddress);
  eas.connect(sender);

  const delegated = await eas.getDelegated();

  const schemaEncoder = new SchemaEncoder(schema);
  const encodedData = schemaEncoder.encodeData(data);

  const signer = new ethers.Wallet(privateKey, provider);

  const response = await delegated.signDelegatedAttestation(
    {
      schema,
      recipient,
      expirationTime: BigInt(expirationTime),
      revocable,
      refUID,
      data: encodedData,
      deadline: BigInt(deadline),
      value: BigInt(value),
    },
    signer
  );

  const transaction = await eas.attestByDelegation({
    schema: schemaUid,
    data: {
      recipient,
      expirationTime: BigInt(expirationTime),
      revocable: true,
      refUID:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: encodedData,
    },
    signature: response.signature,
    attester: await signer.getAddress(),
    deadline: BigInt(deadline),
  });

  const newAttestationUID = await transaction.wait();

  return newAttestationUID;
};

export const createTimestamp = async (
  eas: EAS,
  anything: string | string[]
) => {
  const arrayed = Array.isArray(anything) ? anything : [anything];

  const transaction = await eas.multiTimestamp(
    arrayed.map((item) => ethers.encodeBytes32String(item))
  );

  return await transaction.wait();
};

export const verifyOffchainAttestation = async (eas: EAS, attestation: any) => {
  const EAS_CONFIG: OffchainConfig = {
    address: attestation.sig.domain.verifyingContract,
    version: attestation.sig.domain.version,
    chainId: attestation.sig.domain.chainId,
  };
  const offchain = new Offchain(
    EAS_CONFIG,
    OffchainAttestationVersion.Version2,
    eas
  );
  const isValidAttestation = offchain.verifyOffchainAttestationSignature(
    attestation.signer,
    attestation.sig
  );

  return isValidAttestation;
};

export const createSchema = async (
  schemaRegistryContractAddress: string,
  signer: Signer,
  schema: string,
  resolverAddress: string,
  revocable: boolean = true
) => {
  const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

  schemaRegistry.connect(signer);

  const transaction = await schemaRegistry.register({
    schema,
    resolverAddress,
    revocable,
  });

  await transaction.wait();
};

export const getSchema = async (
  uid: string,
  schemaRegistryContractAddress: string,
  provider: Provider
) => {
  const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

  // @ts-expect-error Can be a provider when reading data
  schemaRegistry.connect(provider ?? easProvider);

  return await schemaRegistry.getSchema({ uid });
};

export const decodeData = (schema: string, data: string) => {
  const schemaCoder = new SchemaEncoder(schema);
  return schemaCoder.decodeData(data);
}
