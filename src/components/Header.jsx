import { GitBranch, Play, RotateCcw, Loader } from 'lucide-react'

export default function Header({ isRunning, isComplete, onRun }) {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: '#0A0C10', borderColor: '#1E2330' }}
    >
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* ── Left: Logo ── */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="font-sans font-extrabold text-2xl leading-none" style={{ color: '#F0F2F5' }}>
              Spend
            </span>
            <span className="font-sans font-extrabold text-2xl leading-none" style={{ color: '#E8C547' }}>
              OS
            </span>
          </div>
          <span
            className="font-mono text-[10px] px-2 py-0.5 rounded"
            style={{ background: 'rgba(232,197,71,0.12)', color: '#E8C547', letterSpacing: '0.06em' }}
          >
            v0.1.0
          </span>
          <span className="hidden md:block text-[13px]" style={{ color: '#5A6070' }}>
            Agent spend governance for the autonomous economy
          </span>
        </div>

        {/* ── Right: Stack badges + CTA ── */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            {['OWS ✓', 'x402 ✓', 'MoonPay ✓'].map(b => (
              <span
                key={b}
                className="font-mono text-[10px] px-2 py-0.5 rounded"
                style={{ background: '#181C25', color: '#5A6070', letterSpacing: '0.06em' }}
              >
                {b}
              </span>
            ))}
          </div>

          <button
            onClick={onRun}
            disabled={isRunning}
            className="btn-gold flex items-center gap-1.5 px-4 py-2 rounded text-sm"
          >
            {isRunning ? (
              <>
                <Loader size={13} className="animate-spin" />
                <span>Running…</span>
              </>
            ) : isComplete ? (
              <>
                <RotateCcw size={13} />
                <span>Run Again</span>
              </>
            ) : (
              <>
                <Play size={13} fill="currentColor" />
                <span>Run Live Demo</span>
              </>
            )}
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded transition-colors"
            style={{ color: '#5A6070' }}
            onMouseEnter={e => e.currentTarget.style.color = '#C8CCD4'}
            onMouseLeave={e => e.currentTarget.style.color = '#5A6070'}
          >
            <GitBranch size={16} />
          </a>
        </div>
      </div>
    </header>
  )
}