
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { Bot, LayoutDashboard, ListChecks, PanelLeft } from 'lucide-react';

import type { WorkLog } from '@/lib/types';
import { getWorkLogs, addWorkLog as addWorkLogService, updateWorkLog as updateWorkLogService } from '@/services/work-log-service';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/shared/logo';
import { UserNav } from '@/components/shared/user-nav';
import { FeedbackForm } from '@/components/shared/feedback-form';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';


// --- Context for Shared Work Logs ---
interface WorkLogContextType {
  logs: WorkLog[];
  isLoading: boolean;
  addLog: (log: Omit<WorkLog, 'id'>) => Promise<void>;
  updateLog: (log: WorkLog) => Promise<void>;
}

const WorkLogContext = createContext<WorkLogContextType | undefined>(undefined);

export function useWorkLogs() {
  const context = useContext(WorkLogContext);
  if (context === undefined) {
    throw new Error('useWorkLogs must be used within a WorkLogProvider');
  }
  return context;
}

function WorkLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const fetchedLogs = await getWorkLogs();
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast({
            variant: "destructive",
            title: "Error fetching logs",
            description: "Could not load work logs. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [toast]);

  const addLog = async (logData: Omit<WorkLog, 'id'>) => {
    try {
      const newLog = await addWorkLogService(logData);
      setLogs(prevLogs => [newLog, ...prevLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
        console.error("Failed to add log:", error);
        toast({
            variant: "destructive",
            title: "Error saving log",
            description: "Your new work log could not be saved.",
        });
    }
  };

  const updateLog = async (logData: WorkLog) => {
     try {
      await updateWorkLogService(logData);
      setLogs(prevLogs => prevLogs.map(log => log.id === logData.id ? { ...logData } : log).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
        console.error("Failed to update log:", error);
        toast({
            variant: "destructive",
            title: "Error updating log",
            description: "Your changes could not be saved.",
        });
    }
  };

  return (
    <WorkLogContext.Provider value={{ logs, isLoading, addLog, updateLog }}>
      {children}
    </WorkLogContext.Provider>
  );
}
// --- End of Context ---

function NavLink({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) {
    return (
        <Link href={href}>
            <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                {children}
            </Button>
        </Link>
    );
}

function MainNav({ className }: { className?: string }) {
    const pathname = usePathname();
    return (
        <nav className={cn("flex flex-col gap-2", className)}>
            <NavLink href="/dashboard" isActive={pathname === '/dashboard'}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
            </NavLink>
            <NavLink href="/review-helper" isActive={pathname.startsWith('/review-helper')}>
                <Bot className="mr-2 h-4 w-4" />
                Review Helper
            </NavLink>
            <NavLink href="/timesheet" isActive={pathname.startsWith('/timesheet')}>
                <ListChecks className="mr-2 h-4 w-4" />
                Timesheet
            </NavLink>
        </nav>
    );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkLogProvider>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Desktop Sidebar */}
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Logo />
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                       <MainNav />
                    </div>
                    <div className="mt-auto p-4 space-y-4">
                        <FeedbackForm />
                        <UserNav />
                    </div>
                </div>
            </div>

            {/* Mobile Header & Main Content */}
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    {/* Mobile Navigation */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <PanelLeft className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col p-0">
                           <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                             <Logo />
                           </div>
                           <div className="p-4">
                            <MainNav />
                           </div>
                           <div className="mt-auto p-4 space-y-4">
                               <FeedbackForm />
                           </div>
                        </SheetContent>
                    </Sheet>

                    <div className="flex-1" />
                    <UserNav />
                </header>
                <main className="flex-1 overflow-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    </WorkLogProvider>
  );
}
