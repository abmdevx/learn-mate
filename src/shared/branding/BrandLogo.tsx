import logoUrl from "../../../assets/logo.png";

interface BrandLogoProps {
  className?: string;
}

const BrandLogo = ({ className = "h-auto w-36" }: BrandLogoProps) => (
  <img
    src={logoUrl}
    alt="LearnMate"
    className={`object-contain ${className}`}
  />
);

export default BrandLogo;
