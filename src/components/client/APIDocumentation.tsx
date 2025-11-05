import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useState } from "react";

const APIDocumentation = () => {
  const [showKey, setShowKey] = useState(false);
  const apiKey = "lc_live_pk_1a2b3c4d5e6f7g8h9i0j";

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/highlights",
      description: "Retrieve all highlights for your account",
      params: ["sport", "date", "team", "event_type"],
    },
    {
      method: "GET",
      path: "/api/v1/highlights/:id",
      description: "Get a specific highlight by ID",
      params: ["format (16:9, 9:16, 1:1)"],
    },
    {
      method: "POST",
      path: "/api/v1/publish",
      description: "Publish a highlight to connected platforms",
      params: ["highlight_id", "platforms[]"],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">API Access</h2>
        <p className="text-muted-foreground">Integrate LiveClip AI into your applications</p>
      </div>

      {/* API Key */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
        <h3 className="text-lg font-semibold mb-4">Your API Key</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 p-3 rounded-lg bg-secondary/50 border border-border font-mono text-sm">
            {showKey ? apiKey : "••••••••••••••••••••••••"}
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowKey(!showKey)}>
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Keep your API key secure. Never share it publicly or commit it to version control.
        </p>
      </Card>

      {/* Base URL */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
        <h3 className="text-lg font-semibold mb-2">Base URL</h3>
        <code className="block p-3 rounded-lg bg-secondary/50 border border-border text-sm font-mono">
          https://api.liveclip.ai
        </code>
      </Card>

      {/* Endpoints */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Endpoints</h3>
        {endpoints.map((endpoint, index) => (
          <Card key={index} className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
            <div className="flex items-start gap-4 mb-3">
              <Badge
                variant="outline"
                className={
                  endpoint.method === "GET"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-accent/10 text-accent border-accent/20"
                }
              >
                {endpoint.method}
              </Badge>
              <div className="flex-1">
                <code className="text-sm font-mono">{endpoint.path}</code>
                <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Parameters:</p>
              <div className="flex flex-wrap gap-2">
                {endpoint.params.map((param) => (
                  <Badge key={param} variant="secondary" className="text-xs">
                    {param}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Example Request */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
        <h3 className="text-lg font-semibold mb-4">Example Request</h3>
        <pre className="p-4 rounded-lg bg-secondary/50 border border-border text-sm overflow-x-auto">
          <code>{`curl -X GET "https://api.liveclip.ai/api/v1/highlights?sport=basketball" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
        </pre>
      </Card>

      {/* Rate Limits */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
        <h3 className="text-lg font-semibold mb-4">Rate Limits</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-2xl font-bold text-primary">1,000</p>
            <p className="text-sm text-muted-foreground">Requests per hour</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">10,000</p>
            <p className="text-sm text-muted-foreground">Requests per day</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">50</p>
            <p className="text-sm text-muted-foreground">Concurrent requests</p>
          </div>
        </div>
      </Card>

      <Button className="w-full">
        View Full Documentation
      </Button>
    </div>
  );
};

export default APIDocumentation;
