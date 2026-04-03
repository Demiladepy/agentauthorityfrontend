import { STEP_META } from '../simulation/engine.js'

export default function StepProgress({ currentStep, isComplete }) {
  const total = STEP_META.length

  return (
    <div className="flex items-center gap-1 w-full" style={{ height: 6 }}>
      {Array.from({ length: total }, (_, i) => {
        const done    = isComplete || i < currentStep
        const active  = i === currentStep
        const pending = !done && !active

        let bg = '#1E2330'
        if (done)   bg = '#47E8A0'
        if (active) bg = '#E8C547'

        return (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-300"
            style={{
              height:    done || active ? 6 : 4,
              background: bg,
              boxShadow:  active ? '0 0 8px rgba(232,197,71,0.5)' : 'none',
              marginTop:  done || active ? 0 : 1,
            }}
          />
        )
      })}
    </div>
  )
}