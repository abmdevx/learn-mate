import { Bell, LockKeyhole, RefreshCcwIcon, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import Toast from "@/shared/feedback/AppToast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const handleUpdate = () => setToast({ show: true, message: "Email and password updates are coming soon.", type: "info" });
  return <main className="app-shell"><div className="page-container"><div className="max-w-3xl"><p className="eyebrow">Your preferences</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Settings</h1><p className="mt-2 text-muted-foreground">Keep your account and notifications working the way you like.</p></div><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_260px]"><Card className="app-surface"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><LockKeyhole className="size-4 text-primary" />Account security</CardTitle></CardHeader><CardContent className="space-y-5"><div className="space-y-2"><Label htmlFor="new-email">New email address</Label><Input id="new-email" disabled placeholder="Enter a new email address" className="h-11 rounded-xl" /></div><div className="space-y-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" disabled type="password" placeholder="Enter a new password" className="h-11 rounded-xl" /></div><Button onClick={handleUpdate} className="rounded-xl"><RefreshCcwIcon className="mr-2 size-4" />Update account</Button></CardContent></Card><Card className="app-surface"><CardHeader><CardTitle className="text-lg">Preferences</CardTitle></CardHeader><CardContent className="space-y-4 text-sm"><div className="flex items-center gap-3"><SlidersHorizontal className="size-4 text-primary" /><span>Personalized matching</span></div><Separator /><div className="flex items-center gap-3"><Bell className="size-4 text-primary" /><span>Connection notifications</span></div><p className="text-xs leading-5 text-muted-foreground">More controls will become available as your community grows.</p></CardContent></Card></div></div><Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} /></main>;
};
export default Settings;
