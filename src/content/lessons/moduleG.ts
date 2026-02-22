/**
 * Module G — Real Estate / Housing: Rent vs Buy, Down Payment, Mortgage, Investing Overview.
 */
import type { BlockLesson } from "../lessonTypes";

const CFPB = { name: "CFPB — Owning a Home", url: "https://www.consumerfinance.gov/owning-a-home/", type: "regulator" as const, lastReviewed: "2026-01-01" };
const SEC_REIT = { name: "SEC — REITs", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/real-estate-investment-trusts-reits", type: "government" as const, lastReviewed: "2026-01-01" };

const disclaimerCallout = {
  type: "callout" as const,
  tone: "warning" as const,
  text: "Educational content only. All examples are hypothetical. This is not financial or legal advice. Consult licensed professionals for your situation.",
};

function lesson(slug: string, title: string, subtitle: string, module: string, level: BlockLesson["level"], tags: BlockLesson["tags"], estimatedTime: number, blocks: BlockLesson["blocks"], sources: BlockLesson["sources"]): BlockLesson {
  return { id: slug, slug, title, subtitle, module, level, tags, estimatedTime, blocks, sources };
}

export const moduleGLessons: BlockLesson[] = [
  lesson(
    "rent-vs-buy-basics",
    "Rent vs. Buy Basics",
    "When renting or buying a home makes more sense.",
    "module-g",
    "beginner",
    ["home-buying", "real-estate", "visual-heavy", "level-1"],
    8,
    [
      { type: "hero", title: "Renting and buying each have trade-offs", subtitle: "The 'right' choice depends on your finances, timeline, and lifestyle." },
      { type: "bullet-list", heading: "Renting", items: ["No down payment or maintenance costs; landlord handles repairs.", "Flexibility to move; no long-term commitment.", "Rent can increase; you don't build equity."], icon: "dot" },
      { type: "bullet-list", heading: "Buying", items: ["You build equity as you pay down the mortgage; may get tax benefits.", "Stable payments (with a fixed-rate loan); potential appreciation.", "Down payment and closing costs; you're responsible for maintenance and repairs."], icon: "dot" },
      { type: "comparison", heading: "Rent vs. buy (simplified)", left: { label: "Rent", points: ["Lower upfront cost", "Flexible", "No equity"], verdict: "Good for short-term or uncertain plans" }, right: { label: "Buy", points: ["Build equity", "Predictable payment (fixed)", "Upfront and ongoing costs"], verdict: "Good if you'll stay 5+ years" }, note: "Not advice. Run your own numbers." },
      { type: "callout", tone: "tip", text: "A common rule of thumb is to consider buying if you plan to stay at least 5–7 years — but your situation may differ. Rent can be the smarter financial choice in expensive or unstable markets." },
      disclaimerCallout,
    ],
    [CFPB],
  ),
  lesson(
    "down-payment-planning",
    "Down Payment Planning",
    "How much to save for a down payment and where to keep it.",
    "module-g",
    "beginner",
    ["home-buying", "real-estate", "level-1"],
    6,
    [
      { type: "hero", title: "A down payment is the cash you pay upfront when you buy a home", subtitle: "The rest is usually financed with a mortgage." },
      { type: "bullet-list", heading: "Basics", items: ["Conventional loans often require 5–20% down; FHA and other programs may allow less.", "A larger down payment can mean a lower monthly payment and possibly no private mortgage insurance (PMI).", "Keep down-payment savings in a safe, accessible place (e.g. high-yield savings or CDs) until you're ready to buy."], icon: "check" },
      { type: "example", heading: "Example (hypothetical)", scenario: "Home price $300,000; 10% down.", breakdown: ["Down payment: $30,000", "Loan amount: $270,000", "You'd need to save $30,000 plus closing costs and an emergency fund."], outcome: "Start saving early; even small monthly amounts add up." },
      disclaimerCallout,
    ],
    [CFPB],
  ),
  lesson(
    "mortgage-basics",
    "Mortgage Basics",
    "How mortgages work: principal, interest, term, and types.",
    "module-g",
    "beginner",
    ["home-buying", "real-estate", "level-2"],
    9,
    [
      { type: "hero", title: "A mortgage is a loan to buy a home", subtitle: "You repay it over time with principal and interest." },
      { type: "bullet-list", heading: "Key terms", items: ["Principal: the amount you borrow.", "Interest: the cost of borrowing; expressed as an annual rate (APR).", "Term: how long you have to repay (e.g. 15 or 30 years). Shorter term = higher payment, less interest paid.", "Fixed-rate: interest rate stays the same. Adjustable-rate (ARM): rate can change after an initial period."], icon: "arrow" },
      { type: "comparison", heading: "Fixed vs. adjustable (simplified)", left: { label: "Fixed-rate", points: ["Predictable payment", "Rate never changes"], verdict: "Common choice for stability" }, right: { label: "ARM", points: ["Lower initial rate", "Rate can rise later"], verdict: "More risk" }, note: "Not advice." },
      { type: "callout", tone: "info", heading: "Shop around", text: "Compare offers from multiple lenders. Even a small difference in rate can save you thousands over the life of the loan." },
      disclaimerCallout,
    ],
    [CFPB],
  ),
  lesson(
    "real-estate-investing-overview",
    "Real Estate Investing Overview",
    "Ways to invest in real estate without buying a house.",
    "module-g",
    "beginner",
    ["real-estate", "investing-basics", "level-2"],
    7,
    [
      { type: "hero", title: "You don't have to own a property to invest in real estate", subtitle: "REITs and real estate funds offer exposure through the market." },
      { type: "bullet-list", heading: "Options", items: ["REITs (real estate investment trusts): companies that own and operate properties; many trade like stocks and pay dividends.", "Real estate mutual funds or ETFs: hold many REITs or real estate securities for diversification.", "Direct ownership: buy a rental property. Requires more capital and management."], icon: "dot" },
      { type: "callout", tone: "tip", text: "REITs can add diversification to a portfolio and provide income. They're subject to market risk like stocks. This is educational only." },
      disclaimerCallout,
    ],
    [SEC_REIT, CFPB],
  ),
];
