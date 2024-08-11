"use client";
import React, { useEffect, useState } from "react";
import { getSchema } from "component-library/src/eas";
import AttestationForm from "component-library/src/components/forms";
import { ethers, Signer } from "ethers";
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

const createData = (uid: string) => {
  return { name, uid };
};

const rows = [
  createData(
    "0x6dee028cb86e60e2884fe261bd0c4e701f7cdfaea0e42aec5628ec96d4b3e10f"
  ),
];

const alchemyApiUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const network = "sepolia";
const provider = new ethers.JsonRpcProvider(alchemyApiUrl, network);

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

  const [signer, setSigner] = useState<Signer>();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`
       <AttestationForm
        schemaUid="${uid}"
        title="Simple attestation"
        description="Sample description"
        theme="primary"
        provider={provider}
        signer={signer as Signer}
        testIdPrefix="123"
      ></AttestationForm>
    `);
  };

  useEffect(() => {
    (async () => {
      setSigner(await provider.getSigner());
    })();
  }, []);

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
      <AttestationForm
        schemaUid={uid}
        title="Simple attestation"
        description="Sample description"
        theme="primary"
        provider={provider}
        signer={signer as Signer}
        testIdPrefix="123"
      ></AttestationForm>
    </Dialog>
  );
}

export default function Attestation() {
  const [schemaUid, setSchemaUid] = React.useState(
    "0x6dee028cb86e60e2884fe261bd0c4e701f7cdfaea0e42aec5628ec96d4b3e10f"
  );
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [deployed, setDeployed] = React.useState(false);
  const [includeProof, setIncludeProof] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const createFrame = async () => {
    setLoading(true);
    setStatus("Fetching schema");
    const schema = await getSchema(
      schemaUid,
      "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
      provider
    );
    console.log(schema);
    setStatus("Creating frame");
    // buildFrame(schema);
    setStatus("Deploying frame");
    // deployFrame();
    setLoading(false);
    setStatus("");
    setDeployed(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Attestation UID</TableCell>
              <TableCell align="center">Frame</TableCell>
              <TableCell align="center">Badge</TableCell>
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
                  <Stack direction="row">
                    {loading && <CircularProgress />}
                    {status}
                  </Stack>
                  {deployed ? (
                    <Button
                      variant="outlined"
                      href={`${process.env.FRAME_DEBUGGER_URL}/?url=http://localhost:3000/frames`}
                      target="_blank"
                    >
                      View frame
                    </Button>
                  ) : (
                    <Button variant="outlined" onClick={() => createFrame()}>
                      Generate Attestation Frame
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
                    View form
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <BadgeDialog
        open={open}
        onClose={handleClose}
        uid="0x6dee028cb86e60e2884fe261bd0c4e701f7cdfaea0e42aec5628ec96d4b3e10f"
      />
    </div>
  );
}
