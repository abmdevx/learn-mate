import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCheck,
  Menu,
  MoreHorizontal,
  Search,
  Send,
  Smile,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ReactNiceAvatar from "react-nice-avatar";
import matchService from "@/appwrite/matches";
import authService from "@/appwrite/auth";
import messageService from "@/appwrite/messages";
import notificationService from "@/appwrite/notifications";
import { useAppSelector } from "@/Redux/Hooks";
import type { Message } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Profile = {
  $id: string;
  Name?: string;
  Avatar?: string;
  Status?: string;
};

const avatarFor = (profile?: Profile | null) => {
  if (!profile?.Avatar) return null;
  try {
    return JSON.parse(profile.Avatar);
  } catch {
    return null;
  }
};

function ProfileAvatar({ profile, size = "size-11" }: { profile?: Profile | null; size?: string }) {
  const config = avatarFor(profile);
  return config ? (
    <ReactNiceAvatar style={{ width: "100%", height: "100%" }} {...config} />
  ) : (
    <Avatar className={size}>
      <AvatarFallback>{profile?.Name?.slice(0, 1).toUpperCase() || "?"}</AvatarFallback>
    </Avatar>
  );
}

function MessagingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAppSelector((state) => state.auth);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const matchIdRef = useRef<string | null>(null);
  const loadedMessageCountRef = useRef(0);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") =>
    messagesEndRef.current?.scrollIntoView({ behavior });

  useEffect(() => {
    const fetchMatches = async () => {
      if (!userData?.$id) {
        setLoadingMatches(false);
        return;
      }
      try {
        const result = await matchService.getMatchedProfiles(userData.$id, authService);
        const nextProfiles = result as Profile[];
        setProfiles(nextProfiles);
        setSelectedUser(userId ? nextProfiles.find((profile) => profile.$id === userId) || null : null);
      } catch {
        setError("We couldn't load your conversations. Please try again.");
      } finally {
        setLoadingMatches(false);
      }
    };
    fetchMatches();
  }, [userData?.$id, userId]);

  useEffect(() => {
    if (!selectedUser || !userData?.$id) return;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    setLoadingMessages(true);
    setMessages([]);
    setError("");

    const setupChat = async () => {
      try {
        const match = await matchService.getMatchBetweenUsers(userData.$id, selectedUser.$id);
        if (!match || cancelled) {
          setLoadingMessages(false);
          return;
        }
        matchIdRef.current = match.$id;
        const initialPage = await messageService.getMessagesPage(match.$id);
        if (cancelled) return;
        setMessages(initialPage.rows);
        loadedMessageCountRef.current = initialPage.rows.length;
        setHasOlderMessages(initialPage.rows.length < initialPage.total);
        setLoadingMessages(false);
        requestAnimationFrame(() => scrollToBottom("auto"));
        unsubscribe = messageService.subscribeToMessages(match.$id, (incoming: Message) => {
          setMessages((current) =>
            current.some((message) => message.$id === incoming.$id) ? current : [...current, incoming],
          );
          requestAnimationFrame(() => scrollToBottom());
        });
      } catch {
        if (!cancelled) {
          setError("We couldn't load this conversation.");
          setLoadingMessages(false);
        }
      }
    };
    setupChat();
    return () => {
      cancelled = true;
      matchIdRef.current = null;
      loadedMessageCountRef.current = 0;
      unsubscribe?.();
    };
  }, [selectedUser?.$id, userData?.$id]);

  const loadOlderMessages = async () => {
    if (!matchIdRef.current || loadingOlderMessages || !hasOlderMessages) return;
    setLoadingOlderMessages(true);
    try {
      const page = await messageService.getMessagesPage(matchIdRef.current, {
        offset: loadedMessageCountRef.current,
      });
      setMessages((current) => [...page.rows, ...current]);
      loadedMessageCountRef.current += page.rows.length;
      setHasOlderMessages(loadedMessageCountRef.current < page.total);
    } catch {
      setError("Older messages couldn't be loaded.");
    } finally {
      setLoadingOlderMessages(false);
    }
  };

  const filteredProfiles = useMemo(
    () => profiles.filter((profile) => profile.Name?.toLowerCase().includes(search.toLowerCase())),
    [profiles, search],
  );

  const selectUser = (profile: Profile) => {
    setSelectedUser(profile);
    setMobileListOpen(false);
    navigate(`/messages/${profile.$id}`);
  };

  const handleSend = async () => {
    const content = newMessage.trim();
    if (!content || !selectedUser || !userData?.$id || sending) return;
    setSending(true);
    setError("");
    try {
      if (!matchIdRef.current) throw new Error("Conversation unavailable");
      await messageService.sendMessage({ matchId: matchIdRef.current, senderId: userData.$id, message: content });
      await notificationService.sendMessageNotification(userData.$id, selectedUser.$id).catch((notificationError) => {
        console.error("Message sent, but notification creation failed:", notificationError);
      });
      setNewMessage("");
    } catch {
      setError("Your message couldn't be sent. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const conversationList = (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-border/60 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations..." className="h-10 border-border/60 bg-background/50 pl-9 pr-9" />
          {search && <button aria-label="Clear search" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="size-4" /></button>}
        </div>
      </div>
      <ScrollArea className="flex-1 px-2 py-3">
        {loadingMatches ? (
          <div className="space-y-2">{[1, 2, 3, 4].map((item) => <div key={item} className="flex gap-3 rounded-xl p-3"><Skeleton className="size-11 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-36" /></div></div>)}</div>
        ) : filteredProfiles.length ? (
          filteredProfiles.map((profile) => {
            const active = selectedUser?.$id === profile.$id;
            return <button key={profile.$id} onClick={() => selectUser(profile)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${active ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted/60"}`}>
              <div className="relative size-11 shrink-0"><ProfileAvatar profile={profile} size="size-11" />{profile.Status === "online" && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500" />}</div>
              <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-medium">{profile.Name || "Learner"}</p>{active && <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex">Active</Badge>}</div><p className="truncate text-xs text-muted-foreground">{profile.Status || "offline"} · Start a conversation</p></div>
            </button>;
          })
        ) : <div className="px-4 py-10 text-center"><UserRound className="mx-auto size-8 text-muted-foreground/60" /><p className="mt-3 text-sm font-medium">No conversations found</p><p className="mt-1 text-xs text-muted-foreground">Try a different search.</p></div>}
      </ScrollArea>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="mt-20 flex h-[calc(100vh-5rem)] min-h-[560px] bg-background">
        <aside className="hidden w-[min(100%,21rem)] shrink-0 flex-col border-r border-border/60 bg-card/30 md:flex">
          <div className="flex min-h-[5.25rem] items-center justify-between border-b border-border/60 px-5 py-4"><div><h1 className="text-xl font-semibold tracking-tight">Messages</h1><p className="mt-1 text-xs text-muted-foreground">{profiles.length} learning connections</p></div><Badge variant="outline" className="rounded-full">Chat</Badge></div>
          {conversationList}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          {selectedUser ? <motion.div key={selectedUser.$id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-0 flex-1 flex-col">
            <header className="flex min-h-[5.25rem] items-center gap-3 border-b border-border/60 bg-card/20 px-4 py-4 sm:px-8">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileListOpen(true)} aria-label="Open conversations"><Menu /></Button>
              <div className="relative size-12 shrink-0"><ProfileAvatar profile={selectedUser} size="size-12" />{selectedUser.Status === "online" && <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />}</div>
              <div className="min-w-0 flex-1"><h2 className="truncate font-semibold">{selectedUser.Name || "Learner"}</h2><p className="text-xs text-muted-foreground">{selectedUser.Status === "online" ? "Online now" : "Available to learn together"}</p></div>
              <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Conversation actions"><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => navigate(`/user/${selectedUser.$id}`)}><UserRound className="mr-2 size-4" />View profile</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => setError("Conversation actions are not available yet.")}>Report conversation</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
            </header>

            <ScrollArea className="flex-1 px-4 sm:px-8">
              <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-end gap-3 py-6">
                {!loadingMessages && hasOlderMessages && <Button variant="outline" size="sm" className="mx-auto" onClick={loadOlderMessages} disabled={loadingOlderMessages}>{loadingOlderMessages ? "Loading older messages..." : "Load older messages"}</Button>}
                {loadingMessages ? <div className="space-y-3">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className={`h-12 rounded-2xl ${item % 2 ? "ml-auto w-2/3" : "w-1/2"}`} />)}</div> : messages.length ? messages.map((message) => {
                  const mine = message.SenderId === userData?.$id;
                  return <div key={message.$id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm sm:max-w-[70%] ${mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted"}`}><p className="whitespace-pre-wrap break-words">{message.Message}</p><div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{message.$createdAt ? new Date(message.$createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now"}{mine && <CheckCheck className="size-3" />}</div></div></div>;
                }) : <div className="m-auto max-w-sm py-12 text-center"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Send className="size-6" /></div><h3 className="mt-4 font-semibold">Start the conversation</h3><p className="mt-1 text-sm text-muted-foreground">Say hello and start learning together.</p></div>}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-border/60 bg-card/20 px-4 py-3 sm:px-8"><div className="mx-auto max-w-3xl">
              {error && <Alert variant="destructive" className="mb-3"><AlertTitle>Something went wrong</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="flex items-end gap-2 rounded-2xl border border-border/70 bg-background/70 p-2 shadow-sm"><Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="mb-0.5 shrink-0" aria-label="Add emoji"><Smile /></Button></TooltipTrigger><TooltipContent>Emoji picker coming soon</TooltipContent></Tooltip><Textarea value={newMessage} onChange={(event) => setNewMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); handleSend(); } }} placeholder={`Message ${selectedUser.Name || "your connection"}...`} rows={1} className="max-h-32 min-h-9 resize-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0" /><Tooltip><TooltipTrigger asChild><Button type="button" size="icon" className="mb-0.5 shrink-0 rounded-xl" disabled={!newMessage.trim() || sending} onClick={handleSend} aria-label="Send message"><Send className={sending ? "animate-pulse" : ""} /></Button></TooltipTrigger><TooltipContent>Send message</TooltipContent></Tooltip></div><p className="mt-2 hidden text-[11px] text-muted-foreground sm:block">Enter to send · Shift + Enter for a new line</p>
            </div></div>
          </motion.div> : <div className="flex flex-1 flex-col items-center justify-center px-6 text-center"><div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Send className="size-7" /></div><h2 className="mt-5 text-xl font-semibold">Your learning conversations</h2><p className="mt-2 max-w-sm text-sm text-muted-foreground">Select a connection to exchange ideas, plan study sessions, and learn together.</p><Button className="mt-6 md:hidden" onClick={() => setMobileListOpen(true)}><Search className="mr-2 size-4" />Browse conversations</Button></div>}
        </main>
      </div>
      <Sheet open={mobileListOpen} onOpenChange={setMobileListOpen}><SheetContent side="left" className="flex w-[min(90vw,22rem)] flex-col p-0"><SheetHeader className="border-b border-border/60 p-5 text-left"><SheetTitle>Messages</SheetTitle></SheetHeader>{conversationList}</SheetContent></Sheet>
    </TooltipProvider>
  );
}

export default MessagingPage;
