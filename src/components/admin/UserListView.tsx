import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Copy, Check, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface UserListItem {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'client';
  created_at: string;
  last_sign_in_at: string | null;
}

const UserListView = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'client'>("all");
  const { toast } = useToast();

  const totalPages = Math.ceil(totalUsers / pageSize);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const rpcParams = {
        page_limit: pageSize,
        page_offset: (currentPage - 1) * pageSize,
        search_term: searchTerm,
        role_filter: roleFilter === "all" ? null : roleFilter
      };
      
      // Fetch users with pagination, search, and filter
      const { data, error } = await supabase.rpc('get_user_list', rpcParams);
      
      if (error) throw error;
      
      setUsers(data || []);
      
      // Fetch total count with same filters
      const { data: countData, error: countError } = await supabase.rpc('get_user_count', {
        search_term: searchTerm,
        role_filter: roleFilter === "all" ? null : roleFilter
      });
      if (countError) throw countError;
      setTotalUsers(Number(countData) || 0);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error loading users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchTerm, roleFilter]);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value as 'all' | 'admin' | 'client');
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Copied!",
      description: "User ID copied to clipboard",
    });
  };

  const truncateId = (id: string) => {
    return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User List</CardTitle>
            <CardDescription>
              {totalUsers} total {totalUsers === 1 ? 'user' : 'users'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
          {(searchTerm || roleFilter !== "all") && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-2">
                        {truncateId(user.id)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(user.id)}
                        >
                          {copiedId === user.id ? (
                            <Check className="h-3 w-3 text-success" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.full_name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      {user.last_sign_in_at 
                        ? formatDistanceToNow(new Date(user.last_sign_in_at), { addSuffix: true })
                        : <span className="text-muted-foreground">Never</span>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {users.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserListView;