-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL,
    "frameId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "button1" TEXT NOT NULL,
    "button2" TEXT NOT NULL,
    "button3" TEXT NOT NULL,
    "button4" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Frame" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "itemsLength" INTEGER NOT NULL,

    CONSTRAINT "Frame_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
