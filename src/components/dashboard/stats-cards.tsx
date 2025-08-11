
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { WorkLog } from "@/lib/types"
import { BookCopy, CalendarClock, Tags } from "lucide-react"
import { startOfDay, differenceInCalendarDays, subDays } from "date-fns"


const calculateStreak = (logs: WorkLog[]): number => {
    if (!logs || logs.length === 0) return 0;

    const uniqueLogDays = [
      ...new Set(logs.map((log) => startOfDay(new Date(log.date)).getTime())),
    ].sort((a, b) => b - a);

    const today = startOfDay(new Date());
    const latestLogTime = uniqueLogDays[0];

    // If the last log wasn't today or yesterday, streak is 0
    if (differenceInCalendarDays(today, new Date(latestLogTime)) > 1) {
      return 0;
    }
    
    let streak = 0;
    let expectedDate = startOfDay(new Date());
    
    // If last log was yesterday, start checking from yesterday.
    if(differenceInCalendarDays(today, new Date(latestLogTime)) === 1) {
      expectedDate = startOfDay(new Date(latestLogTime));
    }

    for (const logTime of uniqueLogDays) {
      if (logTime === expectedDate.getTime()) {
        streak++;
        expectedDate = subDays(expectedDate, 1);
      } else {
        break; // Streak is broken
      }
    }

    return streak;
}


interface StatsCardsProps {
    logs: WorkLog[];
}

export function StatsCards({ logs }: StatsCardsProps) {
  const totalLogs = logs.length;
  const uniqueTags = new Set(logs.flatMap(log => log.tags)).size;
  const currentStreak = calculateStreak(logs); 

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
          <BookCopy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLogs}</div>
          <p className="text-xs text-muted-foreground">
            Total entries recorded
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Tags</CardTitle>
          <Tags className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueTags}</div>
          <p className="text-xs text-muted-foreground">
            Across all entries
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</div>
          <p className="text-xs text-muted-foreground">
            Keep it going!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
