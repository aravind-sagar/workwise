
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-2xl w-full mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-6 w-48 rounded-md" />
                                <Skeleton className="h-4 w-64 rounded-md" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Skeleton className="h-px w-full" />
                         <Skeleton className="h-20 w-full rounded-md" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }

  return (
    <div className="p-4 md:p-8">
        <div className="max-w-2xl w-full mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">My Profile</h2>
            <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} data-ai-hint="profile picture" />
                    <AvatarFallback>{user.displayName ? getInitials(user.displayName) : 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-2xl font-headline">{user.displayName}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </div>
                <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Profile</span>
                </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Separator />
                <div className="space-y-2">
                    <h3 className="font-semibold">Profile Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Full Name</p>
                            <p>{user.displayName}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Email Address</p>
                            <p>{user.email}</p>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <h3 className="font-semibold">Account Settings</h3>
                    <div className="flex justify-between items-center">
                        <p className="text-sm">Change Password</p>
                        <Button variant="secondary">Change</Button>
                    </div>
                </div>
            </CardContent>
            </Card>
        </div>
    </div>
  )
}
