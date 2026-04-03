import { Play, Shield, GitBranch, Zap, Eye, Heart } from 'lucide-react'

const PILLS = [
  { icon: Shield,    label: 'PolicyEngine' },
  { icon: Zap,       label: 'ReputationEngine' },
  { icon: Eye,       label: 'Watchdog' },
  { icon: Heart,     label: 'DeadMansSwitch' },
  { icon: GitBranch, label: 'x402Handler' },
]

export default function Hero({ onRun }) {
  return (
    <section className="py-16 md:py-24 flex flex-col items-center text-center gap-8">

      {/* Track badge */}
      <div
        className="font-mono text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest"
        style={{ background: 'rgba(232,197,71,0.08)', color: '#E8C547', border: '1px solid rgba(232,197,71,0.2)' }}
      >
        Track 02 — Agent Spend Governance &amp; Identity
      </div>

      {/* Heading */}
      <h1 className="font-sans font-extrabold text-4xl md:text-6xl leading-tight max-w-3xl" style={{ color: '#F0F2F5' }}>
        The missing{' '}
        <span style={{ color: '#E8C547' }}>trust layer</span>
        <br />for agent economies
      </h1>

      {/* Subtitle */}
      <p className="text-base md:text-lg max-w-xl leading-relaxed" style={{ color: '#5A6070' }}>
        Hierarchical spending policies. Cryptographic delegation chains.
        Dynamic reputation scoring. Behavioral anomaly detection.
        Dead man's switches. Full audit trails.
      </p>

      {/* CTA */}
      <button
        onClick={onRun}
        className="btn-gold flex items-center gap-2 px-6 py-3 rounded text-base"
      >
        <Play size={15} fill="currentColor" />
        Run Live Demo
      </button>

      {/* Component pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
        {PILLS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 font-mono text-[11px] px-3 py-1.5 rounded"
            style={{ background: '#12151C', border: '1px solid #1E2330', color: '#5A6070' }}
          >
            <Icon size={11} />
            {label}
          </div>
        ))}
      </div>

      {/* Tagline */}
      <p className="font-mono text-[13px] italic mt-4" style={{ color: '#3A3F4C' }}>
        "Give agents wallets, not blank checks."
      </p>
    </section>
  )
}