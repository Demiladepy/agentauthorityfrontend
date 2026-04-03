import { USDC, fmtUSDC, fakePubkey } from './agents.js'
import { getTierName, reputationBudget } from './reputation.js'

/**
 * Build simulation steps.
 *
 * @param {object} ctx
 * @param {(event: object) => void}               ctx.addEvent
 * @param {(id: string, updates: object) => void} ctx.updateAgent
 * @param {(id: string | null) => void}           ctx.setActiveAgentId
 * @param {() => object[]}                        ctx.getAgents
 * @param {(url: string) => void}                 ctx.setDevnetTx   – stores live TX url
 */
export function buildSteps({ addEvent, updateAgent, setActiveAgentId, getAgents, setDevnetTx }) {
  let eid = 0
  const ev = (type, agentId, details, success = true) =>
    addEvent({ id: eid++, type, agentId, details, success, ts: Date.now() })

  return [
    // ─── Step 0: Initialize ────────────────────────────────────
    {
      duration: 1200,
      execute() {
        setActiveAgentId(null)
        ev('system', 'system', 'PolicyEngine initialized — authority registry online')
        ev('system', 'system', 'ReputationEngine initialized — 5 trust tiers loaded')
        ev('system', 'system', 'Behavioral Watchdog active — anomaly detection armed')
        ev('system', 'system', 'Dead Man\'s Switch online — heartbeat monitor running')
      },
    },

    // ─── Step 1: Create OWS Wallets ────────────────────────────
    {
      duration: 1500,
      execute() {
        setActiveAgentId(null)
        const agents = getAgents()
        for (const a of agents) {
          const pk = fakePubkey(44)
          updateAgent(a.id, { pubkey: pk, status: 'registered', tier: getTierName(a.trustScore) })
          ev('wallet', a.id, `OWSSigner → Ed25519 fallback — pubkey: ${pk.slice(0, 12)}...`)
        }
      },
    },

    // ─── Step 2: Fund via MoonPay ──────────────────────────────
    {
      duration: 1800,
      execute() {
        setActiveAgentId('orchestrator')
        const fee = USDC(500) * 15 / 1000
        const net = USDC(500) - fee
        updateAgent('orchestrator', { budget: net, status: 'funded' })
        ev('funding', 'orchestrator', 'MoonPay on-ramp initiated — $500.00 USD → USDC')
        ev('funding', 'orchestrator', `mp virtual-account onramp create — confirmed: ${fmtUSDC(net)} USDC (after $7.50 fee)`)
      },
    },

    // ─── Step 3: On-Chain Authority Proof ──────────────────────
    {
      duration: 2200,
      execute() {
        setActiveAgentId('orchestrator')

        // Simulate what the SDK does: generate a realistic devnet TX signature
        const fakeSig = Array.from({ length: 88 }, () =>
          '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[
            Math.floor(Math.random() * 58)
          ]
        ).join('')
        const fakeHash = Array.from({ length: 64 }, () =>
          '0123456789abcdef'[Math.floor(Math.random() * 16)]
        ).join('')
        const explorerUrl = `https://explorer.solana.com/tx/${fakeSig}?cluster=devnet`

        setDevnetTx(explorerUrl)

        ev('onchain', 'orchestrator', 'Requesting airdrop on devnet for fee payer keypair...')
        ev('onchain', 'orchestrator', `SPL Memo instruction built: spendos:v1:${fakeHash.slice(0, 32)}`)
        ev('onchain', 'orchestrator', `TX confirmed on Solana devnet — slot ~${(350_000_000 + Math.floor(Math.random() * 1_000_000)).toLocaleString()}`)
        ev('onchain', 'orchestrator', `On-chain proof: ${explorerUrl}`)
      },
    },

    // ─── Step 4: Reputation-Based Delegation ───────────────────
    {
      duration: 2000,
      execute() {
        setActiveAgentId('orchestrator')
        const caps = { researcher: 120, trader: 80, scraper: 30, rogue: 15 }
        const agents = getAgents()

        for (const a of agents) {
          if (a.id === 'orchestrator') continue
          const capDollars = caps[a.id] ?? 20
          const budgetDollars = reputationBudget(a.trustScore, capDollars)
          const budget = USDC(budgetDollars)
          const tier = getTierName(a.trustScore)
          updateAgent(a.id, { budget, status: 'active', tier })
          ev('delegation', a.id,
            `Delegated ${fmtUSDC(budget)} — score: ${a.trustScore} → tier: ${tier}`)
        }

        updateAgent('orchestrator', {
          delegated: USDC(120 + 80 + 30 + 15),
          status:    'active',
          tier:      getTierName(85),
        })
      },
    },

    // ─── Step 5: Researcher x402 Payments ──────────────────────
    {
      duration: 2500,
      execute() {
        setActiveAgentId('researcher')
        const payments = [
          { url: 'allium.xyz/v1/wallet-risk',      amt: USDC(0.50), label: 'Wallet risk profile' },
          { url: 'allium.xyz/v1/vesting-audit',     amt: USDC(1.00), label: 'Token vesting schedule' },
          { url: 'allium.xyz/v1/dex-flows/jupiter', amt: USDC(0.75), label: 'Jupiter DEX flow analysis' },
          { url: 'allium.xyz/v1/whale-watch/7d',    amt: USDC(2.00), label: 'Whale movement report (7d)' },
          { url: 'allium.xyz/v1/liquidation-risk',  amt: USDC(1.50), label: 'AAVE liquidation risk scan' },
        ]
        let totalSpent = 0
        let txCount = 0
        const agents = getAgents()
        const r = agents.find(a => a.id === 'researcher')

        for (const p of payments) {
          totalSpent += p.amt
          txCount++
          ev('x402', 'researcher', `x402 PAID ${fmtUSDC(p.amt)} — ${p.label}`)
        }

        updateAgent('researcher', {
          spent:        (r?.spent ?? 0) + totalSpent,
          transactions: (r?.transactions ?? 0) + txCount,
          trustScore:   Math.min(100, (r?.trustScore ?? 65) + 3),
          tier:         getTierName(Math.min(100, (r?.trustScore ?? 65) + 3)),
        })
      },
    },

    // ─── Step 6: Sub-delegation Researcher → Scraper ───────────
    {
      duration: 1500,
      execute() {
        setActiveAgentId('researcher')
        const agents = getAgents()
        const r = agents.find(a => a.id === 'researcher')
        const subBudget = USDC(10)

        updateAgent('researcher', { delegated: (r?.delegated ?? 0) + subBudget })
        ev('delegation', 'scraper',
          `Researcher → DataScraper: delegated ${fmtUSDC(subBudget)} (depth-2 chain)`)

        updateAgent('scraper', {
          spent:        USDC(0.25),
          transactions: 1,
          trustScore:   Math.min(100, (agents.find(a => a.id === 'scraper')?.trustScore ?? 52) + 1),
        })
        ev('x402', 'scraper', 'x402 PAID $0.25 — bulk-tx/batch-9 (depth-2 authority)')
      },
    },

    // ─── Step 7: Trader Jupiter Swaps ──────────────────────────
    {
      duration: 1800,
      execute() {
        setActiveAgentId('trader')
        const swaps = [
          { amt: USDC(15), label: 'USDC → SOL position entry' },
          { amt: USDC(20), label: 'USDC → JitoSOL yield strategy' },
          { amt: USDC(10), label: 'USDC → mSOL staking' },
        ]
        const agents = getAgents()
        const t = agents.find(a => a.id === 'trader')
        let totalSpent = 0

        for (const s of swaps) {
          totalSpent += s.amt
          ev('spend', 'trader', `Jupiter swap: ${fmtUSDC(s.amt)} — ${s.label}`)
        }

        updateAgent('trader', {
          spent:        (t?.spent ?? 0) + totalSpent,
          transactions: (t?.transactions ?? 0) + swaps.length,
          trustScore:   Math.min(100, (t?.trustScore ?? 35) + 2),
        })
      },
    },

    // ─── Step 8: Blocked — Overspend ───────────────────────────
    {
      duration: 1500,
      execute() {
        setActiveAgentId('trader')
        const agents = getAgents()
        const t = agents.find(a => a.id === 'trader')
        const remaining = (t?.budget ?? 0) - (t?.spent ?? 0)

        updateAgent('trader', {
          rejections: (t?.rejections ?? 0) + 1,
          trustScore: Math.max(0, (t?.trustScore ?? 35) - 5),
        })
        ev('blocked', 'trader',
          `REJECTED: $50.00 swap — exceeds remaining budget of ${fmtUSDC(remaining)}`, false)
      },
    },

    // ─── Step 9: Blocked — Unauthorized Program ────────────────
    {
      duration: 1200,
      execute() {
        setActiveAgentId('trader')
        const agents = getAgents()
        const t = agents.find(a => a.id === 'trader')

        updateAgent('trader', {
          rejections: (t?.rejections ?? 0) + 1,
          trustScore: Math.max(0, (t?.trustScore ?? 35) - 3),
        })
        ev('blocked', 'trader',
          'REJECTED: Allium endpoint not in allowlist — trader restricted to [Jupiter, TokenProgram]', false)
      },
    },

    // ─── Step 10: Watchdog Alert ────────────────────────────────
    {
      duration: 1500,
      execute() {
        setActiveAgentId('trader')
        const agents = getAgents()
        const t = agents.find(a => a.id === 'trader')

        ev('watchdog', 'trader',
          'ANOMALY: 2 rejections in 5s — velocity pattern matches boundary-probing behavior')
        ev('watchdog', 'trader',
          'AUTO-THROTTLE: rate limit reduced 20 → 3 tx/min. Trader status: Throttled')

        updateAgent('trader', {
          status:     'throttled',
          tier:       'Throttled',
          trustScore: Math.max(0, (t?.trustScore ?? 35) - 8),
        })
      },
    },

    // ─── Step 11: Dead Man's Switch ─────────────────────────────
    {
      duration: 2000,
      execute() {
        setActiveAgentId('rogue')
        const agents = getAgents()
        const rogue = agents.find(a => a.id === 'rogue')

        ev('heartbeat', 'rogue',
          'MISSED: RogueBot last heartbeat 120s ago — threshold 60s exceeded', false)
        ev('dms', 'rogue',
          'DEAD MAN\'S SWITCH TRIGGERED — authority auto-revoked. Budget swept → RECOVERY_WALLET...', false)

        updateAgent('rogue', {
          status:     'revoked',
          trustScore: Math.max(0, (rogue?.trustScore ?? 12) - 20),
          tier:       'Probationary',
        })
        ev('blocked', 'rogue',
          'REJECTED: post-revocation spend attempt blocked (authority status: revoked)', false)
      },
    },

    // ─── Step 12: Reputation Update ────────────────────────────
    {
      duration: 1500,
      execute() {
        setActiveAgentId(null)
        const agents = getAgents()

        for (const a of agents) {
          if (a.id === 'orchestrator') continue
          const oldTier = a.tier
          const newScore = a.trustScore
          const newTier = a.id === 'rogue' || a.id === 'trader'
            ? getTierName(newScore)
            : getTierName(Math.min(100, newScore + (a.id === 'researcher' ? 4 : 1)))

          if (a.id === 'researcher') {
            updateAgent('researcher', {
              trustScore: Math.min(100, a.trustScore + 4),
              tier:       newTier,
            })
          }

          const arrow = newTier !== oldTier ? `${oldTier} → ${newTier}` : `${newTier} (unchanged)`
          ev('reputation', a.id, `Trust updated: score ${newScore} — tier: ${arrow}`)
        }
      },
    },

    // ─── Step 13: Delegation Chain Verified ────────────────────
    {
      duration: 1200,
      execute() {
        setActiveAgentId('scraper')
        ev('verification', 'orchestrator',
          'depth-0: Orchestrator → Researcher — Ed25519 sig ✓ (4zSAcbH...)')
        ev('verification', 'researcher',
          'depth-1: Researcher → DataScraper — Ed25519 sig ✓ (Cp4Drw4...)')
        ev('verification', 'scraper',
          'depth-2 chain VALID — all signatures verified. Audit trail complete.')
      },
    },
  ]
}