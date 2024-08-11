"use client";
import React, { useState } from "react";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { getAttestation, getSchema } from "component-library/src/eas";
import SimpleBadge from "component-library/src/components/badges";
import { ethers } from "ethers";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const alchemyApiUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const network = "sepolia";
const provider = new ethers.JsonRpcProvider(alchemyApiUrl, network);

const createData = (uid: string) => {
  return { uid };
};

const rows = [
  createData(
    "0x23b1e2fc7560357e478597cb47bbc8ba00576a1b0a72ddc3200cdd3fd31f4558"
  ),
];

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  uid: string;
}

function BadgeDialog(props: SimpleDialogProps) {
  const { onClose, open, uid } = props;

  const handleClose = () => {
    onClose(uid);
  };

  const [showTransaction, setShowTransaction] = useState(true);
  const [showSchema, setShowSchema] = useState(true);
  const [showActions, setShowActions] = useState(true);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`
       <SimpleBadge
        attestationUid="${uid}"
        title="Simple attestation"
        description="Sample description"
        theme="primary"
        ${showTransaction ? "showTransaction={showTransaction}" : ""}
        ${showSchema ? "showSchema={showSchema}" : ""}
        ${showActions ? "showActions={showActions}" : ""}
        provider={provider}
        testIdPrefix="123"
      ></SimpleBadge>
    `);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          style={{ maxWidth: "100%", overflow: "hidden" }}
        >
          <div
            style={{
              maxWidth: "80%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {uid}
          </div>
          <Button onClick={() => copyToClipboard()}>
            <ContentCopyIcon />
          </Button>
        </Stack>
      </DialogTitle>
      <FormGroup style={{ padding: "0 2rem" }}>
        <FormControlLabel
          checked={showTransaction}
          onChange={(e) => setShowTransaction(e.target.checked)}
          control={<Checkbox defaultChecked />}
          label="Include transaction"
        />
        <FormControlLabel
          checked={showSchema}
          onChange={(e) => setShowSchema(e.target.checked)}
          control={<Checkbox />}
          label="Include schema"
        />
        <FormControlLabel
          checked={showActions}
          onChange={(e) => setShowActions(e.target.checked)}
          control={<Checkbox />}
          label="Include actions"
        />
      </FormGroup>
      <SimpleBadge
        attestationUid={uid}
        title="Simple attestation"
        description="Sample description"
        theme="primary"
        showTransaction={showTransaction}
        showSchema={showSchema}
        showActions={showActions}
        provider={provider}
        testIdPrefix="123"
      ></SimpleBadge>
    </Dialog>
  );
}

export default function Attestation() {
  const [attestationUid, setAttestationUid] = React.useState(
    "0x23b1e2fc7560357e478597cb47bbc8ba00576a1b0a72ddc3200cdd3fd31f4558"
  );
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [deployed, setDeployed] = React.useState(false);
  const [includeProof, setIncludeProof] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const buildFrame = (attestation: any) => {
    const image = `Valid attestation (${Number(attestation.time)}) created by ${
      attestation.attester
    }`;
    const type = "proof";
    const button1 = "View attestation";

    return {
      type,
      uid: attestation.uid,
      itemsLength: 1,
      items: [
        {
          pos: 1,
          image,
          button1,
        },
      ],
    };
  };

  const deployFrame = async (frame: object) => {
    const response = await fetch(
      `api/frame?frame-data=${JSON.stringify(frame)}`
    );
    const resp = await response.json();
    return resp;
  };

  const createFrame = async () => {
    setLoading(true);
    setStatus("Fetching schema");
    const attesttaion = await getAttestation(
      "0x23b1e2fc7560357e478597cb47bbc8ba00576a1b0a72ddc3200cdd3fd31f4558",
      provider
    );
    console.log(attesttaion);
    setStatus("Creating frame");
    const frame = buildFrame(attesttaion);
    setStatus("Deploying frame");
    await deployFrame(frame);
    setLoading(false);
    setStatus("");
    setDeployed(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <div>
      <h1
        style={{ marginBottom: "1rem", fontWeight: "bold", fontSize: "26px" }}
      >
        Attestations
      </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Attestation UID</TableCell>
              <TableCell align="center">Frame</TableCell>
              <TableCell align="center">Badge</TableCell>
              <TableCell align="center">Revoke</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.uid}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.uid}
                </TableCell>
                <TableCell align="center">
                  {deployed ? (
                    <Button
                      variant="outlined"
                      href={`${process.env.FRAME_DEBUGGER_URL}/?url=http://localhost:3000/frames?uid=${attestationUid}`}
                      target="_blank"
                    >
                      View frame
                      <ArrowOutwardIcon />
                    </Button>
                  ) : (
                    <Button variant="outlined" onClick={() => createFrame()}>
                      {loading ? (
                        <Stack direction="row" alignItems="baseline">
                          <CircularProgress size="small" />
                          {status}
                        </Stack>
                      ) : (
                        "Generate Attestation Frame"
                      )}
                    </Button>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    View Badge
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained">Revoke</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <BadgeDialog
        open={open}
        onClose={handleClose}
        uid="0x23b1e2fc7560357e478597cb47bbc8ba00576a1b0a72ddc3200cdd3fd31f4558"
      />
    </div>
  );
}

// TODO
// Generate attest frame 2hr
// Generate proof frame 1hr
// Cleanup items 30min
// Small util/functionality 1hr
// Revoke attestation 30min
