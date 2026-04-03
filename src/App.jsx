import { useState, useCallback, useRef } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import SimulationView from './components/SimulationView.jsx'
import Architecture from './components/Architecture.jsx'
import { getInitialAgents } from './simulation/agents.js'
import { buildSteps } from './simulation/steps.js'
import { sleep } from './simulation/engine.js'

export default function App() {
  const [agents,        setAgents]        = useState(getInitialAgents)
  const [events,        setEvents]        = useState([])
  const [currentStep,   setCurrentStep]   = useState(-1)
  const [isRunning,     setIsRunning]     = useState(false)
  const [isComplete,    setIsComplete]    = useState(false)
  const [activeAgentId, setActiveAgentId] = useState(null)
  const [devnetTx,      setDevnetTx]      = useState(null)
  const eidRef = useRef(0)

  const addEvent = useCallback((event) => {
    setEvents(prev => [...prev, { ...event, id: eidRef.current++ }])
  }, [])

  const agentsRef = useRef(getInitialAgents())
  const getAgents = useCallback(() => agentsRef.current, [])

  const setAgentsWithRef = useCallback((updater) => {
    setAgents(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      agentsRef.current = next
      return next
    })
  }, [])

  const updateAgentWithRef = useCallback((id, updates) => {
    setAgentsWithRef(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }, [setAgentsWithRef])

  const runSimulation = useCallback(async () => {
    const initial = getInitialAgents()
    agentsRef.current = initial
    setAgentsWithRef(initial)
    setEvents([])
    eidRef.current = 0
    setCurrentStep(-1)
    setIsComplete(false)
    setIsRunning(true)
    setActiveAgentId(null)
    setDevnetTx(null)

    await sleep(200)

    const steps = buildSteps({
      addEvent,
      updateAgent: updateAgentWithRef,
      setActiveAgentId,
      getAgents,
      setDevnetTx,
    })

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i)
      await sleep(300)
      steps[i].execute()
      await sleep(steps[i].duration)
    }

    setCurrentStep(-1)
    setActiveAgentId(null)
    setIsRunning(false)
    setIsComplete(true)
  }, [addEvent, updateAgentWithRef, setAgentsWithRef, getAgents])

  const totalSpent   = agents.reduce((s, a) => s + a.spent, 0)
  const totalBlocked = agents.reduce((s, a) => s + a.rejections, 0)
  const activeAgents = agents.filter(a =>
    a.status === 'active' || a.status === 'throttled' || a.status === 'funded'
  ).length
  const totalEvents = events.length

  const stats = { totalSpent, totalBlocked, activeAgents, totalEvents }

  return (
    <div className="min-h-screen bg-panel-deep font-sans text-ink-body">
      <Header isRunning={isRunning} isComplete={isComplete} onRun={runSimulation} />

      <main className="max-w-screen-xl mx-auto px-4 pb-20 pt-4">
        {!isRunning && !isComplete ? (
          <Hero onRun={runSimulation} />
        ) : (
          <SimulationView
            agents={agents}
            events={events}
            currentStep={currentStep}
            isRunning={isRunning}
            activeAgentId={activeAgentId}
            stats={stats}
            devnetTx={devnetTx}
          />
        )}
        <Architecture />
      </main>
    </div>
  )
}