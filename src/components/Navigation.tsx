
import { Bell, Settings, Leaf, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get current session
  const { data: session, refetch } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const handleLogout = async () => {
    try {
      if (!session) {
        toast({
          title: "No active session",
          description: "You are already logged out.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout Error",
          description: error.message,
          variant: "destructive",
        });
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
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred during logout.",
        variant: "destructive",
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
