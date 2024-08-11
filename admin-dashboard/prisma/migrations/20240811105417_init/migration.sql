-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "pos" INTEGER NOT NULL,
    "frameId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "input" TEXT,
    "button1" TEXT,
    "button2" TEXT,
    "button3" TEXT,
    "button4" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Frame" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "itemsLength" INTEGER NOT NULL,

    CONSTRAINT "Frame_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
