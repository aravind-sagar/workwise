
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { UpsertLogDialog } from "@/components/dashboard/add-log-dialog";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentLogs } from "@/components/dashboard/recent-logs";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { type WorkLog } from "@/lib/types";
import { useWorkLogs } from "@/app/dashboard/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { logs, isLoading, addLog, updateLog } = useWorkLogs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [logToEdit, setLogToEdit] = useState<WorkLog | undefined>(undefined);

  const handleSaveLog = async (logData: Omit<WorkLog, 'id'> & { id?: string }) => {
    if (logData.id) {
      // Editing existing log
      await updateLog({ ...logData, id: logData.id } as WorkLog);
    } else {
      // Adding new log
      await addLog(logData);
    }
    setIsDialogOpen(false);
  };

  const handleAddNewClick = () => {
    setLogToEdit(undefined);
    setIsDialogOpen(true);
  };

  const handleEditClick = (log: WorkLog) => {
    setLogToEdit(log);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-9 w-48 rounded-md" />
                <Skeleton className="h-10 w-36 rounded-md" />
            </div>
            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-28 rounded-lg" />
                    <Skeleton className="h-28 rounded-lg" />
                    <Skeleton className="h-28 rounded-lg" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Skeleton className="col-span-4 h-[320px] rounded-lg" />
                    <Skeleton className="col-span-4 lg:col-span-3 h-[320px] rounded-lg" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
            <div className="flex items-center space-x-2">
               <Button onClick={handleAddNewClick}>
                 <PlusCircle className="mr-2 h-4 w-4" />
                 Add New Log
               </Button>
            </div>
        </div>
        <div className="space-y-4">
            <StatsCards logs={logs} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <OverviewChart logs={logs} />
                </div>
                <div className="col-span-4 lg:col-span-3">
                    <RecentLogs logs={logs} onEdit={handleEditClick} />
                </div>
            </div>
        </div>
        <UpsertLogDialog 
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSave={handleSaveLog}
            logToEdit={logToEdit}
        />
    </div>
  );
}
