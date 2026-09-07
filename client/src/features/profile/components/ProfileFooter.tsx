import { motion } from 'framer-motion'
import Logo from '../../../components/Logo'
import { ArrowUpRight } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface ProfileFooterProps {
  username: string
  links: { github: string; twitter: string; email: string }
}

export default function ProfileFooter({ username, links }: ProfileFooterProps) {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
      className="border-t border-white/[0.06] py-12 px-5 md:px-8 mt-8"
    >
      <div className="max-w-[860px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* CTA */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#B6F34A] font-mono mb-2">
              WANT TO BUILD SOMETHING?
            </p>
            <p className="text-[clamp(1.2rem,2.5vw,1.8rem)] font-bold tracking-[-0.04em] text-[#F5F7F2]">
              @{username}
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5">
            {[
              { url: links.github, label: 'GitHub' },
              { url: links.twitter, label: 'X' },
              { url: links.email, label: 'Email' },
            ].filter(l => l.url).map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('mailto') ? undefined : '_blank'}
                rel={link.url.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="flex items-center gap-1 text-[11px] text-[#555B55] hover:text-[#F5F7F2] transition-colors duration-200 font-mono"
              >
                {link.label}
                <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.04]">
          <Logo size="sm" animate={false} />
          <span className="text-[9px] text-[#303530] font-mono">© 2026</span>
        </div>
      </div>
    </motion.footer>
  )
}
