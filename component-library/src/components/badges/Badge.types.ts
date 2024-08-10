import { Signer, Provider } from "ethers";

export interface BadgeProps {
  testIdPrefix: string;
  attestationUid: string;
  provider: Provider;
  signer?: Signer;
  theme: "primary" | "secondary";
  title?: string;
  description?: string;
  clickable?: boolean;
  showTransaction: boolean;
  showSchema: boolean;
  showActions: boolean;
}
