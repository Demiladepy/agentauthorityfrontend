export default function Architecture() {
  return (
    <div className="mt-12">
      <div
        className="rounded-lg p-6 md:p-8"
        style={{ background: '#12151C', border: '1px solid #1E2330' }}
      >
        {/* Diagram */}
        <div className="font-mono text-[12px] leading-relaxed overflow-x-auto">
          <pre style={{ color: '#5A6070', margin: 0 }}>{`
┌──────────────┐                           ┌─────────────────────┐
│  OWS Wallet  │                           │    x402 / MPP       │
│  Ed25519 sig │                           │  Payment Required   │
└──────┬───────┘                           └──────────┬──────────┘
       │ signs authority tokens                       │ intercepts
       ▼                                              │
┌─────────────────────────────────────────────────────▼──────────┐
│                        SpendOS SDK                              │
│                                                                 │
│   AuthorityManager ◄──► PolicyEngine ◄──► ReputationEngine     │
│        │                    │                  │                │
│        │ Ed25519 sig         │ enforce          │ EMA scoring    │
│        ▼                    ▼                  ▼                │
│  SpendingAuthority    validate()          trust tiers           │
│  (delegation chain)   revoke()           0–100 score            │
│                       rate-limit()                              │
│                                                                 │
│   DeadMansSwitch ◄── heartbeat()     Watchdog ◄── events       │
│   auto-revoke         fund sweep      velocity / clustering     │
└─────────────────────────────────────────────────────────────────┘
       │                                              │
       ▼                                              ▼
┌──────────────┐                           ┌─────────────────────┐
│    Solana    │                           │   Base EVM          │
│   Mainnet    │                           │   eip155:8453       │
└──────────────┘                           └─────────────────────┘
`}</pre>
        </div>

        {/* Meta row */}
        <div className="mt-6 flex flex-wrap items-center gap-4 md:gap-8">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#3A3F4C' }}>Track</div>
            <div className="font-mono text-[12px]" style={{ color: '#E8C547' }}>02 — Agent Spend Governance</div>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#3A3F4C' }}>Stack</div>
            <div className="font-mono text-[12px]" style={{ color: '#C8CCD4' }}>TypeScript · Ed25519 · OWS · x402 · MoonPay</div>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#3A3F4C' }}>Chains</div>
            <div className="font-mono text-[12px]" style={{ color: '#C8CCD4' }}>Solana Mainnet + EVM (Base · Ethereum · Arbitrum)</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[12px]" style={{ color: '#3A3F4C' }}>
        <div className="font-mono">Built for MoonPay / Solana Agent Hackathon 2026</div>
        <div className="font-mono">Track 02: Agent Spend Governance &amp; Identity</div>
      </div>
    </div>
  )
}