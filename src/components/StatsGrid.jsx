import { fmtUSDC } from '../simulation/agents.js'

function StatCard({ label, value, color }) {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-1"
      style={{ background: '#12151C', border: '1px solid #1E2330' }}
    >
      <span
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: '#5A6070' }}
      >
        {label}
      </span>
      <span
        className="font-mono text-2xl font-bold leading-none"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  )
}

export default function StatsGrid({ stats }) {
  const { totalSpent, totalBlocked, activeAgents, totalEvents } = stats

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard label="Total Spent"    value={fmtUSDC(totalSpent)}      color="#47E8A0" />
      <StatCard label="Blocked"        value={`${totalBlocked} tx`}     color="#E84747" />
      <StatCard label="Active Agents"  value={activeAgents.toString()}  color="#47A0E8" />
      <StatCard label="Audit Events"   value={totalEvents.toString()}   color="#A047E8" />
    </div>
  )
}