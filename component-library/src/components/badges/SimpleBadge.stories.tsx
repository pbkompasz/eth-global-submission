import { StoryFn, Meta } from "@storybook/react";
import AttestationDisplay from "./SimpleBadge";
import { JSX } from "react/jsx-runtime";
import { BadgeProps } from "./Badge.types";
import { ethers } from "ethers";

export default {
  title: "ReactComponentLibrary/Rating",
  component: AttestationDisplay,
} as Meta<typeof AttestationDisplay>;

const Template: StoryFn<typeof AttestationDisplay> = (
  args: JSX.IntrinsicAttributes & BadgeProps
) => <AttestationDisplay {...args} />;

const alchemyApiUrl = `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`;
const network = "sepolia";
const provider = new ethers.JsonRpcProvider(alchemyApiUrl, network);

export const BadgeSimpleTest = Template.bind({});
BadgeSimpleTest.args = {
  attestationUid:
    "0x23b1e2fc7560357e478597cb47bbc8ba00576a1b0a72ddc3200cdd3fd31f4558",
  title: "Simple attestation",
  description: "hey checkout my attestation",
  theme: "primary",
  testIdPrefix: "badge",
};

export const BadgeWithTransactionTest = Template.bind({});
BadgeWithTransactionTest.args = {
  attestationUid:
    "0x23b1e2fc7560357e478597cb47bbc8ba00576a1b0a72ddc3200cdd3fd31f4558",
  title: "Simple attestation",
  description: "hey checkout my attestation",
  theme: "primary",
  testIdPrefix: "badge",
  showTransaction: true,
};

export const BadgeWithSchemaTest = Template.bind({});
BadgeWithSchemaTest.args = {
  attestationUid:
    "0x23b1e2fc7560357e478597cb47bbc8ba00576a1b0a72ddc3200cdd3fd31f4558",
  title: "Simple attestation",
  description: "hey checkout my attestation",
  theme: "primary",
  testIdPrefix: "badge",
  showSchema: true,
  provider,
};

export const BadgeWithEverythingTest = Template.bind({});
BadgeWithEverythingTest.args = {
  attestationUid:
    "0x23b1e2fc7560357e478597cb47bbc8ba00576a1b0a72ddc3200cdd3fd31f4558",
  title: "Simple attestation",
  description: "hey checkout my attestation",
  theme: "primary",
  testIdPrefix: "badge",
  showTransaction: true,
  showSchema: true,
  provider,
};
