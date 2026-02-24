/**
 * Modular lesson content: hero + blocks.
 * Favor bullets and blocks over long paragraphs.
 */

/* ── Hero (optional) ────────────────────────────────────── */

export type LessonHero = {
  title: string;
  subtitle?: string;
};

/* ── Block union: bullets | callout | comparisonTable | steps | scenario | keyTakeaways | chartPlaceholder ── */

export type BulletsBlock = {
  type: "bullets";
  heading?: string;
  items: string[];
  icon?: "check" | "arrow" | "dot";
};

export type CalloutBlock = {
  type: "callout";
  tone: "info" | "warning" | "tip" | "source";
  heading?: string;
  text: string;
};

export type ComparisonTableBlock = {
  type: "comparisonTable";
  heading?: string;
  left: { label: string; points: string[]; verdict?: string };
  right: { label: string; points: string[]; verdict?: string };
  note?: string;
};

export type StepsBlock = {
  type: "steps";
  heading?: string;
  steps: string[];
};

export type ScenarioBlock = {
  type: "scenario";
  heading?: string;
  scenario: string;
  breakdown: string[];
  outcome?: string;
};

export type KeyTakeawaysBlock = {
  type: "keyTakeaways";
  heading?: string;
  items: string[];
};

export type ChartPlaceholderBlock = {
  type: "chartPlaceholder";
  title?: string;
  subtitle?: string;
};

export type LessonBlock =
  | BulletsBlock
  | CalloutBlock
  | ComparisonTableBlock
  | StepsBlock
  | ScenarioBlock
  | KeyTakeawaysBlock
  | ChartPlaceholderBlock;

export type LessonContent = {
  hero?: LessonHero;
  blocks: LessonBlock[];
};

