import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Video, Zap, Settings, TrendingUp, Users, LogOut, Shield, UserCircle } from "lucide-react";
import LiveFeedMonitor from "@/components/admin/LiveFeedMonitor";
import AIModelConfig from "@/components/admin/AIModelConfig";
import SystemHealth from "@/components/admin/SystemHealth";
import UserRoleManagement from "@/components/admin/UserRoleManagement";
import RoleAuditLogs from "@/components/admin/RoleAuditLogs";
import UserListView from "@/components/admin/UserListView";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("feeds");
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const stats = [
    { label: "Active Feeds", value: "12", icon: Video, trend: "+3", color: "text-primary" },
    { label: "Highlights Generated", value: "1,247", icon: Zap, trend: "+156", color: "text-accent" },
    { label: "Processing Rate", value: "98.2%", icon: TrendingUp, trend: "+2.1%", color: "text-success" },
    { label: "Active Clients", value: "34", icon: Users, trend: "+5", color: "text-warning" },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LiveClip AI</h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                System Healthy
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend} today
                  </Badge>
                </div>
                <div className={`p-3 rounded-lg bg-secondary/50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="feeds">Live Feeds</TabsTrigger>
            <TabsTrigger value="models">AI Models</TabsTrigger>
            <TabsTrigger value="health">System Health</TabsTrigger>
            <TabsTrigger value="users">
              <UserCircle className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="roles">
              <Shield className="h-4 w-4 mr-2" />
              User Roles
            </TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="feeds" className="space-y-6">
            <LiveFeedMonitor />
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <AIModelConfig />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <SystemHealth />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserListView />
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <UserRoleManagement />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <RoleAuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
