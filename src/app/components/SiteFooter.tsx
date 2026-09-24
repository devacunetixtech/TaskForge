import { ExternalLink } from "lucide-react";
import Link from "next/link";

const botChainLinks = [
  { href: "https://botchain.ai", label: "https://botchain.ai" },
  { href: "https://scan.botchain.ai", label: "https://scan.botchain.ai" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="brand" href="/" aria-label="TaskForge home">
        <span className="brand-mark">T</span>
        <span>Task<span className="muted-brand">Forge</span></span>
      </Link>
      <div className="footer-ecosystem">
        <span className="footer-network"><span className="pulse-dot" />BOT Chain ecosystem</span>
        <nav className="footer-links" aria-label="BOT Chain links">
          {botChainLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}<ExternalLink size={13} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
