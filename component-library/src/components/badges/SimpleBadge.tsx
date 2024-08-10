import React, { useEffect, useState } from "react";
import "./SimpleBadge.scss";
import { BadgeProps } from "./Badge.types";
import { createConnection, getAttestation } from "../../eas";
import { Attestation } from "@ethereum-attestation-service/eas-sdk";
import dateFormat from "dateformat"

// TODO
// Doesn't exist
// Revoked
// Expired
// Good
// If admin, have option to revoke
// If admin, have option to view all attestation from address
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
};

const AttestationDisplay: React.FC<BadgeProps> = (props) => {
  const [attestation, setAttestation] = useState<Attestation>();

  const { attestationUid, clickable } = props;
  console.log(props.clickable)

  const openInNewTab = (url: string) => {
    if (clickable === false) return;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  useEffect(() => {
    getAttestation(attestationUid).then((attestation) => {
      console.log(attestation);
      setAttestation(attestation);
    });
  }, []);

  return attestation ? (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <div
        className={`badge rating-${props.theme} ${clickable === false ? "" : "clickable"} }`}
        onClick={() =>
          openInNewTab(
            `https://easscan.org/offchain/attestation/view/${attestationUid}`
          )
        }
      >
        <div className="badge__header">
          <div className="badge__header__title">
            <h1 className="">{props.title}</h1>
            <span className="material-symbols-outlined">done_all</span>
          </div>
          <div className="badge__header__info">
            <p className="badge__header__info__time">{formatTime(Number(attestation.time))}</p>
            <span className="material-symbols-outlined">
              {Number(attestation.expirationTime) === 0
                ? "hourglass_disabled"
                : "hourglass"}
            </span>
            {Number(attestation.revocationTime) !== 0 && (
              <span className="material-symbols-outlined">restart_alt</span>
            )}
          </div>
        </div>
        <p className="badge__description">{props.description}</p>
        <hr className="divider"/>

        asd
      </div>
    </>
  ) : (
    <>no such attestation</>
  );
};

export default AttestationDisplay;