/** Registry: lessonId → LessonContent. Add entries as content is written. */
const CONTENT_BY_LESSON_ID: Record<string, LessonContent> = {
  "money-map": {
    hero: { title: "Your Money Map", subtitle: "Before you budget, you need to know where money actually goes" },
    blocks: [
      { type: "bullets", heading: "Every dollar you earn goes one of 3 places", items: ["Fixed bills — rent, subscriptions, loan minimums (same every month)", "Variable spending — groceries, gas, dining, shopping (changes month to month)", "Saved or invested — emergency fund, retirement, goals"], icon: "arrow" },
      { type: "callout", tone: "tip", heading: "Quick exercise", text: "Open your last 2 bank statements. Spend 5 minutes categorizing each transaction into: Bills, Spending, or Savings. You'll immediately see where the leaks are." },
      { type: "scenario", heading: "Example: $3,500/month take-home", scenario: "Jordan earns $42K/year ($3,500/month after taxes). Current breakdown:", breakdown: ["Rent + utilities: $1,400 (40%)", "Groceries + dining: $600 (17%)", "Car payment + gas: $450 (13%)", "Subscriptions + misc: $300 (9%)", "Savings: $200 (6%)", "Leftover (untracked): $550 (15%)"], outcome: "The 15% 'untracked' is money Jordan can redirect to goals — about $550/month." },
      { type: "keyTakeaways", heading: "Key takeaways", items: ["Track where money goes before setting a budget.", "Most people have more flexibility than they think."] },
    ],
  },

  // ─── Investing: stocks, ETFs, index funds, bonds, diversification ───
  "investing-101": {
    hero: { title: "Investing 101", subtitle: "Stocks, bonds, and funds — the building blocks" },
    blocks: [
      { type: "callout", tone: "info", text: "Investing is using money to buy assets (like stocks or bonds) that can grow in value or pay you income over time. It’s different from saving in a bank: higher potential growth, higher risk." },
      { type: "bullets", heading: "Why it matters", items: ["Beats inflation over the long run (cash in a savings account often doesn’t).", "Compound growth can multiply your money over decades.", "Employer retirement accounts (401k, etc.) invest for you — understanding helps you choose."], icon: "arrow" },
      { type: "comparisonTable", heading: "Stocks vs. bonds (simplified)", left: { label: "Stocks", points: ["Ownership in a company", "Higher risk, higher return potential", "Prices can swing a lot"], verdict: "Growth" }, right: { label: "Bonds", points: ["You lend money; get interest back", "Generally lower risk than stocks", "More stable, lower return potential"], verdict: "Stability" }, note: "Funds (ETFs, index funds) hold many stocks and/or bonds so you don’t pick single companies." },
      { type: "scenario", heading: "Hypothetical example", scenario: "Alex puts $200/month into a diversified fund for 30 years. All numbers are hypothetical.", breakdown: ["Assume ~6% average annual return (no guarantee).", "After 10 years: about $33K.", "After 30 years: about $200K."], outcome: "Time in the market and consistency matter more than timing. This is not a prediction or advice." },
      { type: "keyTakeaways", items: ["Investing = buying assets for growth or income.", "Stocks = ownership; bonds = lending; funds = bundles of both.", "Long-term, diversified investing can help offset inflation."] },
    ],
  },
  "stocks-101": {
    hero: { title: "Stocks 101", subtitle: "What a share is and how it works" },
    blocks: [
      { type: "callout", tone: "info", text: "A stock (or share) is a small piece of ownership in a company. If the company does well, the share price may go up; if it does poorly, it may go down. You can also get dividends (a share of profits) from some stocks." },
      { type: "bullets", heading: "Why it matters", items: ["Stocks have historically offered strong long-term growth.", "You don’t need to pick individual companies — index funds hold hundreds of stocks.", "Understanding shares helps you read news and statements (e.g. 401k)."], icon: "arrow" },
      { type: "scenario", heading: "Hypothetical example", scenario: "Sam buys 10 shares of a fictional company at $50 each ($500 total). One year later:", breakdown: ["Share price goes to $55 → Sam’s 10 shares are worth $550 (hypothetical gain).", "If the company pays a $2/share dividend → Sam also gets $20 in income (hypothetical)."], outcome: "Real results vary. Past performance doesn’t guarantee future results. This is education only." },
      { type: "keyTakeaways", items: ["One share = one piece of ownership in a company.", "Price can go up or down; dividends (if any) are a share of profits.", "Index funds let you own many stocks at once instead of picking single companies."] },
    ],
  },
  "etfs-and-index-funds": {
    hero: { title: "ETFs and Index Funds", subtitle: "Diversification without picking individual stocks" },
    blocks: [
      { type: "callout", tone: "info", text: "An index fund or ETF holds many stocks (or bonds) in one package. You buy the package, so you get diversification — if one company drops, others may offset it. Index funds track a market index (e.g. S&P 500); ETFs trade like stocks during the day." },
      { type: "bullets", heading: "Why it matters", items: ["One purchase can give you exposure to hundreds of companies.", "Lower cost than many actively managed funds.", "Common in 401ks and IRAs — you’ll see them in your account options."], icon: "arrow" },
      { type: "comparisonTable", heading: "ETF vs. mutual fund (index version)", left: { label: "ETF", points: ["Trades on an exchange during market hours", "Often lower minimums", "Tax efficiency can be better in taxable accounts"], verdict: "Flexible" }, right: { label: "Index mutual fund", points: ["Bought/sold once per day at closing price", "Some have minimums (e.g. $1,000)", "Same diversification idea"], verdict: "Simple" }, note: "Both can track the same index. Choice often comes down to account type and minimums." },
      { type: "scenario", heading: "Hypothetical example", scenario: "Jordan invests $300/month in a broad US stock index fund. All numbers are hypothetical.", breakdown: ["Fund holds 500+ companies — no single company dominates.", "Over 20 years, assume average return ~6% (not guaranteed).", "Result: a diversified balance without picking stocks."], outcome: "This is for illustration only. Real returns vary; this is not advice." },
      { type: "keyTakeaways", items: ["Index funds and ETFs = many stocks (or bonds) in one product.", "ETFs trade like stocks; index mutual funds trade once per day.", "Diversification and low cost make them core building blocks for many investors."] },
    ],
  },
  "bonds-101": {
    hero: { title: "Bonds 101", subtitle: "How bonds work and when they fit" },
    blocks: [
      { type: "callout", tone: "info", text: "A bond is a loan you make to a company or government. They promise to pay you back on a set date and usually pay interest along the way. Bond prices can go up or down, but they’re often less volatile than stocks." },
      { type: "bullets", heading: "Why it matters", items: ["Add stability to a portfolio — when stocks fall, bonds often don’t fall as much.", "Provide income (interest payments).", "Target-date and balanced funds mix stocks and bonds for you."], icon: "arrow" },
      { type: "comparisonTable", heading: "Stocks vs. bonds (role in a portfolio)", left: { label: "Stocks", points: ["Higher growth potential", "Higher volatility", "Long-term focus"], verdict: "Growth" }, right: { label: "Bonds", points: ["Income and cushion", "Usually less volatile", "Preservation + yield"], verdict: "Stability" }, note: "Many people hold both via funds; ratio depends on age and goals (education only)." },
      { type: "scenario", heading: "Hypothetical example", scenario: "A fictional $10,000 bond pays 4% per year and matures in 10 years.", breakdown: ["You receive $400 per year in interest (hypothetical).", "At maturity you get the $10,000 back (if the issuer doesn’t default).", "If you sell early, the price could be higher or lower than $10,000."], outcome: "Rates and prices change. This is not a recommendation." },
      { type: "keyTakeaways", items: ["Bonds = you lend money; you get interest and principal back.", "They can add stability and income to a portfolio.", "Bond funds let you own many bonds without buying them one by one."] },
    ],
  },
  "risk-and-time-horizon": {
    hero: { title: "Risk, Time, and Your Timeline", subtitle: "Why your investing horizon matters" },
    blocks: [
      { type: "callout", tone: "info", text: "Risk in investing means your balance can go down, sometimes for years. Time horizon is how long you plan to keep the money invested. Longer horizons usually allow more stock exposure; shorter horizons often call for more bonds or cash." },
      { type: "bullets", heading: "Why it matters", items: ["Stocks can drop 20–40% in a bad year — you need time to ride that out.", "Money you need in 1–2 years (e.g. emergency fund) usually doesn’t belong in stocks.", "Retirement decades away → more time to recover from downturns (hypothetically)."], icon: "arrow" },
      { type: "scenario", heading: "Hypothetical example", scenario: "Two people each invest $10,000. The market drops 30% in year one.", breakdown: ["Person A needs the money in 2 years — selling would lock in a large loss.", "Person B doesn’t need it for 20 years — they can wait for a potential recovery (not guaranteed)."], outcome: "Matching investments to when you need the money is a core idea. This is not advice." },
      { type: "keyTakeaways", items: ["More time usually means you can take more stock risk (and volatility).", "Short-term money is better in safer options (savings, bonds, etc.).", "Diversification and time horizon are two key levers — not timing the market."] },
    ],
  },
  "asset-allocation": {
    hero: { title: "Asset Allocation", subtitle: "Stocks, bonds, and cash in balance" },
    blocks: [
      { type: "callout", tone: "info", text: "Asset allocation is how you split your investments among stocks, bonds, and cash. There’s no single right answer — it depends on your goals, time horizon, and comfort with risk. Diversification across and within these categories can smooth out bumps." },
      { type: "bullets", heading: "Why it matters", items: ["Stocks and bonds often move in different directions — mixing can reduce big swings.", "Target-date funds do this for you (e.g. 2050 fund).", "Rebalancing (occasionally bringing the mix back to plan) is a common practice."], icon: "arrow" },
      { type: "comparisonTable", heading: "More stocks vs. more bonds (simplified)", left: { label: "More stocks", points: ["Higher growth potential", "Bigger short-term swings", "Suited to long time horizons"], verdict: "Growth" }, right: { label: "More bonds", points: ["More stability, less volatility", "Lower expected return over time", "Suited to shorter horizons"], verdict: "Stability" }, note: "Many investors use a mix. This is education only; not a recommendation." },
      { type: "scenario", heading: "Hypothetical example", scenario: "A fictional 60% stock / 40% bond portfolio over one bad year for stocks:", breakdown: ["Stocks down 20%; bonds up 2% (hypothetical).", "Overall portfolio might be down about 11% instead of 20%.", "Illustrates how bonds can cushion a stock drop — no guarantee."], outcome: "Past patterns don’t guarantee future results. This is not financial advice." },
      { type: "keyTakeaways", items: ["Asset allocation = how much you put in stocks vs. bonds vs. cash.", "Diversification can reduce volatility; it doesn’t remove risk.", "Target-date and balanced funds offer pre-built allocations."] },
    ],
  },

  // ─── Real estate: rent vs buy, down payment/PMI, mortgage ───
  "rent-vs-buy-basics": {
    hero: { title: "Rent vs. Buy", subtitle: "When each makes sense" },
    blocks: [
      { type: "callout", tone: "info", text: "Renting gives flexibility and no responsibility for repairs or property value. Buying builds equity and can lock in housing cost, but you take on debt, maintenance, and market risk. The 'right' choice depends on your situation and location — not just math." },
      { type: "bullets", heading: "Why it matters", items: ["Housing is most people’s biggest expense — the decision affects your budget for years.", "Buying ties up a down payment and comes with closing costs and ongoing costs.", "Renting avoids those but you don’t build equity; rent can increase."], icon: "arrow" },
      { type: "comparisonTable", heading: "Rent vs. buy (high level)", left: { label: "Rent", points: ["No down payment or mortgage", "Landlord handles repairs", "Easier to move"], verdict: "Flexibility" }, right: { label: "Buy", points: ["Build equity over time", "Fixed payment (if fixed-rate mortgage)", "You pay repairs, taxes, insurance"], verdict: "Ownership" }, note: "Run your own numbers; rent vs. buy calculators can help. This is not advice." },
      { type: "scenario", heading: "Hypothetical example", scenario: "Taylor is deciding whether to rent or buy in a fictional city. Numbers are illustrative.", breakdown: ["Rent: $1,800/month, no maintenance, can leave in 12 months.", "Buy: $350K home, 10% down, ~$2,200/month P&I + taxes/insurance/maintenance.", "Taylor plans to stay 5+ years and has emergency savings — buying might be on the table (hypothetically)."], outcome: "Real decisions depend on income, savings, rates, and local market. This is education only." },
      { type: "keyTakeaways", items: ["Renting = flexibility; buying = equity and fixed payment (with more responsibility).", "Consider how long you’ll stay, cash flow, and total cost of ownership.", "There’s no single right answer — it’s personal and location-specific."] },
    ],
  },
  "down-payment-and-pmi": {
    hero: { title: "Down Payment and PMI", subtitle: "How much to put down and what PMI is" },
    blocks: [
      { type: "callout", tone: "info", text: "The down payment is the cash you pay upfront when you buy a home; the rest is the mortgage. If you put down less than 20%, lenders often require PMI (private mortgage insurance) — an extra cost that protects them if you default. PMI usually stops once you have 20% equity." },
      { type: "bullets", heading: "Why it matters", items: ["Larger down payment = smaller loan and often lower monthly payment.", "PMI can add $50–$200+ per month until you reach 20% equity.", "You don’t always need 20% down — FHA and other programs allow less (with PMI or insurance)."], icon: "arrow" },
      { type: "comparisonTable", heading: "20% down vs. less than 20%", left: { label: "20% down", points: ["No PMI", "Smaller loan, lower payment", "More cash required upfront"], verdict: "No PMI" }, right: { label: "Less than 20%", points: ["PMI until ~20% equity", "Smaller upfront cash", "Higher monthly cost until PMI drops"], verdict: "PMI applies" }, note: "Rates and rules vary by lender and loan type. This is not advice." },
      { type: "scenario", heading: "Hypothetical example", scenario: "Sam buys a $300,000 home. All numbers are illustrative.", breakdown: ["20% down ($60K): $240K loan, no PMI, ~$1,450/month P&I (at assumed rate).", "10% down ($30K): $270K loan, PMI ~$150/month until 20% equity, ~$1,750/month P&I + PMI."], outcome: "Sam pays more per month with 10% down but needs less cash upfront. Trade-off only — not a recommendation." },
      { type: "keyTakeaways", items: ["Down payment = upfront cash; the rest is the mortgage.", "PMI is common when you put down less than 20%.", "PMI typically ends once you reach 20% equity (by payment or appreciation)."] },
    ],
  },
  "mortgage-basics": {
    hero: { title: "Mortgage Basics", subtitle: "Principal, interest, term, and types" },
    blocks: [
      { type: "callout", tone: "info", text: "A mortgage is a loan to buy a home. You pay back principal (the amount borrowed) plus interest (the cost of borrowing). The term is the length of the loan (e.g. 30 years). Amortization means early payments are mostly interest; over time, more goes to principal." },
      { type: "bullets", heading: "Why it matters", items: ["Fixed-rate: payment stays the same; adjustable-rate (ARM): can change after a period.", "Longer term = lower monthly payment but more interest paid over time.", "Amortization schedules show how each payment splits between principal and interest."], icon: "arrow" },
      { type: "comparisonTable", heading: "Fixed vs. adjustable rate (simplified)", left: { label: "Fixed-rate", points: ["Payment unchanged for full term", "Predictable budgeting", "Rate often higher than initial ARM rate"], verdict: "Predictable" }, right: { label: "Adjustable (ARM)", points: ["Rate can change after initial period", "Initial rate often lower", "Payment can go up or down"], verdict: "Variable" }, note: "Rates and terms vary. This is education only." },
      { type: "scenario", heading: "Hypothetical amortization", scenario: "$250,000 loan at 6% for 30 years. Numbers are illustrative.", breakdown: ["Month 1: most of payment is interest; small amount to principal.", "Year 15: about half of payment goes to principal.", "Year 30: final payment is mostly principal."], outcome: "Amortization means you build equity slowly at first, faster later. This is not advice." },
      { type: "keyTakeaways", items: ["Principal = amount borrowed; interest = cost of borrowing; term = length of loan.", "Fixed rate = same payment; ARM = rate (and payment) can change.", "Amortization = early payments are mostly interest; later, more principal."] },
    ],
  },

  // ─── Benefits: 401k match, IRA vs Roth, HSA ───
  "employer-benefits-overview": {
    hero: { title: "Employer Benefits", subtitle: "401(k), HSA, and FSA in plain language" },
    blocks: [
      { type: "callout", tone: "info", text: "Employer benefits are perks beyond salary. A 401(k) is a retirement account; many employers match part of what you save. An HSA is for health expenses and can double as retirement savings; an FSA is use-it-or-lose-it for health or dependent care. Rules and limits vary by plan." },
      { type: "bullets", heading: "Why it matters", items: ["401(k) match is often free money — leaving it on the table costs you.", "HSAs have triple tax benefits (deduction, growth, withdrawals for health) if used per rules.", "FSAs reduce taxable income but you must use the funds by the deadline (or lose them)."], icon: "arrow" },
      { type: "comparisonTable", heading: "401(k) vs. HSA vs. FSA (simplified)", left: { label: "401(k)", points: ["Retirement savings", "Employer match common", "Tax break now (traditional) or later (Roth)"], verdict: "Retirement" }, right: { label: "HSA / FSA", points: ["Health (and sometimes other) expenses", "HSA: keep forever; FSA: use by deadline", "HSA can act like retirement if you save receipts"], verdict: "Health" }, note: "Eligibility and rules depend on your plan. This is not advice." },
      { type: "scenario", heading: "Hypothetical example", scenario: "Jordan’s employer matches 50% of 401(k) contributions up to 6% of pay. Jordan earns $60K.", breakdown: ["Jordan contributes 6% = $3,600/year.", "Employer match = $1,800/year (hypothetical).", "Not contributing would mean leaving $1,800 on the table."], outcome: "Match formulas vary. Check your plan. This is for illustration only." },
      { type: "keyTakeaways", items: ["401(k) = retirement; match = free money if you contribute enough.", "HSA = health savings with strong tax benefits; FSA = use by deadline.", "Review your plan’s rules and contribution limits each year."] },
    ],
  },
  "401k-basics": {
    hero: { title: "401(k) Basics", subtitle: "Employer match and tax benefits" },
    blocks: [
      { type: "callout", tone: "info", text: "A 401(k) is a retirement account offered through your job. You contribute from your paycheck (often before tax), and many employers match part of what you put in. The match is one of the best deals in saving — it’s free money if you contribute enough to get it." },
      { type: "bullets", heading: "Why it matters", items: ["Match = instant return (e.g. 50% or 100% on the first X% of pay).", "Traditional 401(k) reduces taxable income now; you pay tax when you withdraw in retirement.", "Money grows tax-deferred — no tax on gains until withdrawal."], icon: "arrow" },
      { type: "comparisonTable", heading: "Traditional vs. Roth 401(k) (if offered)", left: { label: "Traditional", points: ["Deduction now, tax later on withdrawals", "Lowers current-year taxes", "Good if you expect lower tax rate in retirement"], verdict: "Tax break now" }, right: { label: "Roth 401(k)", points: ["No deduction now; tax-free qualified withdrawals later", "Pay tax today", "Good if you expect same or higher rate in retirement"], verdict: "Tax-free later" }, note: "Not all plans offer Roth. This is education only." },
      { type: "scenario", heading: "Hypothetical example", scenario: "Sam’s employer matches 100% of the first 4% of salary. Sam earns $50K and contributes 4%.", breakdown: ["Sam contributes $2,000/year.", "Employer adds $2,000 (match).", "Total going in: $4,000 — Sam only paid $2,000 from pocket."], outcome: "Match formulas vary. Contribute at least enough to get the full match if you can. Not advice." },
      { type: "keyTakeaways", items: ["401(k) = workplace retirement account; contributions often come from payroll.", "Employer match is free money — try to contribute enough to get it all.", "Traditional = tax break now; Roth (if offered) = tax-free qualified withdrawals later."] },
    ],
  },
  "ira-vs-roth-ira": {
    hero: { title: "IRA vs. Roth IRA", subtitle: "Two ways to save for retirement outside work" },
    blocks: [
      { type: "callout", tone: "info", text: "An IRA is an individual retirement account you open yourself (not through an employer). Traditional IRA: you may get a tax deduction now, pay tax on withdrawals later. Roth IRA: no deduction now, but qualified withdrawals in retirement are tax-free. Income limits apply to both." },
      { type: "bullets", heading: "Why it matters", items: ["IRAs are for people who want to save more than the 401(k) or don’t have a 401(k).", "Roth is popular for young or lower-income savers (tax-free growth for decades).", "Traditional can lower your taxes today if you’re eligible."], icon: "arrow" },
      { type: "comparisonTable", heading: "Traditional IRA vs. Roth IRA", left: { label: "Traditional IRA", points: ["Deduction now (if eligible)", "Tax on withdrawals in retirement", "Required minimum distributions (RMDs) later"], verdict: "Tax break now" }, right: { label: "Roth IRA", points: ["No deduction; you pay tax on contributions now", "Qualified withdrawals tax-free", "No RMDs for the original owner"], verdict: "Tax-free later" }, note: "Income and employment can limit deductibility (traditional) or eligibility (Roth). This is not advice." },
      { type: "scenario", heading: "Hypothetical example", scenario: "Jordan is in the 22% tax bracket and puts $6,000 in a Roth IRA. No deduction.", breakdown: ["Jordan pays $6,000 from pocket and $1,320 in tax on that income (22% of $6,000).", "In 30 years, assume the account grows (hypothetically) — withdrawals in retirement could be tax-free.", "Traditional alternative: $6,000 deduction might save $1,320 now; Jordan would pay tax on all withdrawals later."], outcome: "Choice depends on current vs. expected future tax rate. This is for illustration only." },
      { type: "keyTakeaways", items: ["Traditional IRA = possible deduction now, tax on withdrawals later.", "Roth IRA = no deduction now, tax-free qualified withdrawals later.", "Income limits and employment (e.g. 401k) affect eligibility and deductibility."] },
    ],
  },
};

