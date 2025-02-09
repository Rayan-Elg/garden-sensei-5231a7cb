
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { Leaf, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
    refetchInterval: 500,
  });

  useEffect(() => {
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

  const redirectTo = `${window.location.origin}/auth/callback`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur-sm relative">
        {isLoggingIn && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Setting up your session...</span>
              <span className="text-xs text-gray-500">This might take a moment</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-semibold text-center">SmartGarden Manager</h1>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { 
                width: '100%',
                padding: '8px 16px',
                marginBottom: '8px'
              },
              container: { width: '100%' },
              message: { color: 'rgb(59 130 246)' },
              loader: { color: 'rgb(59 130 246)' },
              divider: { display: 'none' },
              input: {
                padding: '8px 12px',
                marginBottom: '12px'
              },
              label: {
                marginBottom: '4px',
                color: 'rgb(75 85 99)'
              },
              anchor: {
                color: 'rgb(59 130 246)',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }
            },
            variables: {
              default: {
                colors: {
                  brand: 'rgb(59 130 246)',
                  brandAccent: 'rgb(37 99 235)',
                }
              }
            }
          }}
          providers={[]}
          magicLink={false}
          showLinks={true}
          redirectTo={redirectTo}
          view={isLoggingIn ? 'sign_in' : undefined}
        />
      </Card>
    </div>
  );
};

export default Login;
