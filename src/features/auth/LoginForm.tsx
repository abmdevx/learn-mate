import { useAppDispatch } from "@/Redux/Hooks";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "@/Redux/AuthThunks";
import { useEffect, useState } from "react";
import authService from "@/appwrite/auth";
import Toast from "@/shared/feedback/AppToast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BrandLogo from "@/shared/branding/BrandLogo";

interface LoginForm { email: string; password: string }

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<LoginForm>();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timer, setTimer] = useState(0);
  const MAX_ATTEMPTS = 3;
  const BLOCK_TIME = 5 * 60;

  const handleLogin = async (data: LoginForm) => {
    if (isBlocked) return;
    try {
      setLoading(true);
      const user = await dispatch(loginUser(data)).unwrap();
      await authService.updateProfile(user.$id, { Status: "online" });
      setFailedAttempts(0);
      setTimeout(() => { setLoading(false); navigate("/dashboard"); }, 700);
    } catch (error) {
      setLoading(false);
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      setToast({ show: true, message: String(error || "Invalid email or password"), type: "error" });
      if (nextAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        setTimer(BLOCK_TIME);
        localStorage.setItem("loginBlockedUntil", String(Date.now() + BLOCK_TIME * 1000));
      }
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("loginBlockedUntil");
    if (stored) {
      const remaining = Math.floor((Number(stored) - Date.now()) / 1000);
      if (remaining > 0) { setIsBlocked(true); setTimer(remaining); } else localStorage.removeItem("loginBlockedUntil");
    }
  }, []);

  useEffect(() => {
    if (!isBlocked) return;
    const interval = setInterval(() => setTimer((value) => {
      if (value <= 1) { clearInterval(interval); setIsBlocked(false); setFailedAttempts(0); localStorage.removeItem("loginBlockedUntil"); return 0; }
      return value - 1;
    }), 1000);
    return () => clearInterval(interval);
  }, [isBlocked]);

  return <main className="app-shell flex min-h-screen items-center justify-center px-4 py-28">
    <Card className="app-surface w-full max-w-md">
      <CardHeader className="space-y-5 p-7 pb-4">
        <BrandLogo className="h-auto w-44 max-w-[11rem]" />
        <div><p className="eyebrow">Welcome back</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Continue your learning journey.</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to pick up where you left off.</p></div>
      </CardHeader>
      <CardContent className="p-7 pt-3">
        <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
          <div className="space-y-2"><Label htmlFor="email">Email address</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="email" placeholder="you@example.com" className="h-11 rounded-xl pl-10" {...register("email", { required: true })} /></div></div>
          <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="password">Password</Label><Link className="text-xs text-primary hover:underline" to="/auth/forget-password">Forgot password?</Link></div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" type="password" placeholder="Enter your password" className="h-11 rounded-xl pl-10" {...register("password", { required: true })} /></div></div>
          <Button className="h-11 w-full rounded-xl" type="submit" disabled={loading || isBlocked}>{loading ? "Signing you in…" : isBlocked ? `Try again in ${timer}s` : <>Sign in <ArrowRight className="ml-2 size-4" /></>}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">New to LearnMate? <Link className="font-medium text-primary hover:underline" to="/auth/signup">Create an account</Link></p>
      </CardContent>
    </Card>
    <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
  </main>;
};

export default LoginForm;
