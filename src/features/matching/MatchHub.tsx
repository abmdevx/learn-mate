import { useAppSelector } from "@/Redux/Hooks";
import { motion } from "motion/react";
import { ArrowRight, Check, Clock3, Edit3, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "@/appwrite/auth";
import type { UserProfile } from "../../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MatchHub() {
  const navigate = useNavigate();
  const { userData } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.$id) { setLoading(false); return; }
    authService.getProfile(userData.$id).then(setProfile).catch((error) => console.error("Error fetching profile:", error)).finally(() => setLoading(false));
  }, [userData]);

  return <main className="app-shell"><div className="page-container"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Discover your next connection</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Find a learning partner.</h1><p className="mt-2 max-w-xl text-muted-foreground">We’ll look for people who share your interests and have room for a meaningful exchange.</p></div><Button variant="outline" className="rounded-xl" onClick={() => navigate("/profile")}><Edit3 className="mr-2 size-4" />Edit profile</Button></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
      <Card className="app-surface"><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="size-5 text-primary" />Your match signal</CardTitle><p className="text-sm text-muted-foreground">A quick look at what we’ll use to find a strong fit.</p></CardHeader><CardContent>{loading ? <div className="space-y-5"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-16 w-full" /><Skeleton className="h-10 w-1/2" /></div> : <div className="space-y-5"><div className="flex items-start gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Check className="size-5" /></span><div><p className="text-sm font-medium">Learning level</p><p className="mt-1 text-sm text-muted-foreground">{profile?.Level || "Beginner"}</p></div></div><div className="flex items-start gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Search className="size-5" /></span><div><p className="text-sm font-medium">Topics you care about</p><div className="mt-2 flex flex-wrap gap-2">{profile?.Topics?.length ? profile.Topics.map((topic) => <Badge key={topic} variant="secondary">{topic}</Badge>) : <span className="text-sm text-muted-foreground">Add topics to improve your matches.</span>}</div></div></div><div className="flex items-start gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Clock3 className="size-5" /></span><div><p className="text-sm font-medium">When you’re available</p><p className="mt-1 text-sm text-muted-foreground">{profile?.Availability || "Flexible"}</p></div></div></div>}</CardContent></Card>
      <Card className="app-surface border-primary/20 bg-primary/[0.06]"><CardContent className="flex h-full flex-col justify-between p-6"><div><p className="eyebrow">Ready when you are</p><h2 className="mt-3 text-xl font-semibold">Start with one good conversation.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Explore a short list of people who may be a great fit for your learning goals.</p></div><Button className="mt-8 w-full rounded-xl" onClick={() => navigate("/find-match")}>Find my matches <ArrowRight className="ml-2 size-4" /></Button></CardContent></Card>
    </div>
  </motion.div></div></main>;
}
