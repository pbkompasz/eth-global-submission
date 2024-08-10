import React, { useEffect, useState } from "react";
import "./SimpleBadge.scss";
import { BadgeProps } from "./Badge.types";
import { decodeData, getAttestation, getSchema } from "../../eas";
import {
  Attestation,
  SchemaDecodedItem,
  SchemaRecord,
} from "@ethereum-attestation-service/eas-sdk";
import dateFormat from "dateformat";

// TODO
// Doesn't exist
// Revoked
// Expired
// Good
// If admin, have option to revoke
// If admin, have option to view all attestation from address
// Icons tooltip
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
};

const isZeroAddress = (address: string) => {
  return address === "0x0000000000000000000000000000000000000000";
};

const AttestationDisplay: React.FC<BadgeProps> = (props) => {
  const [attestation, setAttestation] = useState<Attestation>();
  const [schema, setSchema] = useState<SchemaRecord>();
  const [decodedData, setDecodedData] = useState<SchemaDecodedItem[]>([]);

  const { attestationUid, clickable } = props;

  const openInNewTab = (url: string) => {
    if (clickable === false) return;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const downloadAttestation = () => {};

  useEffect(() => {
    getAttestation(attestationUid, props.provider).then((attestation) => {
      setAttestation(attestation);
      if (props.showSchema) {
        getSchema(
          attestation.schema,
          "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
          props.provider
        ).then((schema) => {
          console.log(schema);
          const decodedData = decodeData(schema.schema, attestation.data);
          setDecodedData(decodedData);
          setSchema(schema);
        });
      }
    });
  }, []);

  return attestation ? (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <div className={`badge rating-${props.theme}`}>
        <div
          className={`badge__header  ${clickable === false ? "" : "clickable"}`}
          onClick={() =>
            openInNewTab(
              `https://easscan.org/offchain/attestation/view/${attestationUid}`
            )
          }
        >
          <div className="badge__header__title">
            <h1 className="">{props.title}</h1>
            <span className="material-symbols-outlined">done_all</span>
          </div>
          <div className="badge__header__info">
            <p className="badge__header__info__time">
              {formatTime(Number(attestation.time))}
            </p>
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
        {props.showTransaction === true && (
          <>
            <hr className="divider" />
            <div className="badge__transaction">
              <div>
                <p>FROM:</p>
                <a
                  href={`https://sepolia.easscan.org/address/${attestation.attester}`}
                  target="_blank"
                >
                  {attestation.attester}
                </a>
              </div>
              <div>
                <p>TO:</p>
                <a
                  href={`https://sepolia.easscan.org/address/${attestation.recipient}`}
                  target="_blank"
                >
                  {attestation.recipient}
                </a>
              </div>
            </div>
          </>
        )}
        {props.showSchema === true && (
          <>
            <hr className="divider" />
            <div className="badge__schema">
              <div className="badge__schema__header">
                <div className="badge__schema__header__title">
                  <p>Schema</p>

                  <a
                    href={`https://sepolia.easscan.org/schema/view/${schema?.uid}`}
                    target="_blank"
                    className="badge__schema__header__title__uid"
                  >
                    {schema?.uid}
                  </a>
                </div>
                <div className="badge__schema__header__info">
                  {schema?.resolver && !isZeroAddress(schema?.resolver) && (
                    <a>{schema?.resolver}</a>
                  )}
                  {schema?.revocable && (
                    <span className="material-symbols-outlined">
                      published_with_changes
                    </span>
                  )}
                </div>
              </div>
              {schema?.schema &&
                decodedData.map((field, index) => (
                  <div className="badge__schema__field" key={index}>
                    <div className="badge__schema__field__type">
                      {field.type}
                    </div>
                    <div className="badge__schema__field__name">
                      {field.name}
                    </div>
                    <div className="badge__schema__field__value">
                      {Number(field.value.value)}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
        {props.showActions === true && (
          <>
            <hr className="divider" />
            <div className="badge__actions">
              <button onClick={() => downloadAttestation()}>Download</button>
              {/* TODO */}
              {/* <button>Revoke</button> */}
            </div>
          </>
        )}
      </div>
    </>
  ) : (
    <>no such attestation</>
  );
};

export default AttestationDisplay;
