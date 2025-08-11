"use client"

import * as React from "react"
import { useMemo } from "react"
import { endOfDay, format, startOfDay } from "date-fns"
import { Bot, Calendar as CalendarIcon, Loader2, Sparkles } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "../ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { useWorkLogs } from "@/app/dashboard/layout"
import { generateReviewResponse } from "@/ai/flows/generate-review-response"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"
import { Skeleton } from "../ui/skeleton"

export function ReviewHelperClient() {
  const { logs, isLoading: areLogsLoading } = useWorkLogs();
  const [date, setDate] = React.useState<DateRange | undefined>()
  const [question, setQuestion] = React.useState("")
  const [response, setResponse] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const filteredLogs = useMemo(() => {
    if (!date?.from) {
        return [];
    }
    const start = startOfDay(date.from);
    const end = date.to ? endOfDay(date.to) : endOfDay(date.from);
    
    return logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= start && logDate <= end;
    });
  }, [date, logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");

    const workLogsString = filteredLogs.map(log => 
        `Date: ${format(new Date(log.date), "yyyy-MM-dd")}\nTags: ${log.tags.join(", ")}\nDescription: ${log.description}`
    ).join("\n\n---\n\n");

    try {
        const result = await generateReviewResponse({
            workLogs: workLogsString,
            question: question
        });
        setResponse(result.response);
    } catch (error) {
        console.error("Error generating response:", error);
        setResponse("Sorry, there was an error generating the response. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Generate Review Response</CardTitle>
          <CardDescription>Select a date range and ask a question to generate a summary or response based on your work logs.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={areLogsLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Textarea
                placeholder="e.g., What were my main accomplishments during this period? or Summarize my work on the 'dashboard' project."
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                disabled={areLogsLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || areLogsLoading || !date || !question}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Response
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {(areLogsLoading || filteredLogs.length > 0) && (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Selected Logs ({areLogsLoading ? '...' : filteredLogs.length})</CardTitle>
                <CardDescription>
                    These are the logs from the selected date range that will be used to generate the response.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    {areLogsLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="w-[60%]">Description</TableHead>
                                    <TableHead>Tags</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium whitespace-nowrap">{format(new Date(log.date), "MMM d, yyyy")}</TableCell>
                                        <TableCell>{log.description}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {log.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
      )}

      {(isLoading || response) && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Bot className="h-5 w-5" /> AI Generated Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {response}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
