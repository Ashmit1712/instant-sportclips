import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Brain, CheckCircle, AlertCircle } from "lucide-react";

const models = [
  {
    id: 1,
    name: "Basketball Model V3",
    sport: "Basketball",
    status: "active",
    accuracy: 98.2,
    events: ["Dunk", "Three-pointer", "Block", "Alley-oop", "Buzzer beater"],
    feeds: 4,
  },
  {
    id: 2,
    name: "Football Model V2",
    sport: "Football/Soccer",
    status: "active",
    accuracy: 96.8,
    events: ["Goal", "Assist", "Penalty", "Red card", "Celebration"],
    feeds: 6,
  },
  {
    id: 3,
    name: "Cricket Model V1",
    sport: "Cricket",
    status: "active",
    accuracy: 94.5,
    events: ["Wicket", "Six", "Four", "Catch", "Run out"],
    feeds: 2,
  },
  {
    id: 4,
    name: "Tennis Model V1",
    sport: "Tennis",
    status: "training",
    accuracy: 89.2,
    events: ["Ace", "Winner", "Break point", "Match point"],
    feeds: 0,
  },
];

const AIModelConfig = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">AI Model Configuration</h2>
          <p className="text-muted-foreground">Manage sport-specific detection models</p>
        </div>
        <Button>
          <Brain className="h-4 w-4 mr-2" />
          Train New Model
        </Button>
      </div>

      <div className="grid gap-6">
        {models.map((model) => (
          <Card key={model.id} className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{model.name}</h3>
                  {model.status === "active" ? (
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Training
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Sport: {model.sport}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{model.accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Detection Threshold</label>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Slider defaultValue={[85]} max={100} step={1} className="w-full" />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Detected Events</p>
                <div className="flex flex-wrap gap-2">
                  {model.events.map((event) => (
                    <Badge key={event} variant="secondary">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Active Feeds: <span className="text-foreground font-semibold">{model.feeds}</span></span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Configure</Button>
                  <Button variant="outline" size="sm">Test Model</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIModelConfig;
