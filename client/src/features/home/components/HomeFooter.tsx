import { Link } from 'react-router'

const footerLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Builders', href: '#builders' },
  { label: 'Community', href: '#community' },
  { label: 'GitHub', href: 'https://github.com', external: true },
]

export default function HomeFooter() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-[#B6F34A] rounded-sm flex items-center justify-center">
                <span className="text-[10px] font-black text-[#080A08]">S</span>
              </div>
              <span className="text-[13px] font-bold tracking-[0.15em] text-[#F5F7F2] uppercase">
                Shipfolio
              </span>
            </Link>
            <p className="text-[13px] text-[#555B55] max-w-xs leading-relaxed">
              A living portfolio for things you actually build.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-[13px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between gap-4">
          <p className="text-[11px] text-[#303530] font-mono">
            &copy; {new Date().getFullYear()} Shipfolio
          </p>
          <p className="text-[11px] text-[#303530] font-mono">
            Built with intention.
          </p>
        </div>
      </div>
    </footer>
  )
}
