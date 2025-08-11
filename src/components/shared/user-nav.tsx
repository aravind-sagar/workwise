"use client"

import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTweakTheme } from "@/components/providers/tweak-theme-provider";

export function UserNav() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { theme: tweakTheme, setTheme: setTweakTheme, themes } = useTweakTheme();

  if (!user) {
    return null; // Or a loading skeleton
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || `https://placehold.co/40x40`} alt={user.displayName || 'User'} data-ai-hint="profile picture" />
            <AvatarFallback>{user.displayName ? getInitials(user.displayName) : 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="space-y-4 px-2 py-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="theme-select" className="text-sm font-normal text-muted-foreground">Theme</Label>
                <Select value={tweakTheme} onValueChange={setTweakTheme}>
                    <SelectTrigger className="w-36" id="theme-select">
                        <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                        {themes.map(t => (
                            <SelectItem key={t} value={t}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode-switch" className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                    <Sun className="h-4 w-4" /> Light / Dark <Moon className="h-4 w-4" />
                </Label>
                <Switch
                    id="dark-mode-switch"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
            </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
            Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
