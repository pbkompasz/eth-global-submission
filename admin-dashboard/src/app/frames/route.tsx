/* eslint-disable react/jsx-key */
import { PrismaClient } from "@prisma/client";
import { createFrames, Button } from "frames.js/next";

const prisma = new PrismaClient();

export type State = {
  pos: number;
};

const frames = createFrames<State>({
  basePath: "/frames",
  initialState: {
    pos: 1,
  },
});

let frame;

const handleRequest = frames(async (ctx) => {
  console.log(ctx.searchParams);
  if (ctx.searchParams.uid) {
    const resp = await prisma.frame.findMany({
      where: {
        uid: ctx.searchParams.uid,
      },
    });
    frame = resp[0];
  }

  if (ctx.searchParams.pos) {
    ctx.state.pos = +ctx.searchParams.pos;
  }

  const resp = await prisma.item.findMany({
    where: {
      frameId: frame.id,
      pos: ctx.state.pos,
    },
  });

  const item = resp[0];

  return {
    title: "Attestation Frame",
    image: <span>{item.image}</span>,
    textInput: item.input,
    buttons: [
      item.button1 ? (
        <Button action="post" target={{ query: { pos: ctx.state.pos+1 } }}>
          {item.button1}
        </Button>
      ) : null,
      item.button2 ? <Button action="post">{item.button2}</Button> : null,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
