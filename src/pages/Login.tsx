
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  // Ensure we're using the correct port for local development
  const redirectTo = `${window.location.origin}/auth/callback`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">Welcome to SmartGarden Manager</h1>
        {supabase && (
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: { width: '100%' },
                container: { width: '100%' },
                message: { color: 'rgb(59 130 246)' },
              }
            }}
            providers={['google', 'github']}
            redirectTo={redirectTo}
            showLinks={false}
          />
        )}
      </Card>
    </div>
  );
};

export default Login;
