import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Play, Download, Share2, Youtube, Instagram, Facebook } from "lucide-react";

const mockHighlights = [
  {
    id: 1,
    title: "Curry's Game-Winning Three Pointer",
    sport: "Basketball",
    event: "Three-pointer",
    duration: "12s",
    views: 45234,
    platform: ["YouTube", "Instagram"],
    timestamp: "2 hours ago",
    team: "Golden State Warriors",
  },
  {
    id: 2,
    title: "Incredible Goal from Mbappé",
    sport: "Football",
    event: "Goal",
    duration: "15s",
    views: 89123,
    platform: ["YouTube", "TikTok", "X"],
    timestamp: "4 hours ago",
    team: "PSG",
  },
  {
    id: 3,
    title: "Kohli's Century Six",
    sport: "Cricket",
    event: "Six",
    duration: "10s",
    views: 67890,
    platform: ["YouTube"],
    timestamp: "6 hours ago",
    team: "India",
  },
  {
    id: 4,
    title: "LeBron's Monster Dunk",
    sport: "Basketball",
    event: "Dunk",
    duration: "8s",
    views: 102345,
    platform: ["YouTube", "Instagram", "TikTok"],
    timestamp: "8 hours ago",
    team: "LA Lakers",
  },
];

const HighlightLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Highlight Library</h2>
          <p className="text-muted-foreground">Browse and manage your generated clips</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search highlights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedSport} onValueChange={setSelectedSport}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="basketball">Basketball</SelectItem>
            <SelectItem value="football">Football</SelectItem>
            <SelectItem value="cricket">Cricket</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Highlights Grid */}
      <div className="grid gap-6">
        {mockHighlights.map((highlight) => (
          <Card key={highlight.id} className="p-6 bg-gradient-to-r from-card to-card/50 border-border/50 hover:border-primary/30 transition-all group">
            <div className="flex gap-6">
              {/* Thumbnail */}
              <div className="relative h-32 w-48 rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden shrink-0">
                <Play className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {highlight.duration}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline">{highlight.sport}</Badge>
                    <Badge variant="secondary">{highlight.event}</Badge>
                    <span className="text-sm text-muted-foreground">{highlight.team}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{highlight.views.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{highlight.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {highlight.platform.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform === "YouTube" && <Youtube className="h-3 w-3 mr-1" />}
                        {platform === "Instagram" && <Instagram className="h-3 w-3 mr-1" />}
                        {platform === "TikTok" && <Share2 className="h-3 w-3 mr-1" />}
                        {platform === "X" && <Share2 className="h-3 w-3 mr-1" />}
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HighlightLibrary;
