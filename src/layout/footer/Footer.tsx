import { Github, Linkedin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "@/shared/branding/BrandLogo";

const Footer = () => (
  <footer className="border-t border-white/10 bg-background/50">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-muted-foreground sm:grid-cols-3 sm:px-6 lg:px-8">
      <div>
        <Link to="/" className="inline-flex items-center font-medium text-foreground">
          <BrandLogo className="h-auto w-32 max-w-[8rem]" />
        </Link>
        <p className="mt-4 max-w-xs leading-6">Find your perfect study partner and achieve your goals together.</p>
      </div>
      <div>
        <h2 className="font-semibold text-foreground">Quick links</h2>
        <div className="mt-4 flex flex-col items-start gap-3">
          <Link className="transition-colors hover:text-foreground" to="/">Home</Link>
          <Link className="transition-colors hover:text-foreground" to="/features">Features</Link>
          <Link className="transition-colors hover:text-foreground" to="/about">About</Link>
          <Link className="transition-colors hover:text-foreground" to="/copyright">Copyright</Link>
        </div>
      </div>
      <div>
        <h2 className="font-semibold text-foreground">Connect with us</h2>
        <div className="mt-4 flex items-center gap-3">
          <a href="https://github.com/abmdevx" target="_blank" rel="noopener noreferrer" aria-label="LearnMate on GitHub" className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-colors hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"><Github className="size-4" /></a>
          <a href="https://www.linkedin.com/in/abdullah-bin-mughira/" target="_blank" rel="noopener noreferrer" aria-label="LearnMate on LinkedIn" className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-colors hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"><Linkedin className="size-4" /></a>
          <a href="https://github.com/abmdevx/learn-mate/issues" target="_blank" rel="noopener noreferrer" aria-label="Contact LearnMate on WhatsApp" className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-colors hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"><MessageCircle className="size-4" /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-muted-foreground">
      <span>© {new Date().getFullYear()} LearnMate. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;
