'use client';

import { useState } from "react";
import { Plus, Search, Eye, Edit, Trash, Building2, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUnidades, useDeleteUnidade } from "@/hooks/use-unidades";
import { Badge } from "@/components/ui/badge";

const UnidadeListing = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useUnidades({
    search: searchTerm || undefined,
    page,
    limit,
    orderBy: 'created_at',
    order: 'desc',
  });

  const deleteMutation = useDeleteUnidade();

  const unidades = data?.unidades || [];
  const totalItems = data?.count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta unidade escolar?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Unidade escolar removida com sucesso!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao excluir unidade escolar");
    }
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/unidade/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/unidade/${id}/edit`);
  };

  const formatAddress = (unidade: any) => {
    const endereco = unidade.endereco;
    if (!endereco) return "-";
    
    const parts = [
      endereco.logradouro,
      endereco.numero && `nº ${endereco.numero}`,
      endereco.bairro,
      endereco.municipio?.nome,
      endereco.estado?.uf,
    ].filter(Boolean);
    
    return parts.join(", ") || "-";
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Erro ao carregar unidades escolares</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Unidades Escolares
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as unidades escolares cadastradas
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/unidade/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Unidade
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Unidades</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              unidades cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Página Atual</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{page}</div>
            <p className="text-xs text-muted-foreground">
              de {totalPages} páginas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unidades.length}</div>
            <p className="text-xs text-muted-foreground">
              nesta página
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Unidades Escolares</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as unidades escolares do sistema
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, código INEP ou endereço..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to first page on search
              }}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Carregando unidades...</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Código INEP</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unidades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                        <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Nenhuma unidade encontrada</p>
                        <p className="text-sm mt-1">
                          {searchTerm 
                            ? "Tente ajustar os termos de busca"
                            : "Comece cadastrando uma nova unidade escolar"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    unidades.map((unidade) => (
                      <TableRow 
                        key={unidade.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleView(unidade.id)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            {unidade.nome}
                          </div>
                        </TableCell>
                        <TableCell>
                          {unidade.codigo_inep ? (
                            <Badge variant="outline">{unidade.codigo_inep}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="max-w-md truncate">
                              {formatAddress(unidade)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(unidade.id);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(unidade.id);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(unidade.id);
                                }}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>)}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {((page - 1) * limit) + 1} até {Math.min(page * limit, totalItems)} de {totalItems} unidades
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnidadeListing;