/**
 * Load lesson content by curriculum lesson id.
 * Returns null if no content is defined (show "Content coming soon").
 */
export function getLessonContent(lessonId: string): LessonContent | null {
  return CONTENT_BY_LESSON_ID[lessonId] ?? null;
}

const DEFAULT_EXCERPT_MAX_CHARS = 1800;

/**
 * Build a compact excerpt from lesson content for AI context: headings + bullets only, capped.
 * Used to ground highlight explanations in the current lesson.
 */
export function buildLessonExcerpt(
  content: LessonContent,
  maxChars: number = DEFAULT_EXCERPT_MAX_CHARS
): string {
  const parts: string[] = [];
  if (content.hero?.title) parts.push(content.hero.title);
  if (content.hero?.subtitle) parts.push(content.hero.subtitle);

  for (const block of content.blocks) {
    switch (block.type) {
      case "bullets":
        if (block.heading) parts.push(block.heading);
        for (const item of block.items) parts.push(`• ${item}`);
        break;
      case "callout":
        if (block.heading) parts.push(block.heading);
        if (block.text) parts.push(block.text.slice(0, 200) + (block.text.length > 200 ? "…" : ""));
        break;
      case "comparisonTable":
        if (block.heading) parts.push(block.heading);
        parts.push(`${block.left.label}: ${block.left.points.join("; ")}`);
        parts.push(`${block.right.label}: ${block.right.points.join("; ")}`);
        break;
      case "steps":
        if (block.heading) parts.push(block.heading);
        for (const step of block.steps) parts.push(`• ${step}`);
        break;
      case "scenario":
        if (block.heading) parts.push(block.heading);
        if (block.scenario) parts.push(block.scenario.slice(0, 150) + (block.scenario.length > 150 ? "…" : ""));
        for (const item of block.breakdown) parts.push(`• ${item}`);
        break;
      case "keyTakeaways":
        if (block.heading) parts.push(block.heading);
        for (const item of block.items) parts.push(`• ${item}`);
        break;
      case "chartPlaceholder":
        if (block.title) parts.push(block.title);
        if (block.subtitle) parts.push(block.subtitle);
        break;
    }
  }

  const raw = parts.filter(Boolean).join("\n");
  if (raw.length <= maxChars) return raw;
  return raw.slice(0, maxChars) + "…";
}
