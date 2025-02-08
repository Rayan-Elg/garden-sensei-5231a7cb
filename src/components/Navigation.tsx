
import { Bell, Settings, Leaf, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

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
      // Try to sign out locally first
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'local'
      });
      
      if (signOutError) {
        console.error('Logout error:', signOutError);
        // Even if there's an error, we'll clear the session locally
        await refetch();
        toast({
          title: "Session cleared",
          description: "Your local session has been cleared.",
        });
        navigate('/login');
        return;
      }

      // Force session refetch
      await refetch();
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate('/login');
    } catch (err) {
      console.error('Unexpected error during logout:', err);
      // If anything goes wrong, force a local logout
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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
