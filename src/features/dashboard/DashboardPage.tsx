import { useAppSelector } from "@/Redux/Hooks";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Clock3, MessageCircle, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "@/appwrite/auth";
import matchService from "@/appwrite/matches";
import ReactNiceAvatar from "react-nice-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { userData } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<any>({});
  const [matchedProfiles, setMatchedProfiles] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData?.$id) { setLoading(false); return; }
    const fetchData = async () => {
      try {
        const [profileData, matches] = await Promise.all([
          authService.getProfile(userData.$id),
          matchService.getMatchedProfiles(userData.$id, authService),
        ]);
        setProfile(profileData);
        setMatchedProfiles(matches);
        sessionStorage.setItem(`profile-${userData.$id}`, JSON.stringify(profileData));
        authService.updateProfile(userData.$id, { Status: "online" }).catch((error) => console.error("Failed to update online status:", error));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userData]);

  return (
    <main className="app-shell">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Your learning space</p>
              {loading ? <><Skeleton className="mt-3 h-10 w-72" /><Skeleton className="mt-3 h-5 w-96 max-w-full" /></> : <><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back{profile?.Name ? `, ${profile.Name.split(" ")[0]}` : ""}.</h1><p className="mt-2 text-muted-foreground">Keep your momentum going with the right people around you.</p></>}
            </div>
            <Button onClick={() => navigate("/match")} className="rounded-xl">Discover partners <ArrowRight className="ml-2 size-4" /></Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Current level", value: profile?.Level || "Beginner", icon: BookOpen },
              { label: "Availability", value: profile?.Availability || "Flexible", icon: Clock3 },
              { label: "Learning partners", value: matchedProfiles.length, icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} className="app-surface"><CardContent className="flex items-center gap-4 p-5">{loading ? <><Skeleton className="size-10 rounded-xl" /><div><Skeleton className="h-3 w-24" /><Skeleton className="mt-2 h-5 w-20" /></div></> : <><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div></>}</CardContent></Card>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <Card className="app-surface">
              <CardHeader className="flex-row items-center justify-between"><div><CardTitle className="text-xl">Your learning partners</CardTitle><p className="mt-1 text-sm text-muted-foreground">People you’ve connected with so far.</p></div>{loading ? <Skeleton className="h-5 w-16 rounded-full" /> : <Badge variant="secondary">{matchedProfiles.length} total</Badge>}</CardHeader>
              <CardContent>
                {loading ? <div className="grid gap-3 sm:grid-cols-2">{[1, 2, 3, 4].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 p-3"><Skeleton className="size-12 rounded-full" /><div className="flex-1"><Skeleton className="h-4 w-28" /><Skeleton className="mt-2 h-3 w-36" /></div></div>)}</div> : matchedProfiles.length === 0 ? <div className="rounded-xl border border-dashed border-white/15 px-6 py-12 text-center"><Users className="mx-auto size-8 text-muted-foreground" /><p className="mt-4 font-medium">Your partner list is waiting for its first connection.</p><p className="mt-1 text-sm text-muted-foreground">Tell us what you want to learn and we’ll help you find a fit.</p><Button variant="outline" className="mt-5 rounded-lg" onClick={() => navigate("/match")}>Find a partner</Button></div> :
                  <div className="grid gap-3 sm:grid-cols-2">{matchedProfiles.map((match) => <button key={match.$id} onClick={() => setSelectedUser(match)} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3 text-left transition hover:border-primary/30 hover:bg-white/[0.05]"><div className="relative shrink-0">{match.Avatar ? <ReactNiceAvatar style={{ width: 48, height: 48 }} {...JSON.parse(match.Avatar)} /> : <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">{match.Name?.[0]}</div>}<span className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-card ${match.Status === "online" ? "bg-emerald-400" : "bg-muted-foreground/50"}`} /></div><div className="min-w-0"><p className="truncate font-medium">{match.Name}</p><p className="text-xs text-muted-foreground">{match.Status === "online" ? "Online now" : "Available to connect"}</p></div></button>)}</div>}
              </CardContent>
            </Card>
            <Card className="app-surface border-primary/20 bg-primary/[0.06]"><CardContent className="flex h-full flex-col justify-between p-6"><div><span className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><MessageCircle className="size-5" /></span><h2 className="text-xl font-semibold">Make your next connection count.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Find someone who understands your goals and makes showing up easier.</p></div><Button variant="secondary" className="mt-8 w-full rounded-xl" onClick={() => navigate("/match")}>Explore matches <ArrowRight className="ml-2 size-4" /></Button></CardContent></Card>
          </div>
        </motion.div>
      </div>
      {selectedUser && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelectedUser(null)}><Card className="app-surface w-full max-w-sm" onClick={(event) => event.stopPropagation()}><CardContent className="relative flex flex-col items-center p-8 text-center"><button className="absolute right-4 top-4 text-muted-foreground hover:text-foreground" onClick={() => setSelectedUser(null)}><X className="size-4" /></button>{selectedUser.Avatar ? <ReactNiceAvatar style={{ width: 88, height: 88 }} {...JSON.parse(selectedUser.Avatar)} /> : <div className="flex size-22 items-center justify-center rounded-full bg-primary/15 text-3xl font-semibold text-primary">{selectedUser.Name?.[0]}</div>}<h2 className="mt-4 text-xl font-semibold">{selectedUser.Name}</h2><p className="mt-1 text-sm text-muted-foreground">{selectedUser.Level || "Learner"} · {selectedUser.Timezone || "Flexible timezone"}</p><Button className="mt-6 w-full rounded-xl" onClick={() => navigate(`/messages/${selectedUser.$id}`)}>Open conversation <MessageCircle className="ml-2 size-4" /></Button></CardContent></Card></div>}
    </main>
  );
}
