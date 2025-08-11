
"use client";

import { useState, useMemo } from 'react';
import { useWorkLogs } from '@/app/dashboard/layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ListFilter, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function TimesheetPage() {
  const { logs, isLoading } = useWorkLogs();
  const [ticketSearch, setTicketSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    logs.forEach(log => log.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const ticketMatch = ticketSearch 
        ? log.ticket?.toLowerCase().includes(ticketSearch.toLowerCase()) 
        : true;
      const tagMatch = selectedTags.length > 0 
        ? selectedTags.every(tag => log.tags.includes(tag))
        : true;
      return ticketMatch && tagMatch;
    });
  }, [logs, ticketSearch, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Timesheet</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Work Logs</CardTitle>
          <CardDescription>Browse and filter all your recorded work entries.</CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ticket..."
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filter by Tag ({selectedTags.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by tags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allTags.map(tag => (
                   <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-22rem)]">
            {isLoading ? (
              <div className="space-y-2 p-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[150px]">Ticket</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[200px]">Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(new Date(log.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{log.ticket || 'N/A'}</TableCell>
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
            {!isLoading && filteredLogs.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    No logs found for the selected filters.
                </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
