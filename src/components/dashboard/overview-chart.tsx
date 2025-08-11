
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { WorkLog } from "@/lib/types"
import { subDays, format, startOfDay } from "date-fns"

interface OverviewChartProps {
    logs: WorkLog[];
}

export function OverviewChart({ logs }: OverviewChartProps) {
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestLogDate = sortedLogs.length > 0 ? new Date(sortedLogs[0].date) : new Date();

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(latestLogDate, i)
    return { date: format(date, "MMM d"), logs: 0 }
  }).reverse()

  logs.forEach(log => {
    const logDate = startOfDay(new Date(log.date))
    const formattedDate = format(logDate, "MMM d")
    const dataEntry = chartData.find(d => d.date === formattedDate)
    if (dataEntry) {
      dataEntry.logs++
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Activity Overview</CardTitle>
        <CardDescription>A 7-day snapshot of your work log activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[250px] w-full">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={10} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="logs" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
