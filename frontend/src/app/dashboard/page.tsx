import { Users, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string; 
  icon: React.ElementType; 
  trend: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{trend}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total de Clientes"
          value="1,284"
          icon={Users}
          trend="+12% em relação ao mês anterior"
        />
        <StatCard
          title="Produtos"
          value="847"
          icon={Package}
          trend="+23 novos este mês"
        />
        <StatCard
          title="Pedidos"
          value="342"
          icon={ShoppingCart}
          trend="+8% em relação ao mês anterior"
        />
        <StatCard
          title="Faturamento"
          value="R$ 45.231"
          icon={TrendingUp}
          trend="+15% em relação ao mês anterior"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "João Silva", action: "realizou um pedido", time: "2 minutos atrás" },
                { name: "Maria Santos", action: "cadastrou um produto", time: "15 minutos atrás" },
                { name: "Pedro Costa", action: "atualizou cadastro", time: "1 hora atrás" },
                { name: "Ana Paula", action: "cancelou um pedido", time: "2 horas atrás" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "#1234", customer: "Carlos Lima", value: "R$ 250,00", status: "Aguardando pagamento" },
                { id: "#1235", customer: "Beatriz Souza", value: "R$ 180,00", status: "Em separação" },
                { id: "#1236", customer: "Rafael Alves", value: "R$ 420,00", status: "Aguardando envio" },
                { id: "#1237", customer: "Juliana Rocha", value: "R$ 95,00", status: "Aguardando pagamento" },
              ].map((order, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.value}</p>
                    <p className="text-xs text-muted-foreground">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
