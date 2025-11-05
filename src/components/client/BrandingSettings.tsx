import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Image as ImageIcon } from "lucide-react";

const BrandingSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Branding Settings</h2>
        <p className="text-muted-foreground">Customize your highlight clips with your brand identity</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Watermark Upload */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Watermark Logo</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG or SVG (max. 2MB)</p>
            </div>
            <Button className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Logo
            </Button>
          </div>
        </Card>

        {/* Position Settings */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Watermark Position</h3>
          <div className="space-y-4">
            <div>
              <Label>Position</Label>
              <Select defaultValue="bottom-right">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-left">Top Left</SelectItem>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Opacity</Label>
                <span className="text-sm text-muted-foreground">80%</span>
              </div>
              <Slider defaultValue={[80]} max={100} step={5} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Size</Label>
                <span className="text-sm text-muted-foreground">Medium</span>
              </div>
              <Slider defaultValue={[50]} max={100} step={10} />
            </div>
          </div>
        </Card>
      </div>

      {/* Clip Settings */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
        <h3 className="text-lg font-semibold mb-4">Clip Generation Settings</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Default Clip Length</Label>
            <div className="flex gap-2 mt-2">
              <Input type="number" defaultValue="12" className="flex-1" />
              <span className="flex items-center text-sm text-muted-foreground">seconds</span>
            </div>
          </div>

          <div>
            <Label>Pre-Roll Duration</Label>
            <div className="flex gap-2 mt-2">
              <Input type="number" defaultValue="3" className="flex-1" />
              <span className="flex items-center text-sm text-muted-foreground">seconds</span>
            </div>
          </div>

          <div>
            <Label>Post-Roll Duration</Label>
            <div className="flex gap-2 mt-2">
              <Input type="number" defaultValue="2" className="flex-1" />
              <span className="flex items-center text-sm text-muted-foreground">seconds</span>
            </div>
          </div>

          <div>
            <Label>Event Threshold</Label>
            <Select defaultValue="high">
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (More clips)</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High (Best only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Output Formats */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
        <h3 className="text-lg font-semibold mb-4">Output Formats</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border border-border bg-secondary/30">
            <div className="flex items-center justify-between mb-2">
              <Label>16:9 (Landscape)</Label>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <p className="text-xs text-muted-foreground">YouTube, Broadcast</p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-secondary/30">
            <div className="flex items-center justify-between mb-2">
              <Label>9:16 (Portrait)</Label>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <p className="text-xs text-muted-foreground">TikTok, Reels, Shorts</p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-secondary/30">
            <div className="flex items-center justify-between mb-2">
              <Label>1:1 (Square)</Label>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <p className="text-xs text-muted-foreground">Instagram Feed</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default BrandingSettings;
