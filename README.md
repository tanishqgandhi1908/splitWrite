# SplitWrite

A custom, per-item bill splitter — like Splitwise, but you control exactly who shares each item. Built with Next.js, TypeScript, and Tailwind CSS. All data is saved locally in your browser (localStorage); there is no backend.

**🔗 Live demo: [split-write.vercel.app](https://split-write.vercel.app/)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftanishqgandhi1908%2FsplitWrite)

## Features

- **Bills, items, quantities & prices** — create a bill and add line items with quantity and unit price.
- **Participants** — add the people sharing a bill.
- **Per-item selection** — each participant toggles the items they actually shared.
- **Dynamic split** — an item's line total (price × quantity) is divided equally among only the people who selected it, updating live as selections change.
- **Tax & discount (proportional)** — distributed across participants in proportion to each person's item subtotal, so people who ordered more carry more tax and more discount.
- **Penny-perfect math** — all arithmetic runs in integer cents with largest-remainder allocation, so per-person totals always reconcile exactly with the grand total.
- **Split starts on selection** — tax/discount are held back until items are assigned, so a discount never pushes anyone negative before the split begins.
- **Local persistence** — bills are saved in `localStorage` and survive reloads.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deployment

Deployed on [Vercel](https://vercel.com/) at [split-write.vercel.app](https://split-write.vercel.app/). Since there's no backend, any static/Node host that supports Next.js works.

Deploy your own copy in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftanishqgandhi1908%2FsplitWrite)

## How the split works

1. Each item's line total is split equally among the participants who selected it.
2. Each participant's item subtotal is the sum of their item shares.
3. Tax and discount are distributed proportionally to those subtotals.
4. A participant's total = item subtotal + tax share − discount share.

## Tech

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS

---

Made with ❤️ by Tanishq
