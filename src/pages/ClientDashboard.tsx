import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Upload, Share2, Settings, Key, LogOut } from "lucide-react";
import HighlightLibrary from "@/components/client/HighlightLibrary";
import BrandingSettings from "@/components/client/BrandingSettings";
import APIDocumentation from "@/components/client/APIDocumentation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("library");
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <ProtectedRoute requiredRole="client">
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Video className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LiveClip AI</h1>
                <p className="text-sm text-muted-foreground">Client Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Quick Publish
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="library">
              <Video className="h-4 w-4 mr-2" />
              Highlight Library
            </TabsTrigger>
            <TabsTrigger value="branding">
              <Settings className="h-4 w-4 mr-2" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="h-4 w-4 mr-2" />
              API Access
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-6">
            <HighlightLibrary />
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <BrandingSettings />
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <APIDocumentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default ClientDashboard;
