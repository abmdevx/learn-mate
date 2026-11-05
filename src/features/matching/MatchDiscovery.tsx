import { useAppSelector } from "@/Redux/Hooks";
import { useState , useEffect } from "react";
import { motion } from "motion/react";
import { Loader2, ThumbsUp, X, Sparkles, ArrowLeft, RefreshCw, SlidersHorizontal, AlertCircle } from "lucide-react";
import matchService from "@/appwrite/matches";
import ReactNiceAvatar from "react-nice-avatar";
import authService from "@/appwrite/auth";
import { useNavigate } from "react-router-dom"; // ✅ Add this import
import Toast from "@/shared/feedback/AppToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function MatchDiscoveryPage() {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [profile, setProfile] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { userData } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userData?.$id) return;
      const res = await authService.getProfile(userData.$id);
      setProfile(res);
    };

    fetchProfile();
  }, [userData]);

  const handleFindMatch = async () => {
    setHasSearched(true);
    setLoading(true);
    setError(null);
    setMatches([]);

    try {
      await new Promise((r) => setTimeout(r, 1500)); // simulate delay
      const currentUserId = userData.$id;
      const res = await matchService.findMatch(currentUserId);

      if (res.length > 0) {
        setMatches(res);
      } else {
        setError("No suitable match found at the moment.");
      }
    } catch (err) {
      setError("Something went wrong while finding a match.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (matchId) => {
    try {
      const currentUserId = userData.$id;
      console.log("Saving match:", currentUserId, matchId);
      await matchService.saveLikedMatch(currentUserId, matchId);

      setToast({
        show: true,
        message: "Match saved successfully!",
        type: "success",
      });

    } catch (error) {
      setToast({
        show: true,
        message: "Failed to save match.",
        type: "error",
      });
      console.error("❌ Error saving match:", error.message || error);
      throw error;
    }
  };

  return (
    <main className="app-shell">
      <div className="page-container">
      {/* --- Top Left Go Back Button --- */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/match")}
          className="mb-8 rounded-xl"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
      <motion.div
        initial={false}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow flex items-center gap-2"><Sparkles className="size-3.5" />Curated discovery</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Find your next study partner.</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">We rank learners by shared topics so every introduction starts with something meaningful.</p>
          </div>
          {hasSearched && !loading && <Button variant="outline" className="rounded-xl" onClick={handleFindMatch}><RefreshCw className="mr-2 size-4" />Refresh results</Button>}
        </div>
        {!loading && matches.length === 0 && !error && (
          <Card className="app-surface border-primary/20 bg-primary/[0.05]">
            <CardContent className="flex flex-col items-center px-6 py-14 text-center">
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><SlidersHorizontal className="size-6" /></div>
              <h2 className="text-xl font-semibold">Ready to meet someone new?</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Start a search and we’ll surface learners whose interests and goals overlap with yours.</p>
              <Button onClick={handleFindMatch} className="mt-7 rounded-xl px-6">Find matches <Sparkles className="ml-2 size-4" /></Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="app-surface">
            <CardContent className="px-6 py-10">
              <div className="mb-8 flex flex-col items-center text-center">
              <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Loader2 className="size-7 animate-spin" />
                <span className="absolute inset-0 animate-ping rounded-2xl border border-primary/30" />
              </div>
              <h2 className="text-xl font-semibold">Finding your best matches</h2>
              <p className="mt-2 text-sm text-muted-foreground">Comparing topics, learning levels, and availability…</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => <Card key={item} className="border-white/10 bg-white/[0.02] p-6"><div className="flex flex-col items-center"><Skeleton className="size-24 rounded-full" /><Skeleton className="mt-4 h-5 w-28" /><Skeleton className="mt-2 h-4 w-20" /><div className="mt-4 flex gap-2"><Skeleton className="h-5 w-14 rounded-full" /><Skeleton className="h-5 w-16 rounded-full" /></div><Skeleton className="mt-5 h-3 w-20" /></div></Card>)}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive" className="app-surface border-destructive/30">
            <AlertCircle />
            <AlertTitle>No match found yet</AlertTitle>
            <AlertDescription className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <Button onClick={handleFindMatch} variant="outline" className="rounded-xl"><RefreshCw className="mr-2 size-4" />Try again</Button>
            </AlertDescription>
          </Alert>
        )}

        {/* --- Display all matches --- */}
        {!loading && matches.length > 0 && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => (
            <motion.div
              key={m.$id}
              initial={false}
              className="app-surface cursor-pointer border-transparent p-6 text-center transition hover:-translate-y-1 hover:border-primary/40"
              onClick={() => setSelectedMatch(m)}
            >
              <Avatar size="lg" className="mx-auto size-24 ring-2 ring-primary/20 ring-offset-4 ring-offset-background">
                {m?.Avatar ? <ReactNiceAvatar style={{ width: "100%", height: "100%" }} {...JSON.parse(m.Avatar)} /> : <AvatarFallback>{m.Name?.slice(0, 2).toUpperCase()}</AvatarFallback>}
              </Avatar>
              <h2 className="mt-4 text-lg font-semibold">{m.Name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{m.Level || "Learner"}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {m.Topics?.slice(0, 3).map((topic) => <Badge key={topic} variant="secondary">{topic}</Badge>)}
              </div>
              <p className="mt-5 text-xs font-medium text-primary">View profile</p>
            </motion.div>
          ))}
        </div>}
        {/* --- Selected Match Modal --- */}
        <Dialog open={Boolean(selectedMatch)} onOpenChange={(open) => !open && setSelectedMatch(null)}>
          {selectedMatch && (
            <DialogContent className="app-surface max-w-lg overflow-hidden p-0">
              <ScrollArea className="max-h-[min(80vh,42rem)]">
                <div className="p-6 sm:p-8">
                  <DialogHeader className="items-center text-center">
                    <Avatar size="lg" className="size-24 ring-2 ring-primary/20 ring-offset-4 ring-offset-background">
                      {selectedMatch.Avatar ? <ReactNiceAvatar style={{ width: "100%", height: "100%" }} {...JSON.parse(selectedMatch.Avatar)} /> : <AvatarFallback>{selectedMatch.Name?.slice(0, 2).toUpperCase()}</AvatarFallback>}
                    </Avatar>
                    <DialogTitle className="mt-4 text-2xl">{selectedMatch.Name}</DialogTitle>
                    <DialogDescription>{selectedMatch.Level || "Learner"} · {selectedMatch.Availability || "Flexible"}</DialogDescription>
                  </DialogHeader>
                  <Separator className="my-6" />
                  <div>
                    <p className="mb-3 text-sm font-medium">Shared topics</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMatch.Topics?.filter((topic) => profile?.Topics?.some((userTopic) => userTopic.toLowerCase() === topic.toLowerCase())).map((topic) => <Badge key={topic} variant="secondary">{topic}</Badge>) || <p className="text-sm text-muted-foreground">No matched topics</p>}
                    </div>
                  </div>
                  <div className="mt-8 flex w-full gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setSelectedMatch(null)}><X className="mr-2 size-4" />Skip</Button>
                    <Button onClick={() => handleLike(selectedMatch.$id)} className="flex-1 rounded-xl"><ThumbsUp className="mr-2 size-4" />Like</Button>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          )}
        </Dialog>

        {!loading && hasSearched && matches.length === 0 && !error && (
          <p className="text-gray-400 mt-4">No matches found. 🔄 Try again.</p>
        )}
      </motion.div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </main>
  );
}