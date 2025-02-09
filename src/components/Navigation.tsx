
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Leaf, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get current session with more frequent refetching
  const { data: session, refetch } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session fetch error:', error);
        return null;
      }
      return data.session;
    },
    refetchInterval: 5000, // Refetch every 5 seconds to keep session fresh
  });

  const handleLogout = async () => {
    try {
      // First clear any existing session locally
      await supabase.auth.signOut({ scope: 'local' });
      
      // If we had a session, try to clear it globally
      if (session) {
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.error('Global signout failed:', err);
          // Continue with local cleanup even if global fails
        }
      }

      // Force session refetch and cleanup
      await refetch();
      
      toast({
        title: "Logged out successfully",
        description: "Your session has been cleared.",
      });
      
      navigate('/login');
    } catch (err) {
      console.error('Unexpected error during logout:', err);
      // Ensure we always clear local state and redirect
      await refetch();
      navigate('/login');
      toast({
        title: "Session cleared",
        description: "Your local session has been cleared.",
      });
    }
  };

  return (
    <nav className="w-full py-4 px-6 border-b bg-white/80 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
          <Leaf className="w-6 h-6" />
          <span className="text-xl font-semibold">SmartGarden Manager</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
