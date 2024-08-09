export interface DisplayProps {
  testIdPrefix: string;
  attestationAddress: string;
  theme: "primary" | "secondary";
  title?: string;
  description?: string;
  disabled?: boolean;
}
