import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon, X, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface UserFilterSidebarProps {
  roleFilter: 'all' | 'admin' | 'client';
  onRoleFilterChange: (value: 'all' | 'admin' | 'client') => void;
  createdFrom: Date | undefined;
  createdTo: Date | undefined;
  onCreatedFromChange: (date: Date | undefined) => void;
  onCreatedToChange: (date: Date | undefined) => void;
  loginFrom: Date | undefined;
  loginTo: Date | undefined;
  onLoginFromChange: (date: Date | undefined) => void;
  onLoginToChange: (date: Date | undefined) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const UserFilterSidebar = ({
  roleFilter,
  onRoleFilterChange,
  createdFrom,
  createdTo,
  onCreatedFromChange,
  onCreatedToChange,
  loginFrom,
  loginTo,
  onLoginFromChange,
  onLoginToChange,
  onClearFilters,
  hasActiveFilters
}: UserFilterSidebarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Users</SheetTitle>
          <SheetDescription>
            Apply advanced filters to narrow down your user list
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Role Filter */}
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={roleFilter} onValueChange={onRoleFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Created Date Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Account Creation Date</Label>
            
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !createdFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {createdFrom ? format(createdFrom, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={createdFrom}
                    onSelect={onCreatedFromChange}
                    initialFocus
                    disabled={(date) => date > new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {createdFrom && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCreatedFromChange(undefined)}
                  className="w-full"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !createdTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {createdTo ? format(createdTo, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={createdTo}
                    onSelect={onCreatedToChange}
                    initialFocus
                    disabled={(date) => date > new Date() || (createdFrom && date < createdFrom)}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {createdTo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCreatedToChange(undefined)}
                  className="w-full"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Last Login Date Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Last Login Date</Label>
            
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !loginFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {loginFrom ? format(loginFrom, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={loginFrom}
                    onSelect={onLoginFromChange}
                    initialFocus
                    disabled={(date) => date > new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {loginFrom && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLoginFromChange(undefined)}
                  className="w-full"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !loginTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {loginTo ? format(loginTo, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={loginTo}
                    onSelect={onLoginToChange}
                    initialFocus
                    disabled={(date) => date > new Date() || (loginFrom && date < loginFrom)}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {loginTo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLoginToChange(undefined)}
                  className="w-full"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onClearFilters();
                setOpen(false);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
