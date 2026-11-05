import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useNavigate, useParams } from "react-router-dom";
import authService from "@/appwrite/auth";
import { useEffect, useState } from "react";
import ReactNiceAvatar from "react-nice-avatar";
import { motion } from "motion/react";
import { ArrowLeft, Check, Loader2, ThumbsUp } from "lucide-react";
import matchService from "@/appwrite/matches";
import Toast from "@/shared/feedback/AppToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const { userData } = useAppSelector((state) => state.auth); // this has only Appwrite account info
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      // Fetch other user's profile
      const other = await authService.getProfile(id);
      setProfile(other);

      // Fetch logged-in user's *custom* profile
      if (userData?.$id) {
        const self = await authService.getProfile(userData.$id);
        setCurrentProfile(self);
      }
    };
    fetchProfiles();
  }, [id, userData]);

  const handleLike = async (matchId) => {
    try {
      setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

    if (!profile) {
    return (
      <main className="app-shell">
        <div className="page-container flex min-h-[70vh] items-center justify-center">
          <Card className="app-surface w-full max-w-3xl overflow-hidden">
            <div className="flex flex-col items-center bg-primary/[0.08] px-6 pb-8 pt-10">
              <Skeleton className="size-28 rounded-full" />
              <Skeleton className="mt-5 h-8 w-44" />
              <Skeleton className="mt-2 h-4 w-52" />
            </div>
            <CardContent className="space-y-8 p-6 sm:p-10">
              <div className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-20 rounded-xl" /><Skeleton className="h-20 rounded-xl" /></div>
              <Skeleton className="h-px w-full" />
              <div><Skeleton className="h-5 w-32" /><div className="mt-4 flex gap-2"><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-6 w-24 rounded-full" /><Skeleton className="h-6 w-16 rounded-full" /></div></div>
              <div className="flex gap-3"><Skeleton className="h-10 flex-1 rounded-xl" /><Skeleton className="h-10 flex-1 rounded-xl" /></div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const profileTopics = Array.isArray(profile.Topics)
    ? profile.Topics
    : JSON.parse(profile.Topics || "[]");

  const currentTopics = Array.isArray(currentProfile?.Topics)
    ? currentProfile.Topics
    : JSON.parse(currentProfile?.Topics || "[]");

  const matchedTopics =
    profileTopics.filter((topic) =>
      currentTopics.some(
        (t) => t.trim().toLowerCase() === topic.trim().toLowerCase()
      )
    ) || [];

  return (
  <main className="app-shell">
    <div className="page-container">
      <Button variant="outline" className="mb-8 rounded-xl" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 size-4" />Back to matches
      </Button>
      <motion.div initial={false} className="mx-auto max-w-3xl">
        <Card className="app-surface overflow-hidden">
          <div className="bg-primary/[0.08] px-6 pb-8 pt-10 text-center sm:px-10">
            <div className="mx-auto flex size-28 items-center justify-center rounded-full border-4 border-background bg-card shadow-xl">
              {profile?.Avatar ? <ReactNiceAvatar style={{ width: "100%", height: "100%" }} {...JSON.parse(profile.Avatar)} /> : <div className="size-20 rounded-full bg-primary/20" />}
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight">{profile.Name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Potential learning partner</p>
          </div>
          <CardContent className="p-6 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">Learning level</p><p className="mt-2 font-medium">{profile.Level || "Not specified"}</p></div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">Availability</p><p className="mt-2 font-medium">{profile.Availability || "Flexible"}</p></div>
            </div>
            <Separator className="my-8" />
            <CardHeader className="p-0"><CardTitle className="text-lg">Shared topics</CardTitle></CardHeader>
            <div className="mt-4 flex flex-wrap gap-2">
              {matchedTopics.length > 0 ? matchedTopics.map((topic) => <Badge key={topic} variant="secondary"><Check className="mr-1 size-3" />{topic}</Badge>) : <p className="text-sm text-muted-foreground">No shared topics found.</p>}
            </div>
            {profile.Bio && <><Separator className="my-8" /><p className="text-sm leading-7 text-muted-foreground">{profile.Bio}</p></>}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => navigate(-1)}>Keep exploring</Button>
              <Button className="flex-1 rounded-xl" disabled={saving} onClick={() => handleLike(profile.$id)}>
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ThumbsUp className="mr-2 size-4" />}
                {saving ? "Saving…" : "Like this match"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  </main>
  );
};

export default UserProfile;