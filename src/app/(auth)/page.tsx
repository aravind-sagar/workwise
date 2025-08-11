"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/providers/auth-provider';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // This logic is now primarily handled in AuthProvider,
    // but this serves as a fallback during initial load.
    if (!loading && user) {
        router.push('/dashboard');
    }
  }, [user, loading, router]);


  // If auth is disabled, this page will redirect.
  // This UI is for when auth is enabled.
  // To re-enable auth, see README.md
  
  // NOTE: This component is currently configured to redirect for a demo with auth disabled.
  // To re-enable the actual login form:
  // 1. Follow the instructions in README.md to enable authentication.
  // 2. Replace this component's return statement with the commented-out JSX below.
  
  useEffect(() => {
    // Redirect to dashboard since auth is temporarily disabled
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    </div>
  );

  /*
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    const result = await signInWithEmail(values.email, values.password);
    if (!result.success) {
      setError(result.error || 'An unknown error occurred.');
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.error,
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Welcome Back!</CardTitle>
            <CardDescription>Sign in to continue to WorkWise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 102.3 279.1 96 248 96c-88.3 0-160 71.7-160 160s71.7 160 160 160c92.6 0 145-67.2 149.1-101.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
                Continue with Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
          <CardFooter className="justify-center text-sm">
            <p>Don't have an account? <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">Sign up</Link></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
  */
}
