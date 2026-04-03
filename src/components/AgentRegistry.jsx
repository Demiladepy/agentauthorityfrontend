import AgentCard from './AgentCard.jsx'

export default function AgentRegistry({ agents, activeAgentId }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-1"
        style={{ color: '#5A6070' }}
      >
        Agent Registry
      </div>
      {agents.map(agent => (
        <AgentCard
          key={agent.id}
          agent={agent}
          isActive={agent.id === activeAgentId}
        />
      ))}
    </div>
  )
}