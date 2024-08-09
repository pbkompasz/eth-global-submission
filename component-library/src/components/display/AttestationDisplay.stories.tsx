import { StoryFn, Meta } from "@storybook/react";
import AttestationDisplay from "./AttestationDisplay";
import { JSX } from "react/jsx-runtime";
import { DisplayProps } from "./AttestationDisplay.types";

export default {
  title: "ReactComponentLibrary/Rating",
  component: AttestationDisplay,
} as Meta<typeof AttestationDisplay>;

const Template: StoryFn<typeof AttestationDisplay> = (args: JSX.IntrinsicAttributes & DisplayProps) => <AttestationDisplay {...args} />;

export const RatingTest = Template.bind({});
RatingTest.args = {
  title: "Default theme",
  theme: "primary",
  testIdPrefix: "rating",
};

export const RatingSecondary = Template.bind({});
RatingSecondary.args = {
  title: "Secondary theme",
  theme: "secondary",
  testIdPrefix: "rating",
};
