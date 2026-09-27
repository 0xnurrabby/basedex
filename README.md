<div align="center">

# ⚡ Base Dex

**The minimalist on-chain swap terminal built for Base.**

[![Website: basedex.lol](https://img.shields.io/badge/Website-basedex.lol-0052FF?style=for-the-badge&logo=googlechrome&logoColor=white)](https://basedex.lol)
[![Network: Base](https://img.shields.io/badge/Network-Base%20(8453)-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)](https://base.org)
[![Router: Aerodrome](https://img.shields.io/badge/Router-Aerodrome%20Finance-00F0FF?style=for-the-badge&logo=aerodrome&logoColor=black)](https://aerodrome.finance)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-27C93F?style=for-the-badge)](LICENSE)

</div>

---

### The Story

Most modern DEX interfaces feel like crowded trading floors: blinking banners, popups, lagging aggregator quotes, and cluttered navigation bars.

**Base Dex** strips all of that away.

It is designed like a native Unix terminal: focused, distraction-free, and lightning fast. When a new pool goes live on Base, you shouldn't have to wait minutes for third-party indexers or graph nodes to sync. Base Dex connects your wallet directly to Aerodrome's verified router on-chain, reads pair states from the factory in real-time, and routes your swap immediately.

No aggregator delay. No protocol surcharge. Just pure, direct Ethereum Layer 2 execution.

---

### Key Highlights

- **Direct Aerodrome Routing**: Interacts straight with Aerodrome's `PoolFactory` and `Router` contracts. New pairs and custom pools can be traded the second liquidity is deposited.
- **Custom Token Engine**: Paste any ERC-20 contract on Base. The terminal reads metadata and verifies pool liquidity on-chain within milliseconds.
- **Non-Custodial & Permissionless**: Zero intermediary contracts. Swaps settle peer-to-pool directly from your wallet with automated slippage protection.
- **Adaptive Light & Dark Themes**: Toggle between dark terminal mode and crisp light paper mode with persistent state.
- **Live Pricing via DefiLlama**: Real-time USD rates without noisy websocket feeds.
- **Minimalist Terminal Aesthetics**: Designed with a deep canvas palette, subtle monospace accents, and tactile feedback.

---

### Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, React 19) |
| **Web3 Core** | Wagmi v2, Viem v2, Ox |
| **Styling** | Tailwind CSS with dynamic theme variables |
| **Icons** | Lucide React |
| **State & Cache** | TanStack React Query v5 |

---

### Getting Started

#### 1. Clone the repository

```bash
git clone https://github.com/0xnurrabby/basedex.git
cd basedex
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### 4. Build for production

```bash
npm run build
npm start
```

---

### On-Chain Deployments (Base Mainnet)

| Contract | Address |
|---|---|
| **Aerodrome Router** | [`0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43`](https://basescan.org/address/0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43) |
| **Aerodrome Factory** | [`0x420DD381b31aEf6683db6B902084cB0FFECe40Da`](https://basescan.org/address/0x420DD381b31aEf6683db6B902084cB0FFECe40Da) |
| **WETH** | [`0x4200000000000000000000000000000000000006`](https://basescan.org/address/0x4200000000000000000000000000000000000006) |
| **USDC** | [`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`](https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) |

---

### License

Distributed under the [MIT](LICENSE) License.
