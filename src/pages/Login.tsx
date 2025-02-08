
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { data: session, isLoading, error } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        // First, try to clear any existing invalid session
        await supabase.auth.signOut({ scope: 'local' });
        
        // Then get fresh session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth error:', error);
          toast({
            title: "Authentication Error",
            description: "There was a problem connecting to the authentication service. Please try again.",
            variant: "destructive"
          });
          return null;
        }
        return data.session;
      } catch (err) {
        console.error('Unexpected auth error:', err);
        return null;
      }
    },
    refetchInterval: 500, // Check session status every 500ms instead of 1000ms
    retry: false,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the results
    // Add a timeout of 10 seconds
    queryFn: async (context) => {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout')), 10000)
      );
      const sessionPromise = supabase.auth.getSession();
      
      try {
        const result = await Promise.race([sessionPromise, timeoutPromise]);
        return result.data.session;
      } catch (error) {
        if (error.message === 'Login timeout') {
          toast({
            title: "Login Timeout",
            description: "The login process took too long. Please try again.",
            variant: "destructive"
          });
          setIsLoggingIn(false);
        }
        throw error;
      }
    }
  });

  useEffect(() => {
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') {
          setIsLoggingIn(true);
          toast({
            title: "Logging in...",
            description: "Please wait while we set up your session.",
          });
        }
      });

      // Cleanup subscription
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500 animate-fade-in">
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
      <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur-sm relative animate-fade-in-up">
        {isLoggingIn && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="text-sm font-medium text-gray-700 animate-pulse">Setting up your session...</span>
              <span className="text-xs text-gray-500">This might take a moment</span>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-semibold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-6">Sign in to your account to continue</p>
        {supabase && (
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
                divider: { margin: '20px 0' },
                input: {
                  padding: '8px 12px',
                  marginBottom: '12px'
                },
                label: {
                  marginBottom: '4px',
                  color: 'rgb(75 85 99)'
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
            providers={['google', 'github']}
            redirectTo={redirectTo}
            magicLink={true}
            showLinks={true}
            onlyThirdPartyProviders={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in...',
                  social_provider_text: 'Continue with {{provider}}',
                  link_text: "Don't have an account? Sign up",
                  email_input_placeholder: 'Enter your email',
                  password_input_placeholder: 'Enter your password'
                }
              }
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default Login;
