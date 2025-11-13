'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { UnidadeFormData, unidadeSchema } from "./utils/form-schema";
import { useCreateUnidade, useUpdateUnidade, useUnidade } from "@/hooks/use-unidades";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

interface UnidadeFormProps {
  initialData?: any;
  onClose?: () => void;
}

const UnidadeForm = ({ initialData, onClose }: UnidadeFormProps) => {
  const router = useRouter();
  const isEditMode = !!initialData?.id;
  const [isLoading, setIsLoading] = useState(false);

  const { data: unidadeData, isLoading: isLoadingUnidade } = useUnidade(initialData?.id || '');
  const createMutation = useCreateUnidade();
  const updateMutation = useUpdateUnidade();

  const form = useForm<UnidadeFormData>({
    resolver: zodResolver(unidadeSchema),
    defaultValues: {
      nome: "",
      codigo_inep: "",
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      complemento: "",
      estado_id: "",
      municipio_id: "",
    },
    mode: 'onChange'
  });

  // Carrega dados da unidade quando em modo de edição
  useEffect(() => {
    console.log(unidadeData)
    if (isEditMode && unidadeData) {
      form.reset({
        id: unidadeData.id,
        nome: unidadeData.nome || "",
        codigo_inep: unidadeData.codigo_inep || "",
        endereco_id: unidadeData.endereco?.id || "",
        cep: unidadeData.endereco?.cep || "",
        logradouro: unidadeData.endereco?.logradouro || "",
        numero: unidadeData.endereco?.numero || "",
        bairro: unidadeData.endereco?.bairro || "",
        complemento: unidadeData.endereco?.complemento || "",
        estado_id: unidadeData.endereco?.estado?.id?.toString() || "",
        municipio_id: unidadeData.endereco?.municipio?.id?.toString() || "",
      });
    }
  }, [unidadeData, isEditMode, form]);

  const onSubmit = async (data: UnidadeFormData) => {
    try {
      setIsLoading(true);

      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data,
        });
        toast.success("Unidade escolar atualizada com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Unidade escolar cadastrada com sucesso!");
      }

      form.reset();
      
      if (onClose) {
        onClose();
      } else {
        setTimeout(() => router.push("/dashboard/unidade"), 1500);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao salvar unidade escolar");
      console.error("Erro ao salvar unidade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/dashboard/unidade");
    }
  };

  if (isEditMode && isLoadingUnidade) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Carregando dados da unidade...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          disabled={isLoading}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditMode ? "Editar Unidade Escolar" : "Nova Unidade Escolar"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode 
              ? "Atualize as informações da unidade escolar"
              : "Preencha os dados para cadastrar uma nova unidade escolar"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Seção: Dados da Unidade */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Dados da Unidade Escolar</CardTitle>
              </div>
              <CardDescription>
                Informações básicas da unidade escolar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome da Unidade *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Escola Municipal de Ensino Fundamental" 
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codigo_inep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código INEP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="00000000" 
                          {...field}
                          disabled={isLoading}
                          maxLength={8}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Seção: Endereço */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>Endereço</CardTitle>
              </div>
              <CardDescription>
                Localização da unidade escolar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="00000-000" 
                          {...field}
                          disabled={isLoading}
                          maxLength={9}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="UF" 
                          {...field}
                          disabled={isLoading}
                          maxLength={2}
                          className="uppercase"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="municipio_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Município</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome do município" 
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="logradouro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Rua, Avenida, etc." 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123" 
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome do bairro" 
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="complemento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Apto, Bloco, etc." 
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Botões de ação */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : isEditMode ? "Atualizar Unidade" : "Cadastrar Unidade"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UnidadeForm;

