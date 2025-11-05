import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Database, Zap, CheckCircle } from "lucide-react";

const SystemHealth = () => {
  const services = [
    { name: "Video Ingestion Pipeline", status: "operational", uptime: "99.98%", latency: "124ms" },
    { name: "AI Processing Cluster", status: "operational", uptime: "99.95%", latency: "3.2s" },
    { name: "Database Cluster", status: "operational", uptime: "99.99%", latency: "12ms" },
    { name: "CDN Distribution", status: "operational", uptime: "99.97%", latency: "45ms" },
    { name: "API Gateway", status: "operational", uptime: "99.96%", latency: "28ms" },
  ];

  const metrics = [
    { label: "Total Processing Time", value: "847 hours", icon: Zap },
    { label: "Data Processed", value: "12.4 TB", icon: Database },
    { label: "Active Instances", value: "24", icon: Server },
    { label: "Uptime", value: "99.97%", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">System Health</h2>
        <p className="text-muted-foreground">Real-time infrastructure monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <metric.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
        <h3 className="text-lg font-bold mb-4">Service Status</h3>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground">Latency: {service.latency}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{service.uptime}</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  Operational
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SystemHealth;
