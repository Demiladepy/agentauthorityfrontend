import StepProgress from './StepProgress.jsx'
import CurrentStep from './CurrentStep.jsx'
import StatsGrid from './StatsGrid.jsx'
import AgentRegistry from './AgentRegistry.jsx'
import EventLog from './EventLog.jsx'
import { STEP_META } from '../simulation/engine.js'

export default function SimulationView({
  agents,
  events,
  currentStep,
  isRunning,
  activeAgentId,
  stats,
}) {
  const isComplete = !isRunning && currentStep === -1 && events.length > 0

  return (
    <div className="flex flex-col gap-4 pt-2">
      {/* Progress bar */}
      <StepProgress currentStep={currentStep} isComplete={isComplete} />

      {/* Active step banner */}
      <CurrentStep currentStep={currentStep} isRunning={isRunning} />

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Main content: agents + log */}
      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        {/* Left: Agent registry (fixed width on large screens) */}
        <div className="w-full lg:w-80 shrink-0">
          <AgentRegistry agents={agents} activeAgentId={activeAgentId} />
        </div>

        {/* Right: Event log (fills remaining) */}
        <div className="flex-1 min-w-0">
          <EventLog events={events} />
        </div>
      </div>

      {/* Complete message */}
      {isComplete && (
        <div
          className="text-center py-4 rounded-lg font-mono text-[12px]"
          style={{ background: 'rgba(71,232,160,0.06)', border: '1px solid rgba(71,232,160,0.15)', color: '#47E8A0' }}
        >
          ✅ Simulation complete — {events.length} audit events recorded across {STEP_META.length} scenes
        </div>
      )}
    </div>
  )
}