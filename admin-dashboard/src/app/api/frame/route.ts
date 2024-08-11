import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const frameData = searchParams.get("frame-data");

  if (!frameData)
    return NextResponse.json({ error: "Missing frame data" }, { status: 500 });

  console.log(JSON.parse(frameData));

  const { type, itemsLength, items, uid } = JSON.parse(frameData);

  const prisma = new PrismaClient();

  try {
    const frame = await prisma.frame.create({
      data: { type, itemsLength, uid },
    });
    await Promise.all(
      items.map(
        async (item: {
          pos: any;
          image: any;
          input: any;
          button1: any;
          button2: any;
          button3: any;
          button4: any;
        }) => {
          return await prisma.item.create({
            data: {
              pos: item.pos,
              frameId: frame.id,
              image: item.image,
              input: item.input,
              button1: item.button1,
              button2: item.button2,
              button3: item.button3,
              button4: item.button4,
            },
          });
        }
      )
    );
    return NextResponse.json({ id: "1" }, { status: 200 });
  } catch (error: Error | any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
