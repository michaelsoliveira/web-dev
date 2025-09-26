-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "public"."TipoPessoa" AS ENUM ('F', 'J');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pessoa" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" "public"."TipoPessoa" NOT NULL DEFAULT 'F',
    "email" VARCHAR,
    "telefone" TEXT,
    "endereco_id" UUID,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pessoa_fisica" (
    "pessoa_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "rg" TEXT,
    "cpf" VARCHAR(14),
    "data_nascimento" DATE,

    CONSTRAINT "pessoa_fisica_pkey" PRIMARY KEY ("pessoa_id")
);

-- CreateTable
CREATE TABLE "public"."pessoa_juridica" (
    "pessoa_id" UUID NOT NULL,
    "nome_fantasia" TEXT NOT NULL,
    "razao_social" TEXT,
    "inscricao_estadual" TEXT,
    "inscricao_federal" VARCHAR(30),
    "data_constituicao" DATE,

    CONSTRAINT "pessoa_juridica_pkey" PRIMARY KEY ("pessoa_id")
);

-- CreateTable
CREATE TABLE "public"."Municipio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ibge" INTEGER,
    "estado_id" INTEGER NOT NULL,

    CONSTRAINT "Municipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Estado" (
    "id" SERIAL NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "nome" TEXT NOT NULL,
    "ibge" INTEGER,
    "ddd" JSONB,

    CONSTRAINT "Estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."endereco" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cep" VARCHAR(9),
    "logradouro" VARCHAR NOT NULL,
    "numero" TEXT,
    "bairro" VARCHAR,
    "estado_id" INTEGER,
    "municipio_id" INTEGER,
    "complemento" VARCHAR,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."aluno" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "pessoa_id" UUID NOT NULL,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."unidade_escolar" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome" TEXT NOT NULL,
    "codigo_inep" TEXT,
    "endereco_id" UUID,

    CONSTRAINT "unidade_escolar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."diretor" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "pessoa_id" UUID NOT NULL,
    "unidade_id" UUID NOT NULL,

    CONSTRAINT "diretor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."professor" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "pessoa_id" UUID NOT NULL,
    "unidade_id" UUID NOT NULL,

    CONSTRAINT "professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."turma" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nome" TEXT NOT NULL,
    "ano_letivo" INTEGER NOT NULL,
    "unidade_id" UUID NOT NULL,

    CONSTRAINT "turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."disciplina" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nome" TEXT NOT NULL,

    CONSTRAINT "disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."turma_professor" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "turma_id" UUID NOT NULL,
    "professor_id" UUID NOT NULL,
    "disciplina_id" UUID NOT NULL,

    CONSTRAINT "turma_professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."matricula" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "aluno_id" UUID NOT NULL,
    "turma_id" UUID NOT NULL,
    "data_matricula" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matricula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_PessoaToUnidadeEscolar" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_PessoaToUnidadeEscolar_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "_PessoaToUnidadeEscolar_B_index" ON "public"."_PessoaToUnidadeEscolar"("B");

-- AddForeignKey
ALTER TABLE "public"."pessoa" ADD CONSTRAINT "pessoa_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "public"."endereco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pessoa_fisica" ADD CONSTRAINT "pessoa_fisica_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "public"."pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pessoa_juridica" ADD CONSTRAINT "pessoa_juridica_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "public"."pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Municipio" ADD CONSTRAINT "Municipio_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "public"."Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."endereco" ADD CONSTRAINT "endereco_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "public"."Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."endereco" ADD CONSTRAINT "endereco_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "public"."Municipio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."aluno" ADD CONSTRAINT "aluno_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "public"."pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."unidade_escolar" ADD CONSTRAINT "unidade_escolar_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "public"."endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."diretor" ADD CONSTRAINT "diretor_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "public"."pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."diretor" ADD CONSTRAINT "diretor_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidade_escolar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."professor" ADD CONSTRAINT "professor_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "public"."pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."professor" ADD CONSTRAINT "professor_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidade_escolar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."turma" ADD CONSTRAINT "turma_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidade_escolar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."turma_professor" ADD CONSTRAINT "turma_professor_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "public"."turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."turma_professor" ADD CONSTRAINT "turma_professor_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "public"."professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."turma_professor" ADD CONSTRAINT "turma_professor_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "public"."disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."matricula" ADD CONSTRAINT "matricula_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."matricula" ADD CONSTRAINT "matricula_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "public"."turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PessoaToUnidadeEscolar" ADD CONSTRAINT "_PessoaToUnidadeEscolar_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PessoaToUnidadeEscolar" ADD CONSTRAINT "_PessoaToUnidadeEscolar_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."unidade_escolar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
