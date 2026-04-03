import { useEffect, useRef } from 'react'
import { AGENT_DEFS } from '../simulation/agents.js'
import { EVENT_ICONS, EVENT_COLORS } from '../simulation/engine.js'

const AGENT_COLOR = Object.fromEntries(AGENT_DEFS.map(a => [a.id, a.color]))
const AGENT_NAME  = Object.fromEntries(AGENT_DEFS.map(a => [a.id, a.name]))

function EventRow({ event }) {
  const icon      = EVENT_ICONS[event.type]  ?? '·'
  const textColor = event.success === false ? '#E84747' : (EVENT_COLORS[event.type] ?? '#5A6070')
  const agentColor = AGENT_COLOR[event.agentId] ?? '#5A6070'
  const agentName  = AGENT_NAME[event.agentId]  ?? event.agentId

  return (
    <div className="flex items-start gap-2 py-1 event-item" style={{ borderBottom: '1px solid #181C25' }}>
      <span className="shrink-0 text-[13px] w-5 text-center leading-relaxed">{icon}</span>
      <span
        className="font-mono text-[10px] font-semibold shrink-0"
        style={{ color: agentColor, width: 86, minWidth: 86 }}
      >
        {agentName}
      </span>
      <span
        className="font-mono text-[11px] leading-relaxed break-words min-w-0"
        style={{ color: textColor }}
      >
        {event.details}
      </span>
    </div>
  )
}

export default function EventLog({ events }) {
  const scrollRef = useRef(null)

  // Auto-scroll to bottom on new events
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [events.length])

  return (
    <div className="flex flex-col gap-0 h-full">
      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-2"
        style={{ color: '#5A6070' }}
      >
        Live Audit Trail
        <span className="ml-2" style={{ color: '#3A3F4C' }}>({events.length} events)</span>
      </div>

      <div
        ref={scrollRef}
        className="overflow-y-auto flex-1 rounded-lg px-3 py-2"
        style={{
          background:  '#12151C',
          border:      '1px solid #1E2330',
          minHeight:   380,
          maxHeight:   480,
        }}
      >
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <span className="font-mono text-[11px]" style={{ color: '#3A3F4C' }}>
              — waiting for simulation —
            </span>
          </div>
        ) : (
          events.map(e => <EventRow key={e.id} event={e} />)
        )}
      </div>
    </div>
  )
}