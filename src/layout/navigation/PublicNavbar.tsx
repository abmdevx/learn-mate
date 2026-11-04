import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/shared/branding/BrandLogo";

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <BrandLogo className="h-auto w-36 max-w-[9rem]" />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" to="/features">Features</Link>
          <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" to="/about">About</Link>
          <Button asChild variant="ghost" size="sm"><Link to="/auth/login">Sign in</Link></Button>
          <Button asChild size="sm" className="rounded-lg"><Link to="/auth/signup">Get started</Link></Button>
        </nav>
        <button className="rounded-lg p-2 text-muted-foreground md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
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
              <div className="mx-auto flex max-w-7xl flex-col gap-2">
                <Link className="rounded-lg px-3 py-2 text-sm hover:bg-white/5" onClick={() => setOpen(false)} to="/features">Features</Link>
                <Link className="rounded-lg px-3 py-2 text-sm hover:bg-white/5" onClick={() => setOpen(false)} to="/about">About</Link>
                <Link className="rounded-lg px-3 py-2 text-sm hover:bg-white/5" onClick={() => setOpen(false)} to="/auth/login">Sign in</Link>
                <Button asChild className="mt-2 rounded-lg"><Link onClick={() => setOpen(false)} to="/auth/signup">Get started</Link></Button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PublicNavbar;
