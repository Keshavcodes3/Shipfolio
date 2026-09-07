import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, GitFork, ExternalLink, Users, Code2, Clock, Rocket, Sparkles, Globe, GitBranch, Eye } from 'lucide-react'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import { useProject, useGithubReadme, useGithubContributors, useGithubLanguages } from '../../../lib/hooks'
import LoadingScreen from '../../../components/LoadingScreen'
import Logo from '../../../components/Logo'
import SEO from '../../../components/SEO'

const ease = [0.22, 1, 0.36, 1] as const

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  if (d < 7) return `${d}d ago`
  const w = Math.floor(d / 7)
  if (w < 4) return `${w}w ago`
  return `${Math.floor(d / 30)}mo ago`
}

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

const langColors: Record<string, string> = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Go: '#00ADD8',
  Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d', C: '#555555', Ruby: '#701516',
  PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Vue: '#41b883',
  Svelte: '#ff3e00', Lua: '#000080', Elixir: '#6e4a7e', Haskell: '#5e5086',
}

function getLangColor(name: string) {
  return langColors[name] || '#8A8F89'
}

function ReadmeContent({ content }: { content: string }) {
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const html = escapeHtml(content)
    .replace(/^### (.*$)/gm, '<h3 class="text-[17px] font-bold text-[#F5F7F2] mt-8 mb-3">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-[20px] font-bold text-[#F5F7F2] mt-10 mb-4 pb-2 border-b border-white/[0.06]">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-[26px] font-black text-[#F5F7F2] mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#F5F7F2] font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-[#8A8F89]">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="text-[#B6F34A] bg-white/[0.04] px-1.5 py-0.5 text-[13px] font-mono rounded">$1</code>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-black/30 border border-white/[0.06] p-4 my-4 overflow-x-auto text-[13px] font-mono text-[#8A8F89] leading-relaxed rounded-lg"><code>$2</code></pre>')
    .replace(/^\- (.*$)/gm, '<li class="text-[14px] text-[#8A8F89] leading-relaxed ml-4 list-disc marker:text-[#B6F34A]/40">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="text-[14px] text-[#8A8F89] leading-relaxed ml-4 list-decimal marker:text-[#B6F34A]/40">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#B6F34A] hover:underline decoration-[#B6F34A]/30 underline-offset-2">$1</a>')
    .replace(/\n\n/g, '</p><p class="text-[14px] text-[#8A8F89] leading-[1.8] mb-4">')
    .replace(/\n/g, '<br/>')

  return (
    <div
      className="prose prose-invert max-w-none [&_h1]:font-black [&_h2]:tracking-[-0.02em] [&_h3]:tracking-[-0.01em]"
      dangerouslySetInnerHTML={{ __html: `<p class="text-[14px] text-[#8A8F89] leading-[1.8] mb-4">${html}</p>` }}
    />
  )
}

export default function ShowcaseProject() {
  const { id } = useParams<{ id: string }>()
  const { data: project, isLoading: projectLoading } = useProject(id!)

  const githubRepo = project?.githubRepo
  const fullName = githubRepo?.fullName

  const { data: readmeData, isLoading: readmeLoading } = useGithubReadme(fullName)
  const { data: contributors, isLoading: contributorsLoading } = useGithubContributors(fullName)
  const { data: languages } = useGithubLanguages(fullName)

  if (projectLoading) return <LoadingScreen />
  if (!project) {
    return (
      <SidebarShell>
        <div className="flex items-center justify-center px-5 py-32">
          <div className="text-center">
            <p className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] text-[#F5F7F2] mb-3">
              PROJECT NOT FOUND
            </p>
            <Link to="/discover" className="text-[12px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors">
              ← BACK TO DISCOVER
            </Link>
          </div>
        </div>
      </SidebarShell>
    )
  }

  const techs = project.technologies.map((t) => t.technology.name)
  const isBuilding = project.status === 'BUILDING'
  const totalLangBytes = languages?.reduce((sum, l) => sum + l.bytes, 0) ?? 0

  return (
    <SidebarShell>
      <SEO
        title={project?.name || 'Showcase Project'}
        description={project?.description || 'A featured project on ShipFolio.'}
        url={`/showcase/${id}`}
        type="article"
      />
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[3%] right-[-8%] w-[700px] h-[700px] rounded-full bg-[#B6F34A]/[0.018] blur-[200px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.012] blur-[160px]" />
      </div>

      <div className="relative z-10 text-[#F5F7F2]">
        <div className="max-w-[920px] mx-auto px-5 md:px-8 py-8">

          {/* Back nav */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#555B55] hover:text-[#B6F34A] transition-colors mb-8 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              DISCOVER
            </Link>
          </motion.div>

          {/* ========== HERO ========== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5, ease }}
            className="mb-10"
          >
            {/* Status + badges */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] font-mono ${isBuilding ? 'text-[#B6F34A]' : 'text-[#555B55]'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isBuilding ? 'bg-[#B6F34A] animate-pulse' : 'bg-[#555B55]'}`} />
                {isBuilding ? 'BUILDING' : 'SHIPPED'}
              </span>
              {project.isFeatured && (
                <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] font-mono text-[#B6F34A] bg-[#B6F34A]/[0.08] px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  FEATURED
                </span>
              )}
              {githubRepo?.primaryLanguage && (
                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] font-mono text-[#8A8F89]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getLangColor(githubRepo.primaryLanguage) }} />
                  {githubRepo.primaryLanguage}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-black tracking-[-0.06em] leading-[0.9] text-[#F5F7F2] mb-4">
              {project.name}
            </h1>

            {/* Description */}
            <p className="text-[16px] text-[#8A8F89] leading-relaxed max-w-[580px] mb-6">
              {project.description ?? 'No description yet.'}
            </p>

            {/* Action links */}
            <div className="flex flex-wrap gap-3 mb-8">
              {githubRepo && (
                <a
                  href={githubRepo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[12px] font-mono bg-white/[0.04] border border-white/[0.08] px-5 py-2.5 hover:bg-white/[0.06] hover:border-[#B6F34A]/20 transition-all rounded-lg group"
                >
                  <svg className="w-4 h-4 text-[#8A8F89] group-hover:text-[#F5F7F2] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  SOURCE CODE
                  <ExternalLink className="w-3 h-3 text-[#555B55] group-hover:text-[#B6F34A] transition-colors" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[12px] font-mono bg-[#B6F34A]/[0.08] border border-[#B6F34A]/20 text-[#B6F34A] px-5 py-2.5 hover:bg-[#B6F34A]/[0.14] transition-all rounded-lg group"
                >
                  <Globe className="w-4 h-4" />
                  LIVE DEMO
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
            </div>

            {/* Builder */}
            <Link
              to={`/profile/${project.user?.username ?? 'unknown'}`}
              className="inline-flex items-center gap-3 group"
            >
              {project.user?.avatarUrl ? (
                <img src={project.user.avatarUrl} alt="" className="w-9 h-9 rounded-full border border-white/[0.08] object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#16200F] border border-white/[0.08] flex items-center justify-center text-[#B6F34A] font-mono text-[12px] font-bold">
                  {(project.user?.username ?? '?')[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-[13px] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors font-medium">
                  {project.user?.name ?? project.user?.username ?? 'unknown'}
                </p>
                <p className="text-[10px] text-[#555B55] font-mono">BUILDER</p>
              </div>
            </Link>
          </motion.section>

          {/* ========== STATS BAR ========== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4, ease }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.06] mb-10"
          >
            {githubRepo && (
              <>
                <div className="bg-[#0C0E0C] px-5 py-5">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-1.5">STARS</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#B6F34A]" />
                    <p className="text-[22px] font-bold text-[#F5F7F2] tracking-[-0.02em]">{formatNumber(githubRepo.stars)}</p>
                  </div>
                </div>
                <div className="bg-[#0C0E0C] px-5 py-5">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-1.5">FORKS</p>
                  <div className="flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-[#8A8F89]" />
                    <p className="text-[22px] font-bold text-[#F5F7F2] tracking-[-0.02em]">{formatNumber(githubRepo.forks)}</p>
                  </div>
                </div>
              </>
            )}
            <div className="bg-[#0C0E0C] px-5 py-5">
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-1.5">CONTRIBUTORS</p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8A8F89]" />
                <p className="text-[22px] font-bold text-[#F5F7F2] tracking-[-0.02em]">{contributors?.length ?? '—'}</p>
              </div>
            </div>
            <div className="bg-[#0C0E0C] px-5 py-5">
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-1.5">UPDATED</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8A8F89]" />
                <p className="text-[22px] font-bold text-[#F5F7F2] tracking-[-0.02em]">{formatTime(project.updatedAt)}</p>
              </div>
            </div>
          </motion.div>

          {/* ========== LANGUAGE BREAKDOWN ========== */}
          {languages && languages.length > 0 && totalLangBytes > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4, ease }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="w-3.5 h-3.5 text-[#B6F34A]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">LANGUAGES</span>
                <div className="flex-1 h-[1px] bg-white/[0.04]" />
              </div>

              {/* Bar */}
              <div className="h-2 rounded-full overflow-hidden flex bg-white/[0.04] mb-4">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                    style={{
                      width: `${(lang.bytes / totalLangBytes) * 100}%`,
                      backgroundColor: getLangColor(lang.name),
                      minWidth: '3px',
                    }}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {languages.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getLangColor(lang.name) }} />
                    <span className="text-[12px] text-[#8A8F89] font-mono">{lang.name}</span>
                    <span className="text-[11px] text-[#555B55] font-mono">{((lang.bytes / totalLangBytes) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ========== TECH STACK ========== */}
          {techs.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.4, ease }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <GitBranch className="w-3.5 h-3.5 text-[#B6F34A]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">TECH STACK</span>
                <div className="flex-1 h-[1px] bg-white/[0.04]" />
              </div>
              <div className="flex flex-wrap gap-2">
                {techs.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + i * 0.03, duration: 0.25, ease }}
                    className="text-[12px] font-mono text-[#8A8F89] bg-white/[0.03] border border-white/[0.06] px-3.5 py-1.5 rounded-lg hover:border-[#B6F34A]/25 hover:text-[#B6F34A] hover:bg-[#B6F34A]/[0.04] transition-all cursor-default"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.section>
          )}

          {/* ========== CONTRIBUTORS ========== */}
          {contributors && contributors.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4, ease }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-5">
                <Users className="w-3.5 h-3.5 text-[#B6F34A]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
                  CONTRIBUTORS ({contributors.length})
                </span>
                <div className="flex-1 h-[1px] bg-white/[0.04]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contributors.slice(0, 10).map((c, i) => (
                  <motion.a
                    key={c.login}
                    href={c.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.03, duration: 0.3, ease }}
                    className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:border-[#B6F34A]/20 hover:bg-white/[0.04] transition-all group"
                  >
                    <img
                      src={c.avatarUrl}
                      alt={c.login}
                      className="w-9 h-9 rounded-full border border-white/[0.08] object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors font-medium truncate">
                        {c.login}
                      </p>
                      <p className="text-[10px] text-[#555B55] font-mono">
                        {c.contributions} contribution{c.contributions !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-white/[0.04] px-2.5 py-1 rounded-full">
                      <Eye className="w-3 h-3 text-[#555B55]" />
                      <span className="text-[11px] font-mono text-[#8A8F89] font-medium">{c.contributions}</span>
                    </div>
                  </motion.a>
                ))}
              </div>

              {contributors.length > 10 && (
                <p className="text-center text-[11px] text-[#555B55] font-mono mt-4">
                  + {contributors.length - 10} more contributors
                </p>
              )}
            </motion.section>
          )}

          {/* ========== README ========== */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
                {readmeData?.content ? 'README' : 'OVERVIEW'}
              </span>
              <div className="flex-1 h-[1px] bg-white/[0.04]" />
            </div>

            {readmeLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-3/4 bg-white/[0.04] rounded" />
                <div className="h-4 w-full bg-white/[0.03] rounded" />
                <div className="h-4 w-5/6 bg-white/[0.03] rounded" />
                <div className="h-4 w-2/3 bg-white/[0.02] rounded" />
              </div>
            ) : readmeData?.content ? (
              <div className="border border-white/[0.06] bg-white/[0.01] rounded-2xl overflow-hidden">
                <div className="h-[2px] w-full bg-gradient-to-r from-[#B6F34A]/30 via-[#B6F34A]/10 to-transparent" />
                <div className="p-6 md:p-8">
                  <ReadmeContent content={readmeData.content} />
                </div>
              </div>
            ) : (
              /* Fallback overview */
              <div className="border border-white/[0.06] bg-white/[0.01] rounded-2xl overflow-hidden">
                <div className="h-[2px] w-full bg-gradient-to-r from-[#B6F34A]/30 via-[#B6F34A]/10 to-transparent" />
                <div className="p-6 md:p-10">
                  {/* Visual hero */}
                  <div className="w-full h-[200px] border border-white/[0.04] bg-white/[0.02] flex items-center justify-center mb-8 relative overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.04] to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                    </div>
                    <div className="relative flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center">
                        <Rocket className="w-7 h-7 text-[#B6F34A]" />
                      </div>
                      <div className="text-left">
                        <p className="text-[24px] font-black tracking-[-0.04em] text-[#F5F7F2]">{project.name}</p>
                        <p className="text-[12px] text-[#555B55] font-mono mt-1">{isBuilding ? 'In Development' : 'Shipped'} · {formatTime(project.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {project.description && (
                    <div className="mb-8">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-3">ABOUT</p>
                      <p className="text-[15px] text-[#8A8F89] leading-relaxed max-w-[540px]">
                        {project.description}
                      </p>
                    </div>
                  )}

                  {/* Quick facts */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    <div className="border border-white/[0.04] p-4 rounded-xl bg-white/[0.02]">
                      <p className="text-[9px] uppercase tracking-[0.15em] text-[#555B55] font-mono mb-1.5">STATUS</p>
                      <p className={`text-[13px] font-bold ${isBuilding ? 'text-[#B6F34A]' : 'text-[#8A8F89]'}`}>
                        {isBuilding ? 'Building' : 'Shipped'}
                      </p>
                    </div>
                    <div className="border border-white/[0.04] p-4 rounded-xl bg-white/[0.02]">
                      <p className="text-[9px] uppercase tracking-[0.15em] text-[#555B55] font-mono mb-1.5">TECH STACK</p>
                      <p className="text-[13px] font-bold text-[#F5F7F2]">{techs.length} technologies</p>
                    </div>
                    <div className="border border-white/[0.04] p-4 rounded-xl bg-white/[0.02]">
                      <p className="text-[9px] uppercase tracking-[0.15em] text-[#555B55] font-mono mb-1.5">LAST UPDATED</p>
                      <p className="text-[13px] font-bold text-[#F5F7F2]">{formatTime(project.updatedAt)}</p>
                    </div>
                  </div>

                  {/* Tech stack pills */}
                  {techs.length > 0 && (
                    <div className="mb-8">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-3">BUILT WITH</p>
                      <div className="flex flex-wrap gap-2">
                        {techs.map((t) => (
                          <span key={t} className="text-[11px] font-mono text-[#8A8F89] border border-white/[0.06] px-3 py-1.5 rounded-lg hover:border-[#B6F34A]/20 transition-colors">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Builder card */}
                  <div className="border border-white/[0.04] p-4 flex items-center justify-between rounded-xl bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      {project.user?.avatarUrl ? (
                        <img src={project.user.avatarUrl} alt="" className="w-9 h-9 rounded-full border border-white/[0.08] object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#16200F] border border-white/[0.08] flex items-center justify-center text-[#B6F34A] font-mono text-[12px] font-bold">
                          {(project.user?.username ?? '?')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-[13px] text-[#F5F7F2] font-medium">{project.user?.name ?? project.user?.username ?? 'unknown'}</p>
                        <p className="text-[10px] text-[#555B55] font-mono">BUILDER</p>
                      </div>
                    </div>
                    <Link to={`/profile/${project.user?.username ?? 'unknown'}`}
                      className="text-[10px] uppercase tracking-[0.12em] text-[#555B55] hover:text-[#B6F34A] transition-colors font-mono">
                      View Profile →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.section>

          {/* ========== FOOTER ========== */}
          <footer className="border-t border-white/[0.06] py-8 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link to="/" className="flex items-center">
                <Logo size="sm" animate={false} />
              </Link>
              <div className="flex items-center gap-6 text-[11px] text-[#303530] font-mono uppercase tracking-[0.12em]">
                <Link to="/discover" className="hover:text-[#8A8F89] transition-colors">Discover</Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarShell>
  )
}
