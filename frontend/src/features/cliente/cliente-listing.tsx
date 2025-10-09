'use client';

import { useState } from "react";
import { Plus, Search, Eye, Edit, Trash } from "lucide-react";
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

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
}

const mockClientes: Cliente[] = [
  { id: 1, nome: "João da Silva", email: "joao@email.com", telefone: "(11) 99999-9999", cidade: "São Paulo", estado: "SP" },
  { id: 2, nome: "Maria Santos", email: "maria@email.com", telefone: "(21) 98888-8888", cidade: "Rio de Janeiro", estado: "RJ" },
  { id: 3, nome: "Pedro Costa", email: "pedro@email.com", telefone: "(31) 97777-7777", cidade: "Belo Horizonte", estado: "MG" },
  { id: 4, nome: "Ana Paula", email: "ana@email.com", telefone: "(41) 96666-6666", cidade: "Curitiba", estado: "PR" },
  { id: 5, nome: "Carlos Lima", email: "carlos@email.com", telefone: "(51) 95555-5555", cidade: "Porto Alegre", estado: "RS" },
  { id: 6, nome: "Beatriz Souza", email: "beatriz@email.com", telefone: "(61) 94444-4444", cidade: "Brasília", estado: "DF" },
  { id: 7, nome: "Rafael Alves", email: "rafael@email.com", telefone: "(71) 93333-3333", cidade: "Salvador", estado: "BA" },
  { id: 8, nome: "Juliana Rocha", email: "juliana@email.com", telefone: "(81) 92222-2222", cidade: "Recife", estado: "PE" },
];

const ClienteListing = () => {
    const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState(mockClientes);

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setClientes(clientes.filter((c) => c.id !== id));
    toast.success("Cliente removido com sucesso!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
        <Button onClick={() => router.push("/dashboard/cliente/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Gerencie todos os clientes cadastrados</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nome}</TableCell>
                      <TableCell>{cliente.email}</TableCell>
                      <TableCell>{cliente.telefone}</TableCell>
                      <TableCell>{cliente.cidade}</TableCell>
                      <TableCell>{cliente.estado}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-destructive focus:text-destructive"
                              onClick={() => handleDelete(cliente.id)}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClienteListing;
