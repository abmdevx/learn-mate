import { Bell, Heart, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/Redux/Hooks";
import authService from "@/appwrite/auth";
import notificationService from "@/appwrite/notifications";
import type { Notification } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Sender = { $id: string; Name?: string };

function NotificationBell() {
  const user = useAppSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [senders, setSenders] = useState<Record<string, Sender>>({});
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.Read).length,
    [notifications],
  );

  useEffect(() => {
    if (!user?.$id) return;
    let active = true;
    const loadNotifications = async () => {
      const current = await notificationService.getUserNotifications(user.$id);
      if (!active) return;
      setNotifications(current.slice(0, 20));
      const senderIds = [...new Set(current.map((notification) => notification.SenderId))];
      if (!senderIds.length) return;
      const profiles = await authService.getUsersByIds(senderIds);
      if (!active) return;
      setSenders(Object.fromEntries(profiles.map((profile) => [profile.$id, profile])));
    };
    loadNotifications();
    const unsubscribe = notificationService.subscribeToUserNotifications(user.$id, (notification) => {
      setNotifications((current) => [notification, ...current.filter((item) => item.$id !== notification.$id)].slice(0, 20));
      authService.getProfile(notification.SenderId).then((profile) => {
        if (active) setSenders((current) => ({ ...current, [notification.SenderId]: profile }));
      }).catch((error) => console.error("Failed to load notification sender:", error));
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [user?.$id]);

  const markAsRead = async () => {
    if (!user?.$id || !unreadCount) return;
    try {
      await notificationService.markAllAsRead(user.$id);
      setNotifications((current) => current.map((notification) => ({ ...notification, Read: true })));
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const openNotification = (notification: Notification) => {
    if (notification.Status === "message" || notification.Status === "match") navigate(`/messages/${notification.SenderId}`);
    else navigate(`/user/${notification.SenderId}`);
  };

  return (
    <DropdownMenu onOpenChange={(open) => { if (open) void markAsRead(); }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-lg" aria-label="Notifications">
          <Bell className="size-4" />
          {unreadCount > 0 && <Badge className="absolute -right-1 -top-1 min-w-4 justify-center rounded-full px-1 text-[10px]">{unreadCount > 9 ? "9+" : unreadCount}</Badge>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between"><span>Notifications</span>{notifications.length > 0 && <span className="text-xs font-normal text-muted-foreground">{notifications.length} recent</span>}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? <div className="px-3 py-8 text-center text-sm text-muted-foreground">You’re all caught up.</div> : notifications.map((notification) => {
          const sender = senders[notification.SenderId];
          const isMessage = notification.Status === "message";
          const isMatch = notification.Status === "match";
          return <button key={notification.$id} onClick={() => openNotification(notification)} className="flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/60">
            <Avatar className="size-9"><AvatarFallback>{sender?.Name?.slice(0, 1).toUpperCase() || "?"}</AvatarFallback></Avatar>
            <span className="min-w-0 flex-1"><span className="flex items-center gap-1.5 text-sm font-medium">{isMessage ? <MessageCircle className="size-3.5 text-primary" /> : isMatch ? <Sparkles className="size-3.5 text-primary" /> : <Heart className="size-3.5 text-rose-400" />}{sender?.Name || "Someone"} {isMessage ? "sent you a message" : isMatch ? "matched with you" : "liked your profile"}</span><span className="mt-1 block text-xs text-muted-foreground">{new Date(notification.$createdAt).toLocaleString()}</span></span>
            {!notification.Read && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />}
          </button>;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationBell;
