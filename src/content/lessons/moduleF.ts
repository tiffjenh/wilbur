/**
 * Module F — Investing expansion: Stocks, ETFs, Bonds, CDs, Asset Allocation,
 * Brokerage, Dividends, Real Estate Basics, REITs vs Rental, Options Overview.
 */
import type { BlockLesson } from "../lessonTypes";

const SEC_SOURCE = { name: "SEC — Investor.gov", url: "https://www.investor.gov/introduction-investing", type: "government" as const, lastReviewed: "2026-01-01" };
const CFPB_SOURCE = { name: "CFPB — Owning a Home", url: "https://www.consumerfinance.gov/owning-a-home/", type: "regulator" as const, lastReviewed: "2026-01-01" };
const FDIC_SOURCE = { name: "FDIC — Certificates of Deposit", url: "https://www.fdic.gov/resources/deposit-insurance/financial-products/certificates-of-deposit/", type: "regulator" as const, lastReviewed: "2026-01-01" };

const disclaimerCallout = {
  type: "callout" as const,
  tone: "warning" as const,
  text: "Educational content only. All examples are hypothetical. This is not financial advice. Consult a licensed financial professional for advice specific to your situation.",
};

function lesson(slug: string, title: string, subtitle: string, module: string, level: BlockLesson["level"], tags: BlockLesson["tags"], estimatedTime: number, blocks: BlockLesson["blocks"], sources: BlockLesson["sources"]): BlockLesson {
  return { id: slug, slug, title, subtitle, module, level, tags, estimatedTime, blocks, sources };
}

