import { LayoutDashboard, LogOut, Menu, MessageSquare, Settings, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { logoutUser } from "@/Redux/AuthThunks";
import authService from "@/appwrite/auth";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/shared/branding/BrandLogo";

const AuthenticatedNavbar = () => {
  const user = useAppSelector((state) => state.auth.userData);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const logout = async () => {
    if (user?.$id) await authService.updateProfile(user.$id, { Status: "offline" });
    await dispatch(logoutUser()).unwrap();
    navigate("/");
  };
  const links = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/match", label: "Discover", icon: User },
    { to: "/messages", label: "Messages", icon: MessageSquare },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <BrandLogo className="h-auto w-36 max-w-[9rem]" />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"><Icon className="size-4" />{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-1 md:flex">
          <Button asChild variant="ghost" size="icon" className="rounded-lg"><Link to="/settings" aria-label="Settings"><Settings className="size-4" /></Link></Button>
          <Button asChild variant="ghost" size="icon" className="rounded-lg"><Link to="/profile" aria-label="Profile"><User className="size-4" /></Link></Button>
          <Button variant="ghost" size="icon" className="rounded-lg text-muted-foreground hover:text-destructive" onClick={logout} aria-label="Log out"><LogOut className="size-4" /></Button>
        </div>
        <button className="rounded-lg p-2 text-muted-foreground md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="fixed inset-x-0 bottom-0 top-20 z-[55] bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.nav
              className="mobile-drawer fixed inset-x-0 top-20 z-[60] min-h-[calc(100dvh-5rem)] w-full overflow-y-auto px-5 pb-8 pt-6 shadow-2xl md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col gap-1">
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Learning space</p>
                {links.map(({ to, label, icon: Icon }) => <Link key={to} onClick={() => setOpen(false)} to={to} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-white/5"><Icon className="size-4 text-primary" />{label}</Link>)}
                <Link onClick={() => setOpen(false)} to="/profile" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-white/5"><User className="size-4 text-primary" />Profile</Link>
                <button onClick={logout} className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-destructive hover:bg-destructive/10"><LogOut className="size-4" />Log out</button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AuthenticatedNavbar;
