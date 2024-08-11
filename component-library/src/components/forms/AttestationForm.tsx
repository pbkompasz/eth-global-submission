import { FormEvent, useEffect, useState } from "react";
import React from "react"
import { createAttestation, getSchema } from "../../eas";
import { Field } from "../../types";
import "./AttestationForm.scss";
import { FormProps } from "./AttestationForm.types";
import { SchemaRecord } from "@ethereum-attestation-service/eas-sdk";

export const checkAttestationFieldsMatch = async (
  uid: string,
  fields: Field[]
) => {};

interface input {
  [key: string]: any;
}

const AttestationForm = (props: FormProps) => {
  const [schema, setSchema] = useState<SchemaRecord>();
  const [error, setError] = useState("");
  const [inputs, setInputs] = useState({});

  const handleChange = (event: FormEvent<HTMLInputElement>, type: string) => {
    const { name, value } = event.target as HTMLInputElement;

    const properValue =
      type === "bool"
        ? value === "true"
        : type.includes("string")
          ? String(value)
          : +value;

    setInputs((prev) => {
      return { ...prev, [name]: properValue };
    });
  };

  const createInput = (fieldString: string, index: number) => {
    const split = fieldString.split(" ");
    const name = split[1];
    const textInputTypes = ["address", "string", "bytes", "int"];
    const checkboxTypes = ["bool"];
    const label = <label className="form__fields__label" htmlFor={String(index)}>{name}</label>;
    if (textInputTypes.find((type) => split[0].includes(type))) {
      return (
        <div className="form__fields__input">
          {label}
          <input
            type="text"
            id={String(index)}
            name={name}
            onChange={(e) => handleChange(e, split[0])}
          />
        </div>
      );
    } else if (checkboxTypes.find((type) => split[0].includes(type))) {
      return (
        <div className="form__fields__bool">
          <input
            type="checkbox"
            id={String(index)}
            name={name}
            onChange={(e) => {
              e.target.value = String(e.target.value === "on");
              handleChange(e, "bool");
            }}
          />
          {label}
        </div>
      );
    }
  };

  useEffect(() => {
    getSchema(
      props.schemaUid,
      "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
      props.provider
    ).then((schema) => {
      setSchema(schema);
    });
  }, []);

  const submitAttestation = async (e: FormEvent) => {
    e.preventDefault();

    if (!schema) {
      setError("Schema not found");
      return;
    }

    if (schema.schema.split(",").length !== Object.keys(inputs).length) {
      setError("All inputs are required");
      return;
    }

    // Create data
    const data = schema.schema.split(",").map((field) => {
      const split = field.split(" ");
      console.log(split);
      return {
        name: split[1],
        type: split[0],
        // @ts-ignore
        value: inputs[split[1]],
      };
    });

    await createAttestation(
      props.signer,
      props.schemaUid,
      schema?.schema,
      data,
      props.recipient,
      props.expirationDate,
      props.revocable
    );
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <form
        className={`form rating-${props.theme}`}
        onSubmit={(e) => submitAttestation(e)}
      >
        <h1 className="form__title">{props.title}</h1>
        <div className="form__fields">
          {schema?.schema
            .split(",")
            .map((schemaString, index) => createInput(schemaString, index))}
        </div>
        <input
          className="form__action"
          type="submit"
          value={props.buttonText ?? "Submit"}
        />
      </form>
    </>
  );
};

export default AttestationForm;
