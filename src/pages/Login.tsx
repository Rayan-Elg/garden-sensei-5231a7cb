
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { Droplet, Leaf, Loader2, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
      } catch (error: any) {
        setIsLoggingIn(false);
        if (error.message?.includes('Invalid login credentials')) {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
            variant: "destructive"
          });
        }
        return null;
      }
    }
  });

  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      switch (event) {
        case 'SIGNED_IN':
          setIsLoggingIn(true);
          toast({
            title: "Logging in...",
            description: "Please wait while we set up your session.",
          });
          break;
        case 'SIGNED_OUT':
          setIsLoggingIn(false);
          break;
        case 'USER_UPDATED':
          setIsLoggingIn(false);
          break;
        case 'PASSWORD_RECOVERY':
          toast({
            title: "Password reset email sent",
            description: "Check your email for the password reset link.",
          });
          break;
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm">Checking authentication status...</span>
        </div>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="bg-primary-50 p-3 rounded-full">
            <Leaf className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-2xl font-semibold text-center">SmartGarden Manager</h1>
          <p className="text-center text-gray-600 max-w-xs">
            Sustainable gardening for a greener future. 
            <span className="block text-sm text-primary-600 mt-1">PolyHacks 2025 Edition</span>
          </p>
        </div>

        {supabase ? (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: { width: '100%' },
                container: { width: '100%' },
                anchor: { color: 'rgb(59 130 246)' },
                input: { background: 'white' }
              }
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/auth/callback`}
          />
        ) : (
          <div className="text-center text-red-500">
            Error: Supabase client not initialized. Please check your environment variables.
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
