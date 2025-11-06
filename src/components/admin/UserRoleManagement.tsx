import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const UserRoleManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "client">("admin");

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid user ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to assign roles",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('assign-role', {
        body: {
          userId: userId.trim(),
          role: selectedRole,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `${selectedRole} role assigned successfully to user ${userId}`,
      });

      // Reset form
      setUserId("");
      setSelectedRole("admin");

    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">User Role Management</h3>
          <p className="text-sm text-muted-foreground">Assign admin or client roles to users</p>
        </div>
      </div>

      <form onSubmit={handleAssignRole} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            type="text"
            placeholder="Enter user UUID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            The UUID of the user you want to assign a role to
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={selectedRole} onValueChange={(value: "admin" | "client") => setSelectedRole(value)}>
            <SelectTrigger id="role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          {isLoading ? "Assigning Role..." : "Assign Role"}
        </Button>
      </form>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">How to get User ID:</h4>
        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
          <li>View the backend database</li>
          <li>Navigate to the profiles table</li>
          <li>Copy the UUID from the id column</li>
        </ol>
      </div>
    </Card>
  );
};

export default UserRoleManagement;
