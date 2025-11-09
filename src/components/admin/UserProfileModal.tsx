import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from "date-fns";
import { Save, User, History, Activity } from "lucide-react";

interface UserProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'client';
  created_at: string;
  last_sign_in_at: string | null;
}

interface RoleAuditLog {
  id: string;
  action: string;
  role: 'admin' | 'client';
  created_at: string;
  changed_by: string;
  changer_email?: string;
}

export const UserProfileModal = ({ userId, isOpen, onClose, onUpdate }: UserProfileModalProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roleHistory, setRoleHistory] = useState<RoleAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedName, setEditedName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (userId && isOpen) {
      fetchUserDetails();
    }
  }, [userId, isOpen]);

  const fetchUserDetails = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);

      // Fetch user profile with role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          created_at
        `)
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) throw roleError;

      // Fetch last sign in from auth.users via RPC or direct query
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_list', {
          page_limit: 1,
          page_offset: 0,
          search_term: profileData.email
        });

      if (userError) throw userError;

      const userProfile: UserProfile = {
        ...profileData,
        role: roleData.role,
        last_sign_in_at: userData[0]?.last_sign_in_at || null
      };

      setProfile(userProfile);
      setEditedName(userProfile.full_name || "");

      // Fetch role audit logs
      const { data: auditData, error: auditError } = await supabase
        .from('role_audit_logs')
        .select(`
          id,
          action,
          role,
          created_at,
          changed_by
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (auditError) throw auditError;

      // Fetch changer emails
      const changerIds = [...new Set(auditData.map(log => log.changed_by))];
      const { data: changersData } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', changerIds);

      const changersMap = new Map(changersData?.map(c => [c.id, c.email]) || []);

      const enrichedAuditData = auditData.map(log => ({
        ...log,
        changer_email: changersMap.get(log.changed_by) || 'Unknown'
      }));

      setRoleHistory(enrichedAuditData);
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error loading user details",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: editedName })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "User profile has been updated successfully",
      });

      setProfile(prev => prev ? { ...prev, full_name: editedName } : null);
      onUpdate?.();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setProfile(null);
    setRoleHistory([]);
    setEditedName("");
    onClose();
  };

  if (!userId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            View and edit user details, activity history, and role changes
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : profile ? (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="roles">
                <History className="h-4 w-4 mr-2" />
                Role History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Edit user profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>User ID</Label>
                    <Input value={profile.id} disabled className="font-mono text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Role</Label>
                    <div>
                      <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                        {profile.role}
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={handleSave} disabled={saving || editedName === (profile.full_name || "")}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>User activity and account milestones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Account Created</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(profile.created_at), 'PPpp')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {profile.last_sign_in_at ? (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                        <div className="flex-1">
                          <p className="font-medium">Last Sign In</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(profile.last_sign_in_at), 'PPpp')}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(profile.last_sign_in_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 mt-2 rounded-full bg-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">Last Sign In</p>
                          <p className="text-sm text-muted-foreground">Never signed in</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles">
              <Card>
                <CardHeader>
                  <CardTitle>Role Change History</CardTitle>
                  <CardDescription>
                    {roleHistory.length > 0
                      ? `${roleHistory.length} role ${roleHistory.length === 1 ? 'change' : 'changes'} recorded`
                      : 'No role changes recorded'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {roleHistory.length > 0 ? (
                    <div className="space-y-3">
                      {roleHistory.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium capitalize">{log.action}</p>
                              <Badge variant={log.role === 'admin' ? 'default' : 'secondary'}>
                                {log.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              By {log.changer_email}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(log.created_at), 'PPpp')} • {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No role changes have been recorded for this user
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <p className="text-center text-muted-foreground py-8">User not found</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