export const moduleFLessons: BlockLesson[] = [
  lesson(
    "stocks-101",
    "Stocks 101",
    "What a share of stock is and how stock investing works.",
    "module-f",
    "beginner",
    ["stocks", "investing-basics", "visual-heavy", "level-2"],
    8,
    [
      { type: "hero", title: "A stock is a small piece of ownership in a company", subtitle: "When the company does well, the stock may go up; when it doesn't, it can go down." },
      { type: "bullet-list", heading: "Key ideas", items: ["One share = one unit of ownership. More shares = larger piece of the company.", "Stocks trade on exchanges; prices change with supply and demand.", "Stocks can pay dividends (a share of profits) or not.", "Individual stocks can be volatile. Diversification (many stocks) can reduce risk."], icon: "dot" },
      { type: "comparison", heading: "Individual stock vs. fund", left: { label: "Single stock", points: ["All your money in one company", "Can gain or lose a lot"], verdict: "Higher risk" }, right: { label: "Stock fund (e.g. index fund)", points: ["Hundreds of companies", "Smoother ride over time"], verdict: "Lower risk for most" }, note: "Educational example only." },
      { type: "callout", tone: "info", heading: "Why people buy stocks", text: "Over long periods, stocks have historically grown in value more than cash or bonds — but past performance does not guarantee future results. You can lose money." },
      disclaimerCallout,
    ],
    [SEC_SOURCE, { name: "SEC — What Are Stocks?", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks", type: "government", lastReviewed: "2026-01-01" }],
  ),
  lesson(
    "etfs-index-funds",
    "ETFs & Index Funds",
    "Low-cost baskets of stocks or bonds for diversification.",
    "module-f",
    "beginner",
    ["etfs", "investing-basics", "visual-heavy", "level-2"],
    8,
    [
      { type: "hero", title: "One fund can hold hundreds of stocks or bonds", subtitle: "Index funds and ETFs give you instant diversification at low cost." },
      { type: "bullet-list", heading: "What they are", items: ["Index fund: tracks a market index (e.g. S&P 500). Holds the same companies in the same proportions.", "ETF: exchange-traded fund. Same idea as an index fund but trades like a stock during the day.", "Both usually have low fees (expense ratios) compared to actively managed funds."], icon: "check" },
      { type: "comparison", heading: "Index fund vs. ETF", left: { label: "Index mutual fund", points: ["Buy/sell at end-of-day price", "Often minimum investment"], verdict: "Good in 401(k)s" }, right: { label: "ETF", points: ["Trade anytime during day", "No minimum (1 share)", "Often lower fees"], verdict: "Good in brokerage" }, note: "Not advice." },
      { type: "callout", tone: "tip", text: "Many experts recommend a low-cost total market or S&P 500 index fund or ETF for long-term growth. This is educational only." },
      disclaimerCallout,
    ],
    [SEC_SOURCE, { name: "SEC — Mutual Funds and ETFs", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds-etf", type: "government", lastReviewed: "2026-01-01" }],
  ),
  lesson(
    "bonds-101",
    "Bonds 101",
    "How bonds work and when they fit your plan.",
    "module-f",
    "beginner",
    ["bonds", "investing-basics", "level-2"],
    7,
    [
      { type: "hero", title: "A bond is a loan you make to a company or government", subtitle: "They pay you interest and return your principal at maturity." },
      { type: "bullet-list", heading: "Basics", items: ["You lend money; the issuer pays interest (coupon) and repays the principal at a set date.", "Government bonds (e.g. Treasury) are generally lower risk; corporate bonds can offer higher yield and more risk.", "Bond prices move opposite to interest rates: when rates rise, existing bond prices often fall."], icon: "dot" },
      { type: "example", heading: "Simple example", scenario: "You buy a $1,000 bond paying 4% for 10 years.", breakdown: ["You receive $40 per year in interest.", "At the end of 10 years you get your $1,000 back (if the issuer doesn't default)."], outcome: "Bonds add stability to a portfolio but usually grow less than stocks over long periods." },
      disclaimerCallout,
    ],
    [SEC_SOURCE, { name: "SEC — Bonds", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products", type: "government", lastReviewed: "2026-01-01" }],
  ),
  lesson(
    "cds-101",
    "CDs 101",
    "Certificate of deposit basics and when to use them.",
    "module-f",
    "beginner",
    ["cds", "money-basics", "level-1"],
    5,
    [
      { type: "hero", title: "A CD is a timed deposit that pays a fixed rate", subtitle: "You agree to leave your money for a set term; the bank pays you interest." },
      { type: "bullet-list", heading: "Key points", items: ["FDIC insured (up to limits), so very low risk.", "Fixed term (e.g. 6 months, 1 year, 5 years). Withdrawing early usually means a penalty.", "Rates are often higher than regular savings when you lock in a term."], icon: "check" },
      { type: "callout", tone: "tip", text: "CDs are good for money you know you won't need until a specific date — for example, a down payment in two years. Compare APYs and penalties before opening." },
      disclaimerCallout,
    ],
    [FDIC_SOURCE],
  ),
  lesson(
    "asset-allocation",
    "Asset Allocation (Educational Examples Only)",
    "How to think about splitting money between stocks, bonds, and cash.",
    "module-f",
    "beginner",
    ["asset-allocation", "investing-basics", "visual-heavy", "level-2"],
    8,
    [
      { type: "hero", title: "Asset allocation is how you divide your investments", subtitle: "Stocks, bonds, and cash each play a different role." },
      { type: "bullet-list", heading: "General concepts (not advice)", items: ["Stocks: higher growth potential, higher volatility. Often used for long-term goals (10+ years).", "Bonds: income and stability. Often used as you get closer to needing the money.", "Cash/savings: safety and liquidity. For emergencies and short-term needs."], icon: "arrow" },
      { type: "chart", chartType: "pie", title: "Example allocation (hypothetical)", subtitle: "For illustration only — not a recommendation.", data: [{ label: "Stocks", value: 60, color: "#0E5C4C" }, { label: "Bonds", value: 30, color: "#4A9B8A" }, { label: "Cash", value: 10, color: "#C4EAE5" }] },
      { type: "callout", tone: "warning", text: "These are educational examples only. Your situation is unique. Consider speaking with a financial professional before making allocation decisions." },
      disclaimerCallout,
    ],
    [SEC_SOURCE, { name: "SEC — Asset Allocation", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/asset-allocation", type: "government", lastReviewed: "2026-01-01" }],
  ),
  lesson(
    "brokerage-accounts",
    "Brokerage Accounts",
    "What a brokerage account is and how to choose one.",
    "module-f",
    "beginner",
    ["brokerage", "investing-basics", "level-2"],
    6,
    [
      { type: "hero", title: "A brokerage account lets you buy and sell investments", subtitle: "Stocks, bonds, ETFs, and mutual funds — all in one place." },
      { type: "bullet-list", heading: "What to look for", items: ["Low or no commission trading.", "Low-cost index funds or ETFs available.", "FDIC/SIPC: cash may be FDIC insured; securities protected by SIPC (limits apply).", "No account minimums if you're starting small."], icon: "check" },
      { type: "callout", tone: "info", text: "Many brokerages offer no-fee trading for stocks and ETFs. Compare fees, fund choices, and tools before opening an account." },
      disclaimerCallout,
    ],
    [SEC_SOURCE],
  ),
  lesson(
    "dividends",
    "Dividends",
    "What dividends are and how they fit into investing.",
    "module-f",
    "beginner",
    ["dividends", "stocks", "investing-basics", "level-2"],
    6,
    [
      { type: "hero", title: "Dividends are a share of profits some companies pay to shareholders", subtitle: "Not all stocks pay dividends; growth companies often reinvest instead." },
      { type: "bullet-list", heading: "Basics", items: ["Companies can pay dividends in cash (or sometimes stock) on a schedule (e.g. quarterly).", "Dividend yield = annual dividends ÷ share price. High yield isn't always better — the company might be in trouble.", "In taxable accounts, dividends can be taxed; in IRAs/401(k)s they grow tax-advantaged."], icon: "dot" },
      { type: "callout", tone: "tip", text: "Index funds that hold dividend-paying stocks will pass those dividends to you. You can reinvest them to buy more shares (compound growth)." },
      disclaimerCallout,
    ],
    [SEC_SOURCE],
  ),
  lesson(
    "real-estate-basics",
    "Real Estate Basics",
    "Introduction to real estate as an asset class.",
    "module-f",
    "beginner",
    ["real-estate", "investing-basics", "level-2"],
    7,
    [
      { type: "hero", title: "Real estate can mean owning property or investing in funds that do", subtitle: "It's a different kind of asset from stocks and bonds." },
      { type: "bullet-list", heading: "Ways to get exposure", items: ["Own a home: you build equity and may get tax benefits; you also bear upkeep and market risk.", "Rental property: you become a landlord; more work, potential income and appreciation.", "REITs (real estate investment trusts): invest in real estate through the stock market; no direct property management."], icon: "arrow" },
      { type: "comparison", heading: "Physical property vs. REIT", left: { label: "Rental property", points: ["Hands-on", "Illiquid", "Concentrated risk"], verdict: "More work" }, right: { label: "REIT", points: ["No management", "Liquid (trade like stock)", "Diversified"], verdict: "Easier" }, note: "Educational only." },
      disclaimerCallout,
    ],
    [CFPB_SOURCE, { name: "SEC — REITs", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/real-estate-investment-trusts-reits", type: "government", lastReviewed: "2026-01-01" }],
  ),
  lesson(
    "reits-vs-rental",
    "REITs vs. Rental Property",
    "Compare owning rental property to investing in REITs.",
    "module-f",
    "intermediate",
    ["real-estate", "investing-basics", "level-3", "visual-heavy"],
    8,
    [
      { type: "hero", title: "Two ways to invest in real estate: own property or own shares in REITs", subtitle: "Each has different trade-offs." },
      { type: "bullet-list", heading: "Rental property", items: ["You own the building; you collect rent and pay expenses.", "Requires down payment, maintenance, and dealing with tenants.", "Illiquid — selling takes time. Concentrated in one or a few properties."], icon: "dot" },
      { type: "bullet-list", heading: "REITs", items: ["REITs own and operate income-producing real estate; they pay out most income as dividends.", "You buy shares like stocks. No property management.", "Liquid and diversified across many properties. Subject to stock-market volatility."], icon: "dot" },
      { type: "comparison", heading: "Quick comparison", left: { label: "Rental", points: ["High capital needed", "Active", "Tax benefits (e.g. depreciation)"], verdict: "For hands-on investors" }, right: { label: "REIT", points: ["Low minimum", "Passive", "Dividend income"], verdict: "For diversification" }, note: "Not advice." },
      disclaimerCallout,
    ],
    [{ name: "SEC — REITs", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/real-estate-investment-trusts-reits", type: "government", lastReviewed: "2026-01-01" }],
  ),
  lesson(
    "options-overview",
    "Options Overview (Risk-First Framing)",
    "What options are and why they are high-risk. Educational only.",
    "module-f",
    "advanced",
    ["options", "advanced-investing", "level-5"],
    9,
    [
      { type: "hero", title: "Options are complex, high-risk derivatives", subtitle: "This lesson explains what they are — not how or whether to use them." },
      { type: "bullet-list", heading: "What are options?", items: ["A call option gives you the right (not obligation) to buy a stock at a set price by a set date.", "A put option gives you the right to sell at a set price by a set date.", "Options can expire worthless. Most retail option buyers lose money.", "Used by professionals for hedging or speculation; not necessary for most long-term investors."], icon: "dot" },
      { type: "callout", tone: "warning", heading: "Risk first", text: "Options involve leverage and time decay. You can lose your entire investment quickly. Many experts recommend that beginners avoid options and focus on low-cost index funds instead." },
      { type: "callout", tone: "info", text: "If you're curious about options, treat this as awareness only. Consider speaking with a licensed professional before trading." },
      disclaimerCallout,
    ],
    [{ name: "SEC — Options", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/options", type: "government", lastReviewed: "2026-01-01" }],
  ),
];
