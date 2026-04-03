import { fmtUSDC } from '../simulation/agents.js'
import { scoreColor } from '../simulation/reputation.js'

const STATUS_COLORS = {
  pending:    { bg: 'rgba(90,96,112,0.12)',  text: '#5A6070' },
  registered: { bg: 'rgba(71,160,232,0.12)', text: '#47A0E8' },
  funded:     { bg: 'rgba(71,160,232,0.12)', text: '#47A0E8' },
  active:     { bg: 'rgba(71,232,160,0.12)', text: '#47E8A0' },
  throttled:  { bg: 'rgba(232,163,71,0.12)', text: '#E8A347' },
  revoked:    { bg: 'rgba(232,71,71,0.12)',  text: '#E84747' },
}

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS.pending
  return (
    <span
      className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ background: colors.bg, color: colors.text }}
    >
      {status}
    </span>
  )
}

function ProgressBar({ spent, budget, color }) {
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
  const barColor = pct > 80 ? '#E84747' : pct > 50 ? '#E8A347' : color

  return (
    <div className="relative w-full rounded-full" style={{ height: 4, background: '#181C25' }}>
      <div
        className="absolute left-0 top-0 rounded-full transition-all duration-500"
        style={{ height: 4, width: `${pct}%`, background: barColor }}
      />
    </div>
  )
}

export default function AgentCard({ agent, isActive }) {
  const { name, role, emoji, color, status, trustScore, tier,
          budget, spent, transactions, rejections, pubkey } = agent

  const remaining = budget - spent
  const sc = STATUS_COLORS[status] ?? STATUS_COLORS.pending

  return (
    <div
      className="rounded-lg p-3 transition-all duration-200 relative overflow-hidden"
      style={{
        background:  '#12151C',
        border:      `1px solid ${isActive ? color : '#1E2330'}`,
        boxShadow:   isActive ? `0 0 16px ${color}20` : 'none',
      }}
    >
      {/* Top accent edge */}
      {isActive && (
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: 2, background: color, borderRadius: '8px 8px 0 0' }}
        />
      )}

      {/* Header row */}
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none">{emoji}</span>
          <div className="min-w-0">
            <span
              className="font-mono font-semibold text-[13px] leading-none"
              style={{ color: '#F0F2F5' }}
            >
              {name}
            </span>
            <div className="font-mono text-[10px] mt-0.5 truncate" style={{ color: '#5A6070' }}>
              {pubkey ? pubkey.slice(0, 16) + '…' : role}
            </div>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Budget progress */}
      <div className="mt-3">
        <ProgressBar spent={spent} budget={budget} color={color} />
        <div className="flex items-center justify-between mt-1">
          <span className="font-mono text-[10px]" style={{ color: '#5A6070' }}>
            {budget > 0 ? `${fmtUSDC(remaining)} remaining` : 'awaiting budget'}
          </span>
          {budget > 0 && (
            <span className="font-mono text-[10px]" style={{ color: '#3A3F4C' }}>
              {fmtUSDC(spent)} / {fmtUSDC(budget)}
            </span>
          )}
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #1E2330' }}>
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: '#3A3F4C' }}>Trust</span>
          <span className="font-mono text-[13px] font-semibold" style={{ color: scoreColor(trustScore) }}>
            {trustScore}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: '#3A3F4C' }}>Tier</span>
          <span className="font-mono text-[11px]" style={{ color: '#C8CCD4' }}>
            {tier || '—'}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: '#3A3F4C' }}>Txns</span>
          <span className="font-mono text-[13px]" style={{ color: '#C8CCD4' }}>
            {transactions}
            {rejections > 0 && (
              <span className="text-[11px] ml-1" style={{ color: '#E84747' }}>
                / {rejections}✗
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}