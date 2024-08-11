import { StoryFn, Meta } from "@storybook/react";
import AttestationForm from "./AttestationForm";
import { JSX } from "react/jsx-runtime";
import { FormProps } from "./AttestationForm.types";
import { ethers } from "ethers";

export default {
  title: "ReactComponentLibrary/Forms",
  component: AttestationForm,
} as Meta<typeof AttestationForm>;

const Template: StoryFn<typeof AttestationForm> = (
  args: JSX.IntrinsicAttributes & FormProps
) => <AttestationForm {...args} />;

const alchemyApiUrl = `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`;
const network = "sepolia";
const provider = new ethers.JsonRpcProvider(alchemyApiUrl, network);

const signer = ethers.Wallet.createRandom().connect(provider);

export const FormSimpleTest = Template.bind({});
FormSimpleTest.args = {
  schemaUid:
    "0x6dee028cb86e60e2884fe261bd0c4e701f7cdfaea0e42aec5628ec96d4b3e10f",
  title: "Simple attestation",
  description: "hey checkout my attestation",
  theme: "primary",
  testIdPrefix: "badge",
  provider,
  signer 
};

