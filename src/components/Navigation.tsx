
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Award, Leaf, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { NotificationPanel } from "./NotificationPanel";

const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    refetchInterval: 5000,
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
      
      if (session) {
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.error('Global signout failed:', err);
        }
      }

      await refetch();
      
      toast({
        title: "Logged out successfully",
        description: "Your session has been cleared.",
        duration: 2000, // Reduced from default 5000ms to 2000ms
      });
      
      navigate('/login');
    } catch (err) {
      console.error('Unexpected error during logout:', err);
      await refetch();
      navigate('/login');
      toast({
        title: "Session cleared",
        description: "Your local session has been cleared.",
        duration: 2000, // Reduced from default 5000ms to 2000ms
      });
    }
  };

  return (
    <nav className="w-full py-4 px-6 border-b bg-white/80 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
            <Leaf className="w-6 h-6" />
            <span className="text-xl font-semibold">SmartGarden Manager</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-green-50 py-1 px-3 rounded-full">
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">PolyHacks 2025</span>
            </div>
            <NotificationPanel />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="md:hidden flex gap-2 mt-2 justify-center text-xs">
          <span className="bg-green-50 py-1 px-2 rounded-full text-green-700 flex items-center gap-1">
            <Award className="w-3 h-3" /> PolyHacks 2025
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
