import { Signer, Provider } from "ethers";

type Group = {
  className: string;
  fields: string[];
};

export interface FormProps {
  testIdPrefix: string;
  schemaUid: string;
  provider: Provider;
  signer: Signer;
  theme: "primary" | "secondary";
  title?: string;
  description?: string;
  buttonText?: string;
  groups?: Group[];
  recipient?: string;
  expirationDate?: number;
  revocable?: boolean;
}
