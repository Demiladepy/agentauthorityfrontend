// Simulation engine — event types, icons, colors, sleep helper

export const sleep = ms => new Promise(r => setTimeout(r, ms))

export const EVENT_ICONS = {
  system:       '⚡',
  wallet:       '🔑',
  funding:      '💰',
  onchain:      '⛓',
  delegation:   '🔗',
  x402:         '💳',
  spend:        '↗',
  blocked:      '🚫',
  watchdog:     '🔍',
  heartbeat:    '💓',
  dms:          '☠️',
  reputation:   '⭐',
  verification: '✅',
}

export const EVENT_COLORS = {
  system:       '#5A6070',
  wallet:       '#47A0E8',
  funding:      '#47A0E8',
  onchain:      '#E8C547',
  delegation:   '#A047E8',
  x402:         '#47E8A0',
  spend:        '#47E8A0',
  blocked:      '#E84747',
  watchdog:     '#E8A347',
  heartbeat:    '#3A3F4C',
  dms:          '#E84747',
  reputation:   '#E8C547',
  verification: '#47E8A0',
}

// Step metadata used for display
export const STEP_META = [
  { title: 'Initialize SpendOS',             desc: 'PolicyEngine, ReputationEngine, Watchdog, and DeadMansSwitch come online.' },
  { title: 'Create OWS Wallets',             desc: 'OWSSigner creates wallets for 5 agents — falls back to Ed25519 gracefully.' },
  { title: 'Fund via MoonPay',               desc: 'Orchestrator wallet receives $500 USDC via MoonPay fiat on-ramp skill.' },
  { title: 'On-Chain Authority Proof',       desc: 'Authority fingerprint written to Solana devnet via SPL Memo. Real TX, live chain.' },
  { title: 'Reputation-Based Delegation',    desc: 'Each agent receives a budget proportional to their trust tier.' },
  { title: 'Researcher x402 Payments',       desc: 'Researcher pays 5 Allium data endpoints via x402 micropayment protocol.' },
  { title: 'Sub-Delegation: Researcher → Scraper', desc: 'Researcher delegates $10 to DataScraper. Depth-2 chain established.' },
  { title: 'Trader Jupiter Swaps',           desc: 'Trader executes 3 Jupiter DEX swaps within their delegated budget.' },
  { title: 'BLOCKED — Overspend',            desc: 'Trader attempts a $50 swap exceeding remaining budget. Policy engine rejects.' },
  { title: 'BLOCKED — Unauthorized Program', desc: 'Trader tries an Allium endpoint not in their allowlist. Rejected.' },
  { title: 'Watchdog Alert',                 desc: '2 rejections in 5s triggers anomaly detection. Rate limit auto-throttled.' },
  { title: 'Dead Man\'s Switch',             desc: 'RogueBot stopped sending heartbeats. Auto-revocation fires. Budget swept.' },
  { title: 'Reputation Update',              desc: 'Trust scores recalculated. Researcher upgrades tier; RogueBot demoted.' },
  { title: 'Delegation Chain Verified',      desc: 'Ed25519 signatures verified depth-2: Orchestrator → Researcher → DataScraper.' },
]