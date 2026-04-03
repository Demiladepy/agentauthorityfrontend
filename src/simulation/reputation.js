// Reputation tier logic — mirrors SpendOS SDK tiers

export const TIERS = [
  { name: 'Sovereign',    min: 81, max: 100, maxDay: 5000,  maxTx: 1000, depth: 4 },
  { name: 'Trusted',      min: 61, max: 80,  maxDay: 1000,  maxTx: 200,  depth: 3 },
  { name: 'Standard',     min: 41, max: 60,  maxDay: 200,   maxTx: 50,   depth: 2 },
  { name: 'Limited',      min: 21, max: 40,  maxDay: 50,    maxTx: 10,   depth: 1 },
  { name: 'Probationary', min: 0,  max: 20,  maxDay: 5,     maxTx: 1,    depth: 0 },
]

export function getTier(score) {
  return TIERS.find(t => score >= t.min && score <= t.max) ?? TIERS[TIERS.length - 1]
}

export function getTierName(score) {
  return getTier(score).name
}

/** Budget cap (USDC dollars) based on tier + what the orchestrator is willing to give */
export function reputationBudget(score, capDollars) {
  const tier = getTier(score)
  return Math.min(tier.maxDay, capDollars)
}

/** Color for a trust score */
export function scoreColor(score) {
  if (score >= 61) return '#47E8A0'
  if (score >= 41) return '#E8C547'
  return '#E84747'
}