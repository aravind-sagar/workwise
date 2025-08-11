"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Tag, Ticket } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import type { WorkLog } from "@/lib/types";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  description: z.string().min(1, "Description cannot be empty."),
  ticket: z.string().optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required."),
  tagInput: z.string().optional(),
});

type UpsertLogFormValues = z.infer<typeof formSchema>;

interface UpsertLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (log: Omit<WorkLog, "id"> & { id?: string }) => Promise<void>;
  logToEdit?: WorkLog;
}

export function UpsertLogDialog({
  open,
  onOpenChange,
  onSave,
  logToEdit,
}: UpsertLogDialogProps) {
  const form = useForm<UpsertLogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      description: "",
      ticket: "",
      tags: [],
      tagInput: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (open) {
      if (logToEdit) {
        form.reset({
          date: new Date(logToEdit.date),
          description: logToEdit.description,
          ticket: logToEdit.ticket || "",
          tags: logToEdit.tags,
          tagInput: "",
        });
      } else {
        form.reset({
          date: new Date(),
          description: "",
          ticket: "",
          tags: [],
          tagInput: "",
        });
      }
    }
  }, [logToEdit, form, open]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tagInput = form.getValues("tagInput");
      if (tagInput) {
        const newTag = tagInput.trim();
        const currentTags = form.getValues("tags");
        if (newTag && !currentTags.includes(newTag)) {
          form.setValue("tags", [...currentTags, newTag], {
            shouldValidate: true,
          });
        }
        form.setValue("tagInput", "");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: UpsertLogFormValues) => {
    const logData = {
      date: data.date.toISOString(),
      description: data.description,
      tags: data.tags,
      ticket: data.ticket,
    };
    await onSave({ id: logToEdit?.id, ...logData });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {logToEdit ? "Edit Work Log" : "Add New Work Log"}
          </DialogTitle>
          <DialogDescription>
            {logToEdit
              ? "Update the details of your work log."
              : "Record your accomplishments and tasks. Be detailed for better review insights."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-start gap-4">
                  <FormLabel className="text-right pt-3">Date</FormLabel>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="mt-2" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-start gap-4">
                  <FormLabel className="text-right pt-3">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="col-span-3"
                      placeholder="e.g., Deployed the new authentication service..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ticket"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-start gap-4">
                  <FormLabel className="text-right pt-3">Ticket/Task</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <div className="relative">
                        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="e.g. CORE-16677"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="mt-2" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-start gap-4">
                  <FormLabel className="text-right pt-3">Tags</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <div>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...form.register("tagInput")}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Type and press Enter to add"
                            className="pl-10"
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {field.value.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 rounded-full p-0.5 text-xs hover:bg-destructive/20"
                              >
                                <span className="sr-only">Remove {tag}</span>
                                &#x2715;
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="mt-2" />
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Log
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
