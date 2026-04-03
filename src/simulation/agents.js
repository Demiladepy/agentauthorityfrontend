// Agent definitions and initial state factory

export const AGENT_DEFS = [
  { id: 'orchestrator', name: 'Orchestrator', role: 'Budget Controller',  color: '#E8C547', emoji: '👑' },
  { id: 'researcher',   name: 'Researcher',   role: 'Data Acquisition',   color: '#47E8A0', emoji: '🔬' },
  { id: 'trader',       name: 'Trader',       role: 'DeFi Execution',     color: '#47A0E8', emoji: '📈' },
  { id: 'scraper',      name: 'DataScraper',  role: 'Onchain Queries',    color: '#A047E8', emoji: '🕷️' },
  { id: 'rogue',        name: 'RogueBot',     role: 'Unresponsive Agent', color: '#E84747', emoji: '💀' },
]

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
export function fakePubkey(len = 44) {
  return Array.from({ length: len }, () => B58[Math.floor(Math.random() * B58.length)]).join('')
}

export function getInitialAgents() {
  return AGENT_DEFS.map(def => ({
    ...def,
    pubkey:       '',
    trustScore:   def.id === 'orchestrator' ? 85
                : def.id === 'researcher'   ? 65
                : def.id === 'trader'       ? 35
                : def.id === 'scraper'      ? 52
                :                             12,
    budget:       0,
    spent:        0,
    delegated:    0,
    status:       'pending',   // pending | registered | funded | active | revoked | throttled
    transactions: 0,
    rejections:   0,
    tier:         '',
    depth:        def.id === 'orchestrator' ? 0 : 1,
  }))
}

// USDC helpers (6 decimals)
export const USDC    = n => Math.round(n * 1_000_000)
export const fmtUSDC = lam => `$${(lam / 1_000_000).toFixed(2)}`