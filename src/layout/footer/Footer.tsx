import { Link } from "react-router-dom";
import BrandLogo from "@/shared/branding/BrandLogo";

const Footer = () => (
  <footer className="border-t border-white/10 bg-background/50">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-2 font-medium text-foreground"><BrandLogo className="h-auto w-32 max-w-[8rem]" /></Link>
      <div className="flex gap-5"><Link className="hover:text-foreground" to="/about">About</Link><Link className="hover:text-foreground" to="/features">Features</Link><Link className="hover:text-foreground" to="/copyright">Copyright</Link></div>
      <p>Learn together. Go further.</p>
    </div>
  </footer>
);

export default Footer;
