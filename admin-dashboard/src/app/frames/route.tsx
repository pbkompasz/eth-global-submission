/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
 
const frames = createFrames({
  basePath: "/frames",
});
const handleRequest = frames(async () => {
  return {
    title: "Attestation Frame",
    image: <span>{'first frame'}</span>,
    buttons: [<Button action="post">Next</Button>],
  };
});
 
export const GET = handleRequest;
export const POST = handleRequest;