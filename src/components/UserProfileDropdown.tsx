import React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User as UserIcon, Settings, LogOut, UserCircle } from 'lucide-react';

interface UserProfileDropdownProps {
  user: User;
  onSignOut: () => void;
  onSettings?: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  onSignOut,
  onSettings,
}) => {
  const userInitials = user.email
    ?.split('@')[0]
    .split('.')
    .map(part => part.charAt(0).toUpperCase())
    .join('') || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 hover:bg-accent/20 transition-all duration-300 shadow-soft"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white text-sm font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-card/95 backdrop-blur-md border border-border/50 shadow-xl" 
        align="end" 
        forceMount
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm text-foreground">
              {user.email?.split('@')[0]}
            </p>
            <p className="text-xs text-muted-foreground truncate w-40">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-accent/20 transition-colors"
          onClick={() => onSettings?.()}
        >
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-accent/20 transition-colors"
          onClick={() => onSettings?.()}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};