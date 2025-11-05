'use client';

import UnidadeForm from "@/features/unidade/unidade-form";
import { useUnidade } from "@/hooks/use-unidades";
import { useParams } from "next/navigation";

const UnidadeFormPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const isEditMode = id && id !== 'new';
  
  const { data: unidade } = useUnidade(isEditMode ? id : '');
  
  return <UnidadeForm initialData={isEditMode && unidade ? { id } : undefined} />;
}

export default UnidadeFormPage;
