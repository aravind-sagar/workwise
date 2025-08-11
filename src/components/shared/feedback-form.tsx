
"use client"

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { sendFeedbackEmail } from "@/actions/send-email";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

const feedbackSchema = z.object({
  message: z.string().min(10, "Feedback must be at least 10 characters long."),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function FeedbackForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (data: FeedbackFormValues) => {
    startTransition(async () => {
      const result = await sendFeedbackEmail(data.message);
      if (result.success) {
        toast({
          title: "Feedback Sent!",
          description: "Thank you for your feedback.",
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to send feedback.",
        });
      }
    });
  };

  return (
    <div className="p-2 border rounded-lg bg-card">
      <p className="text-xs font-medium text-muted-foreground px-2 mb-2">Have suggestions?</p>
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Share your feedback..."
                    rows={3}
                    {...field}
                    className="text-xs"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="sm" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin"/> : <Send />}
            Send Feedback
          </Button>
        </form>
      </Form>
    </div>
  );
}
