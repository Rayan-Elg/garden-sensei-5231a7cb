
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Trash2, X } from "lucide-react";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { formatDistanceToNow } from "date-fns";

export const NotificationPanel = () => {
  const { notifications, clearNotification, clearAll } = useNotificationStore();
  const hasNotifications = notifications.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white shadow-lg border z-50" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3 bg-white">
          <h4 className="font-semibold">Notifications</h4>
          {hasNotifications && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-muted-foreground"
              onClick={() => clearAll()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px] bg-white">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No new notifications
            </div>
          ) : (
            <div className="grid gap-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="grid grid-cols-[1fr,16px] gap-2 px-4 py-3 hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4"
                    onClick={() => clearNotification(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

