import { STEP_META } from '../simulation/engine.js'

export default function CurrentStep({ currentStep, isRunning }) {
  if (!isRunning || currentStep < 0 || currentStep >= STEP_META.length) return null

  const meta  = STEP_META[currentStep]
  const total = STEP_META.length

  return (
    <div
      className="flex items-start gap-3 rounded-lg px-4 py-3"
      style={{ background: '#12151C', border: '1px solid rgba(232,197,71,0.15)' }}
    >
      {/* Pulsing dot */}
      <span
        className="mt-0.5 shrink-0 rounded-full animate-blink"
        style={{ width: 8, height: 8, background: '#E8C547', display: 'inline-block' }}
      />

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="font-sans font-semibold text-sm"
            style={{ color: '#F0F2F5' }}
          >
            Step {currentStep + 1}/{total}: {meta.title}
          </span>
        </div>
        <p className="text-[11px] mt-0.5" style={{ color: '#5A6070' }}>
          {meta.desc}
        </p>
      </div>
    </div>
  )
}