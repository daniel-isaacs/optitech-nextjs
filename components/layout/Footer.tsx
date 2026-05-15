import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "About",   href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-canvas border-t border-fg/10">
      <div className="px-md py-xl lg:px-lg">

        <div className="flex flex-col gap-lg lg:flex-row lg:items-start lg:justify-between">

          {/* Wordmark */}
          <Link
            href="/"
            className="text-sm font-extrabold tracking-[0.12em] uppercase text-fg
                       hover:text-fg-muted transition-colors duration-150 ease-quick"
          >
            OptiTech
          </Link>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-md lg:gap-lg">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-normal text-fg-muted
                               hover:text-fg transition-colors duration-150 ease-quick"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        {/* Copyright bar */}
        <div className="mt-xl pt-md border-t border-fg/10">
          <p className="text-label tracking-label uppercase text-fg-muted">
            &copy; {new Date().getFullYear()} OptiTech. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
