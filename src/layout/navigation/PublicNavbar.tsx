import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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
      {open && <nav className="border-t border-white/10 bg-background p-4 md:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-2">
          <Link className="rounded-lg px-3 py-2 text-sm hover:bg-white/5" onClick={() => setOpen(false)} to="/features">Features</Link>
          <Link className="rounded-lg px-3 py-2 text-sm hover:bg-white/5" onClick={() => setOpen(false)} to="/about">About</Link>
          <Link className="rounded-lg px-3 py-2 text-sm hover:bg-white/5" onClick={() => setOpen(false)} to="/auth/login">Sign in</Link>
          <Button asChild className="mt-2 rounded-lg"><Link onClick={() => setOpen(false)} to="/auth/signup">Get started</Link></Button>
        </div>
      </nav>}
    </header>
  );
};

export default PublicNavbar;
