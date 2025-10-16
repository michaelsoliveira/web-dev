/*
  Warnings:

  - You are about to drop the `Estado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Municipio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Municipio" DROP CONSTRAINT "Municipio_estado_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."endereco" DROP CONSTRAINT "endereco_estado_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."endereco" DROP CONSTRAINT "endereco_municipio_id_fkey";

-- DropTable
DROP TABLE "public"."Estado";

-- DropTable
DROP TABLE "public"."Municipio";

-- CreateTable
CREATE TABLE "public"."municipio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ibge" INTEGER,
    "estado_id" INTEGER NOT NULL,

    CONSTRAINT "municipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."estado" (
    "id" SERIAL NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "nome" TEXT NOT NULL,
    "ibge" INTEGER,
    "ddd" JSONB,

    CONSTRAINT "estado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."municipio" ADD CONSTRAINT "municipio_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "public"."estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."endereco" ADD CONSTRAINT "endereco_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "public"."estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."endereco" ADD CONSTRAINT "endereco_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "public"."municipio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
