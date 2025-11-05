import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Settings, Eye } from "lucide-react";

const mockFeeds = [
  { id: 1, name: "NBA Finals - Game 3", sport: "Basketball", status: "live", viewers: 12453, highlights: 23, model: "Basketball Model V3" },
  { id: 2, name: "Premier League - Arsenal vs Chelsea", sport: "Football", status: "live", viewers: 8921, highlights: 18, model: "Football Model V2" },
  { id: 3, name: "IPL 2024 - Mumbai vs Delhi", sport: "Cricket", status: "live", viewers: 15782, highlights: 31, model: "Cricket Model V1" },
  { id: 4, name: "La Liga - Real Madrid vs Barcelona", sport: "Football", status: "processing", viewers: 0, highlights: 45, model: "Football Model V2" },
  { id: 5, name: "NBA - Lakers vs Warriors", sport: "Basketball", status: "scheduled", viewers: 0, highlights: 0, model: "Basketball Model V3" },
];

const LiveFeedMonitor = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Live Feed Monitor</h2>
          <p className="text-muted-foreground">Real-time monitoring of active video streams</p>
        </div>
        <Button>
          <Play className="h-4 w-4 mr-2" />
          Add New Feed
        </Button>
      </div>

      <div className="grid gap-4">
        {mockFeeds.map((feed) => (
          <Card key={feed.id} className="p-6 bg-gradient-to-r from-card to-card/50 border-border/50 hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 flex-1">
                <div className="relative">
                  <div className="h-20 w-32 rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden">
                    <Eye className="h-8 w-8 text-muted-foreground" />
                    {feed.status === "live" && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="destructive" className="bg-accent text-accent-foreground animate-pulse">
                          LIVE
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{feed.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Badge variant="outline">{feed.sport}</Badge>
                    <span>Model: {feed.model}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{feed.viewers.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Viewers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">{feed.highlights}</p>
                    <p className="text-xs text-muted-foreground">Highlights</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {feed.status === "live" ? "5.2s" : "--"}
                    </p>
                    <p className="text-xs text-muted-foreground">Latency</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-6">
                {feed.status === "live" ? (
                  <Button variant="outline" size="sm">
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveFeedMonitor;
