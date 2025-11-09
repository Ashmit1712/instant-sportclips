import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Copy, Check, ChevronLeft, ChevronRight, Search, X, Download, FileSpreadsheet, ArrowUpDown, ArrowUp, ArrowDown, Trash2, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import * as XLSX from 'xlsx';
import { UserProfileModal } from "./UserProfileModal";
import { UserFilterSidebar } from "./UserFilterSidebar";

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
  const [sortBy, setSortBy] = useState<'email' | 'full_name' | 'role' | 'created_at' | 'last_sign_in_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [bulkRole, setBulkRole] = useState<'admin' | 'client'>('client');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [createdFrom, setCreatedFrom] = useState<Date | undefined>();
  const [createdTo, setCreatedTo] = useState<Date | undefined>();
  const [loginFrom, setLoginFrom] = useState<Date | undefined>();
  const [loginTo, setLoginTo] = useState<Date | undefined>();
  const { toast } = useToast();

  const totalPages = Math.ceil(totalUsers / pageSize);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const rpcParams = {
        page_limit: pageSize,
        page_offset: (currentPage - 1) * pageSize,
        search_term: searchTerm,
        role_filter: roleFilter === "all" ? null : roleFilter,
        sort_by: sortBy,
        sort_direction: sortDirection,
        created_from: createdFrom?.toISOString() || null,
        created_to: createdTo ? new Date(createdTo.setHours(23, 59, 59, 999)).toISOString() : null,
        login_from: loginFrom?.toISOString() || null,
        login_to: loginTo ? new Date(loginTo.setHours(23, 59, 59, 999)).toISOString() : null
      };
      
      // Fetch users with pagination, search, filter, and sorting
      const { data, error } = await supabase.rpc('get_user_list', rpcParams);
      
      if (error) throw error;
      
      setUsers(data || []);
      
      // Fetch total count with same filters
      const { data: countData, error: countError } = await supabase.rpc('get_user_count', {
        search_term: searchTerm,
        role_filter: roleFilter === "all" ? null : roleFilter,
        created_from: createdFrom?.toISOString() || null,
        created_to: createdTo ? new Date(createdTo.setHours(23, 59, 59, 999)).toISOString() : null,
        login_from: loginFrom?.toISOString() || null,
        login_to: loginTo ? new Date(loginTo.setHours(23, 59, 59, 999)).toISOString() : null
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
  }, [currentPage, pageSize, searchTerm, roleFilter, sortBy, sortDirection, createdFrom, createdTo, loginFrom, loginTo]);

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
    setCreatedFrom(undefined);
    setCreatedTo(undefined);
    setLoginFrom(undefined);
    setLoginTo(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters = roleFilter !== "all" || !!createdFrom || !!createdTo || !!loginFrom || !!loginTo;

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortBy(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ column }: { column: typeof sortBy }) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  const handleBulkRoleAssignment = async () => {
    if (selectedUsers.size === 0) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('bulk-assign-role', {
        body: { 
          userIds: Array.from(selectedUsers),
          role: bulkRole
        }
      });

      if (error) throw error;

      toast({
        title: "Role assignment complete",
        description: `Successfully assigned ${bulkRole} role to ${data.successCount} user(s)`,
      });

      setSelectedUsers(new Set());
      setShowRoleDialog(false);
      await fetchUsers();
    } catch (error: any) {
      console.error('Bulk role assignment error:', error);
      toast({
        title: "Error assigning roles",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('bulk-delete-users', {
        body: { userIds: Array.from(selectedUsers) }
      });

      if (error) throw error;

      toast({
        title: "Delete complete",
        description: `Successfully deleted ${data.successCount} user(s)`,
      });

      setSelectedUsers(new Set());
      setShowDeleteDialog(false);
      await fetchUsers();
    } catch (error: any) {
      console.error('Bulk delete error:', error);
      toast({
        title: "Error deleting users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchAllUsersForExport = async () => {
    try {
      const rpcParams = {
        page_limit: 10000, // Large limit to get all users
        page_offset: 0,
        search_term: searchTerm,
        role_filter: roleFilter === "all" ? null : roleFilter,
        sort_by: sortBy,
        sort_direction: sortDirection,
        created_from: createdFrom?.toISOString() || null,
        created_to: createdTo ? new Date(createdTo.setHours(23, 59, 59, 999)).toISOString() : null,
        login_from: loginFrom?.toISOString() || null,
        login_to: loginTo ? new Date(loginTo.setHours(23, 59, 59, 999)).toISOString() : null
      };
      
      const { data, error } = await supabase.rpc('get_user_list', rpcParams);
      
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching users for export:', error);
      toast({
        title: "Error exporting users",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  const exportToCSV = async () => {
    const users = await fetchAllUsersForExport();
    if (users.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no users matching your filters.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['User ID', 'Email', 'Full Name', 'Role', 'Created At', 'Last Sign In'];
    const csvRows = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        user.email,
        user.full_name || '',
        user.role,
        format(new Date(user.created_at), 'yyyy-MM-dd HH:mm:ss'),
        user.last_sign_in_at ? format(new Date(user.last_sign_in_at), 'yyyy-MM-dd HH:mm:ss') : 'Never'
      ].map(field => `"${field}"`).join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: `Exported ${users.length} users to CSV`,
    });
  };

  const exportToExcel = async () => {
    const users = await fetchAllUsersForExport();
    if (users.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no users matching your filters.",
        variant: "destructive",
      });
      return;
    }

    const exportData = users.map(user => ({
      'User ID': user.id,
      'Email': user.email,
      'Full Name': user.full_name || '',
      'Role': user.role,
      'Created At': format(new Date(user.created_at), 'yyyy-MM-dd HH:mm:ss'),
      'Last Sign In': user.last_sign_in_at ? format(new Date(user.last_sign_in_at), 'yyyy-MM-dd HH:mm:ss') : 'Never'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Auto-size columns
    const maxWidth = 50;
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.min(
        Math.max(
          key.length,
          ...exportData.map(row => String(row[key as keyof typeof row]).length)
        ),
        maxWidth
      )
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `users_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`);

    toast({
      title: "Export successful",
      description: `Exported ${users.length} users to Excel`,
    });
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
              {selectedUsers.size > 0 && ` • ${selectedUsers.size} selected`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {selectedUsers.size > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowRoleDialog(true)}
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Assign Role
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
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
          <UserFilterSidebar
            roleFilter={roleFilter}
            onRoleFilterChange={handleRoleFilterChange}
            createdFrom={createdFrom}
            createdTo={createdTo}
            onCreatedFromChange={setCreatedFrom}
            onCreatedToChange={setCreatedTo}
            loginFrom={loginFrom}
            loginTo={loginTo}
            onLoginFromChange={setLoginFrom}
            onLoginToChange={setLoginTo}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
          {(searchTerm || hasActiveFilters) && (
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
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={users.length > 0 && selectedUsers.size === users.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all users"
                    />
                  </TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      <SortIcon column="email" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('full_name')}
                  >
                    <div className="flex items-center">
                      Full Name
                      <SortIcon column="full_name" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center">
                      Role
                      <SortIcon column="role" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      Created
                      <SortIcon column="created_at" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('last_sign_in_at')}
                  >
                    <div className="flex items-center">
                      Last Login
                      <SortIcon column="last_sign_in_at" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow 
                    key={user.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={(e) => {
                      // Don't open modal if clicking on checkbox or copy button
                      if (!(e.target as HTMLElement).closest('button, [role="checkbox"]')) {
                        setSelectedUserId(user.id);
                        setIsProfileModalOpen(true);
                      }
                    }}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedUsers.has(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                        aria-label={`Select ${user.email}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {truncateId(user.id)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(user.id);
                          }}
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

      {/* Bulk Role Assignment Dialog */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign Role to Selected Users</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to assign a new role to {selectedUsers.size} user(s). This action will update their permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Select Role:</label>
            <Select value={bulkRole} onValueChange={(value) => setBulkRole(value as 'admin' | 'client')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkRoleAssignment} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Assign Role'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Users</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUsers.size} user(s)? This action cannot be undone and will permanently remove all user data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete} 
              disabled={isProcessing}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isProcessing ? 'Deleting...' : 'Delete Users'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Profile Modal */}
      <UserProfileModal
        userId={selectedUserId}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedUserId(null);
        }}
        onUpdate={fetchUsers}
      />
    </Card>
  );
};

export default UserListView;