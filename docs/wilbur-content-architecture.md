# Wilbur Content Architecture

A clean, scalable content architecture for Wilbur: the “Start Here” button for adult money. This document defines how the library is organized, how users enter it, and what we build first. Architecture only—no lesson copy.

---

## 1) CORE DESIGN PRINCIPLES (for the library)

### How many top-level categories should exist (and why)

**Recommendation: 8–10 domains.**

- **Why not more:** More than ~10 feels like an encyclopedia. Beginners freeze when they see 20+ categories.
- **Why not fewer:** Fewer than ~6 forces unrelated topics into one bucket (e.g. “Investing” that mixes stocks, crypto, real estate, retirement).
- **Sweet spot:** 8–10 lets us separate “Money Foundations,” “Banking & Credit,” “Investing (Stocks),” “Crypto,” “Real Estate,” “Debt & Loans,” “Retirement,” and 1–2 flexible slots (e.g. “Tax Basics,” “Insurance Basics”). Each domain has a clear purpose and 5–10 lessons.

### How many lessons per category is ideal

- **Per domain: 5–10 lessons.** Fewer than 5 and the domain feels thin; more than 10 and it feels like a textbook.
- **Total library (first release): 50–70 lessons.** Enough to support 5–7 life-stage tracks with 8–12 lessons each (with overlap across tracks).
- **Depth tiers:** Most lessons are Beginner; 20–30% Beginner+; 10–15% Intermediate. No “advanced” in v1.

### When to split vs combine lessons

**Split when:**
- The learning objective is different (“What is a stock?” vs “Why do stock prices change?”).
- One concept needs its own hook, mechanics, and practice to land.
- Combining would push the lesson past ~8 minutes or 3+ distinct ideas.

**Combine when:**
- Two ideas are always used together and total under ~5 minutes (e.g. “What is a 401(k)” + “Why the match matters”).
- One is a natural “Part 2” that doesn’t stand alone (e.g. “Credit score basics” + “How to check your score”).

### The “medium depth” rule

- **One level of “why”** for beginners. Explain the mechanism (e.g. “prices change because of supply and demand”), not the next layer (market microstructure).
- **Real-life first.** Teach what helps someone decide or act (e.g. “how to compare two cards”) before edge cases (e.g. “what happens if you dispute after 60 days”).
- **Stop before regulatory minutiae.** Mention that rules exist; don’t teach FDIC fine print, SEC regs, or tax code details unless the lesson is explicitly “Tax basics” or “How banks are protected.”

### What should NOT be included in Wilbur

- **Encyclopedia entries** (every type of derivative, every account subtype).
- **Professional certification content** (CFP, Series 7 style).
- **Regulatory deep dives** (full FDIC, SEC, state-by-state licensing).
- **Trading tactics** (day trading, options strategies, “how to time the market”).
- **Specific product or ticker recommendations** (no “buy this ETF”).
- **Tax or legal advice** (only “this is a concept; talk to a pro for your situation”).
- **Niche or edge-case topics** (e.g. backdoor Roth, mega backdoor) until core paths are solid.

---

## 2) LIFE STAGE TRACKS (Primary Entry System)

Life stage is the **primary entry system**. Users choose a track; the track recommends an ordered list of lessons. Tracks overlap (same lesson can appear in multiple tracks) but the sequence and framing are track-specific.

---

### Track 1: First Job (High school / early work)

**Who it’s for:** High school or early-college age with first job (part-time, gig, or seasonal). First time managing their own money.

**Core priorities:** Earn, save a little, avoid debt traps, understand banking basics.

**Recommended lessons (ordered):**

1. Why money habits matter now  
2. What is a budget (and why it’s not punishment)  
3. Checking vs savings: what’s the difference  
4. How to open your first account  
5. What is a credit score (and why it’s not scary)  
6. Debit vs credit: when to use which  
7. What is interest (simple version)  
8. How to spot a scam or bad deal  
9. Saving for something specific (first goal)  
10. When to say no: peer pressure and money  

**Why this order:** Start with mindset and one simple system (budget), then where money lives (accounts), then how credit works at a basic level, then safety and goals. Avoids investing until they have a foundation.

---

### Track 2: College & Part-Time Income

**Who it’s for:** College students with part-time income, side gigs, or aid. May have first credit card or small loans.

**Core priorities:** Bank safely, use credit wisely, avoid student-debt mistakes, start a tiny emergency buffer.

**Recommended lessons (ordered):**

1. Your money system in 3 buckets (spend / save / later)  
2. Checking vs savings (and high-yield basics)  
3. What is a credit score  
4. How to use a credit card without debt  
5. Student loans: what you’re actually signing  
6. Student loans: repayment options in plain English  
7. What is interest (and why it can work for or against you)  
8. Building a small emergency fund  
9. What is investing (big picture only)  
10. Saving for short-term vs long-term goals  

**Why this order:** Buckets and accounts first, then credit and cards, then the big commitment (student loans) and repayment, then safety (emergency fund) and a peek at investing. Sets up “after graduation” without overload.

---

### Track 3: First Full-Time Job (Early career)

**Who it’s for:** 22–28, first W-2 job. May have student debt, first 401(k), and no idea how to “do money” as an adult.

**Core priorities:** Maximize employer benefits, manage debt, start saving and investing in simple ways.

**Recommended lessons (ordered):**

1. Your first paycheck: what’s taken out and why  
2. What is a 401(k) (and why the match is free money)  
3. How much to save from every paycheck  
4. Emergency fund: how much and where  
5. What is a stock (plain English)  
6. Why stock prices change  
7. What is diversification  
8. Index funds and ETFs in plain English  
9. Student loans: pay off faster or invest? (tradeoffs)  
10. Credit cards: when they help vs hurt  
11. Your first financial health check (annual habit)  

**Why this order:** Paycheck and 401(k) first (immediate wins), then emergency fund, then stocks at a conceptual level, then simple products (index/ETF), then the “debt vs invest” tradeoff and credit. Ends with a habit (annual check).

---

### Track 4: First-Time Home Buyer

**Who it’s for:** 28–40, saving or ready to buy first home. May have some investments and stable job.

**Core priorities:** Down payment, mortgage basics, not overbuying, protecting the asset.

**Recommended lessons (ordered):**

1. How much house can you afford (really)  
2. Down payment: how much and where to keep it  
3. What is a mortgage (types in plain English)  
4. Fixed vs adjustable rate: what’s the difference  
5. What is PMI and when does it go away  
6. Closing costs: what you’re actually paying  
7. How to compare mortgage offers  
8. Homeownership beyond the loan (maintenance, insurance)  
9. Refinancing: when it makes sense  
10. Real estate as investment (RE basics, not “get rich”)  

**Why this order:** Affordability and down payment first, then how a mortgage works, then costs and comparison, then life-after-purchase and refinancing. Real estate as investment last, framed as education not hype.

---

### Track 5: Catching Up (Mid-career, behind on savings)

**Who it’s for:** 35–50, single parent or solo earner, or late start. Feels behind on retirement and savings.

**Core priorities:** Prioritize without panic, debt payoff vs saving, simple investing, employer benefits.

**Recommended lessons (ordered):**

1. It’s not too late: how time and consistency still work  
2. Where to start when you’re behind (priority order)  
3. Emergency fund first: how much and why  
4. High-interest debt: pay it before investing  
5. What is a 401(k) and why the match matters  
6. What is an IRA (simple version)  
7. What is a stock and how investing grows money  
8. Index funds: simple path to diversification  
9. How much to save for retirement (simple targets)  
10. Student loans or other debt: payoff vs invest (tradeoffs)  
11. One simple plan: automate and forget  

**Why this order:** Mindset and priority order first, then emergency fund and debt, then retirement accounts and basics of investing, then “how much” and automation. Reduces overwhelm by giving one clear sequence.

---

### Track 6: First-Gen Professional (Building wealth without a playbook)

**Who it’s for:** First-generation professional, new to corporate benefits and long-term wealth building. May support family.

**Core priorities:** Understand benefits, build credit and savings, invest with confidence, avoid costly mistakes.

**Recommended lessons (ordered):**

1. Your benefits package: what’s in it and what to use first  
2. What is a 401(k) and why the match is non-negotiable  
3. Building and protecting your credit score  
4. Emergency fund: your first safety net  
5. What is a stock (plain English)  
6. Why diversification matters  
7. Index funds and ETFs: simple investing  
8. What is an IRA and when to use it  
9. Saving for family vs saving for you (tradeoffs)  
10. When to get help (financial advisor, not product sales)  
11. Estate basics: why a will and beneficiaries matter  

**Why this order:** Benefits and 401(k) first (immediate value), then credit and emergency fund, then investing in order (concept → diversification → products), then family tradeoffs, when to get help, and a light touch on estate. Respects “first playbook” without overloading.

---

### Track 7: Debt Focus (Debt and no investments yet)

**Who it’s for:** Anyone with meaningful debt (cards, student loans, medical, etc.) and little or no investing. Wants to get stable first.

**Core priorities:** Understand debt, prioritize payoff, avoid new bad debt, know when to start investing.

**Recommended lessons (ordered):**

1. Why your debt feels overwhelming (and what actually helps)  
2. Good debt vs bad debt (simple framing)  
3. How interest works when you owe money  
4. Credit cards: how to stop the cycle  
5. Student loans: repayment options in plain English  
6. Payoff strategy: avalanche vs snowball (and which fits you)  
7. When to pay debt vs save (emergency fund first)  
8. When to pay debt vs invest (tradeoffs)  
9. What is a credit score and how to improve it  
10. Building a budget that includes debt payoff  
11. When you’re ready to invest (and what “ready” means)  

**Why this order:** Mindset and good/bad debt first, then interest and cards, then student loans and payoff strategies, then the “debt vs save vs invest” order. Ends with credit, budget, and a clear “when to invest” so they don’t jump in too early or wait forever.

---

## 3) DOMAIN STRUCTURE (Balanced Categories)

Eight core domains. Each has a purpose, 5–10 lessons, one-line descriptions, and a depth level (Beginner / Beginner+ / Intermediate).

---

### Domain 1: Money Foundations

**Purpose:** Mindset, systems, and first habits. Where to start when you don’t know where to start.

| Lesson title | One-line description | Depth |
|--------------|----------------------|--------|
| Why money habits matter now | How small habits compound and why starting early helps | Beginner |
| What is a budget (and why it’s not punishment) | Budget as a plan, not restriction | Beginner |
| Your money in 3 buckets (spend / save / later) | Simple mental model for allocating money | Beginner |
| How much to save from every paycheck | Rule-of-thumb and percentage targets | Beginner |
| Emergency fund: how much and where | 3–6 months, where to keep it, when to use it | Beginner |
| Saving for short-term vs long-term goals | Different accounts and time horizons | Beginner |
| Where to start when you’re behind | Priority order for catch-up (debt, emergency, invest) | Beginner+ |
| One simple plan: automate and forget | Direct deposit, auto-transfer, set-and-forget | Beginner |

---

### Domain 2: Banking & Accounts

**Purpose:** Where money lives. Checking, savings, and safe use of accounts.

| Lesson title | One-line description | Depth |
|--------------|----------------------|--------|
| Checking vs savings: what’s the difference | Use cases and typical features | Beginner |
| How to open your first account | What you need and what to avoid | Beginner |
| What is a high-yield savings account | Interest on savings in plain English | Beginner |
| How to keep your money safe (scams and fraud) | Red flags and simple protections | Beginner |
| Your first paycheck: what’s taken out and why | Deductions, taxes, and take-home | Beginner |

---

### Domain 3: Credit & Debt Basics

**Purpose:** Credit scores, cards, and debt in plain English. No product pitches.

| Lesson title | One-line description | Depth |
|--------------|----------------------|--------|
| What is a credit score (and why it’s not scary) | What it is, what it’s used for, range | Beginner |
| How to check your credit (free and safe) | AnnualCreditReport, apps, what to ignore | Beginner |
| Debit vs credit: when to use which | Safety and impact on score and cash flow | Beginner |
| How to use a credit card without debt | Pay in full, avoid interest, build score | Beginner |
| Credit cards: when they help vs hurt | Rewards vs traps; when to avoid | Beginner |
| Good debt vs bad debt (simple framing) | Borrowing for growth vs for consumption | Beginner |
| How interest works when you owe money | APR, compound interest on debt | Beginner |
| Building and protecting your credit score | Habits that raise and protect score | Beginner+ |

---

### Domain 4: Investing — Stocks & Markets

**Purpose:** Stocks and markets in plain English. Multiple focused lessons, not one mega-lesson.

| Lesson title | One-line description | Depth |
|--------------|----------------------|--------|
| What is a stock (plain English) | Share of ownership, why people buy/sell | Beginner |
| Why do stock prices change | Supply, demand, and news in simple terms | Beginner |
| What is diversification | Don’t put all eggs in one basket | Beginner |
| What is an index (and why it matters) | Market barometer, passive investing intro | Beginner |
| Index funds and ETFs in plain English | What they are, how they differ, why use them | Beginner+ |
| What is risk and volatility (for beginners) | Ups and downs, time in market | Beginner+ |
| What is a 401(k) (and why the match is free money) | Employer plan, match, tax basics | Beginner |
| What is an IRA (simple version) | Individual account, when to use it | Beginner+ |
| How much to save for retirement (simple targets) | Percentages and age-based heuristics | Beginner+ |

---

### Domain 5: Crypto Basics

**Purpose:** What crypto is, how it’s different from stocks, and risks. Education only, no “how to get rich.”

| Lesson title | One-line description | Depth |
|--------------|----------------------|--------|
| What is cryptocurrency (plain English) | Digital asset, blockchain in one sentence | Beginner |
| Crypto vs stocks: what’s the difference | Volatility, regulation, custody | Beginner |
| Why crypto is riskier than stocks | No guarantees, scams, volatility | Beginner |
| If you’re curious about crypto (what to know first) | Custody, taxes, and “only what you can lose” | Beginner+ |
| Stablecoins and DeFi: just the basics | What they are; high risk in one line | Beginner+ |

---

### Domain 6: Real Estate & Housing

**Purpose:** Owning, renting, and real estate as topic. Educational, not “get rich in real estate.”

| Lesson title | One-line description | Depth |
|--------------|----------------------|--------|
| Renting vs buying: what to consider | Tradeoffs, not “always buy” | Beginner |
| How much house can you afford (really) | Income, debt, and down payment | Beginner |
| What is a mortgage (types in plain English) | Fixed, ARM, term, principal | Beginner |
| Down payment: how much and where to keep it | Targets and safe places to hold cash | Beginner |
| Fixed vs adjustable rate: what’s the difference | When each might make sense | Beginner+ |
| What is PMI and when does it go away | Why it exists and how to remove it | Beginner |
| Closing costs: what you’re actually paying | Line items in plain English | Beginner+ |
| Real estate as investment (RE basics) | REITs, rental income, risks—no hype | Beginner+ |
| Short-term rentals (STR): what they are and the risks | STR as a concept; regulations and volatility | Beginner+ |

---

### Domain 7: Debt & Loans (Strategy)

**Purpose:** Student loans, payoff strategies, and debt tradeoffs. Strategy framing, not product sales.

| Lesson title | One-line description | Depth |
|--------------|----------------------|--------|
| Student loans: what you’re actually signing | Types, interest, and obligation in plain English | Beginner |
| Student loans: repayment options in plain English | Standard, income-driven, forgiveness basics | Beginner |
| Student loans: pay off faster or invest? (tradeoffs) | When to prioritize payoff vs investing | Beginner+ |
| Payoff strategy: avalanche vs snowball | Which debt to pay first and why | Beginner |
| When to pay debt vs save (emergency fund first) | Order of operations | Beginner |
| When to pay debt vs invest (tradeoffs) | Decision framework, not a single answer | Beginner+ |
| Credit cards: how to stop the cycle | Practical steps to get out of revolving debt | Beginner |

---

### Domain 8: Retirement & Long-Term

**Purpose:** Retirement accounts and simple long-term planning. No edge-case products in v1.

| Lesson title | One-line description | Depth |
|--------------|----------------------|--------|
| What is a 401(k) (and why the match is free money) | Employer plan, match, tax basics | Beginner |
| What is an IRA (simple version) | Traditional vs Roth in one lesson | Beginner+ |
| How much to save for retirement (simple targets) | Percentages and age-based heuristics | Beginner+ |
| It’s not too late: how time and consistency still work | Mindset for catch-up | Beginner |
| Your benefits package: what’s in it and what to use first | 401(k), HSA, insurance at a glance | Beginner |
| When to get help (financial advisor, not product sales) | What advisors do and how to choose | Beginner+ |
| Estate basics: why a will and beneficiaries matter | Beneficiaries, will, and why it’s not just “rich people” | Beginner+ |

---

### Domain 9: Tax Basics (Light)

**Purpose:** Enough to understand withholdings, refunds, and when to get help. No full tax course.

| Lesson title | One-line description | Depth |
|--------------|----------------------|--------|
| Your first paycheck: what’s taken out and why | Deductions, taxes, take-home | Beginner |
| What is a W-4 and how to fill it simply | Withholding in plain English | Beginner |
| Refund vs owe: what it means and how to adjust | Why you get money back or pay in | Beginner+ |
| When to use a pro (tax preparer vs DIY) | Simple vs complex situations | Beginner |

---

### Domain 10: Insurance Basics (Light)

**Purpose:** What insurance is for and main types. No product recommendations.

| Lesson title | One-line description | Depth |
|--------------|----------------------|--------|
| What is insurance (and why you need some) | Risk transfer in one lesson | Beginner |
| Health insurance: key terms in plain English | Deductible, premium, copay, network | Beginner |
| Renters and homeowners insurance: what’s covered | Basics of property coverage | Beginner |

---

## 4) WHAT TO REMOVE OR SIMPLIFY

### Topics unnecessary for beginners (remove or don’t build)

- **Every account subtype** (e.g. every 401(k) variant, every IRA nuance). One “What is a 401(k)” and one “What is an IRA” is enough for v1.
- **Options, futures, forex.** Not “Start Here” content.
- **Detailed FDIC/SIPC/regulatory explanations.** Mention that protection exists; don’t teach the fine print.
- **State-by-state tax or licensing.** “Rules vary by state; check your state” is enough.
- **Backdoor Roth, mega backdoor, etc.** Edge cases after core paths exist.

### Topics to simplify

- **Budgeting:** One simple system (e.g. 3 buckets or 50/30/20), not five competing methods.
- **Credit score:** What it is, how to check it, how to improve it. No FICO vs VantageScore deep dive.
- **Retirement “how much”:** Simple percentage or multiple-of-salary targets, not full retirement calculators in lesson form.
- **Mortgage types:** Fixed vs ARM and term length. No exhaustive product list.

### Topics to merge

- **“What is a stock” and “Why do stock prices change”** stay separate (different objectives).
- **“What is an index” and “Index funds and ETFs”** can be one lesson if kept under 8 minutes; otherwise keep as two (concept first, then product).
- **Multiple “how to budget” lessons** → one “What is a budget” + one “Your money in 3 buckets” (system).
- **Scattered “interest” mentions** → one “What is interest” (for saving) + reference in debt lessons (when you owe).

### Overly technical areas to avoid (for now)

- Market microstructure, order types, bid-ask.
- Detailed tax code (deductions, phase-outs, AMT).
- Full estate planning (trusts, probate).
- Insurance policy fine print (exclusions, riders).
- Crypto technicals (mining, consensus, layer-2) beyond one sentence if needed.

---

## 5) PROGRESSION LOGIC

### What to know before a stocks deep dive

- **Required:** Money foundations (budget or buckets, save from paycheck). Optional but helpful: emergency fund, what interest is.
- **Not required:** Credit score, retirement accounts, or crypto. Stocks can come right after “why save” and “where to keep money.”

### What to know before crypto

- **Required:** What a stock is and that investing has risk. “Crypto vs stocks” and “why crypto is riskier” assume they get “normal” investing a little.
- **Not required:** Deep diversification or ETF knowledge. Crypto is a “curious” path, not core path.

### What to know before real estate (as investment)

- **Required:** Budget/savings, basic investing (stocks, diversification). Real estate is another asset class.
- **Required for buying a home:** Budget, credit, debt basics, and “how much house” before “what is a mortgage.”

### Prerequisite mapping system (simple)

- **Tier 0 (no prereqs):** Money Foundations, Banking, Credit basics, “What is a stock,” “What is a budget.”
- **Tier 1 (after Tier 0):** Index funds/ETFs, 401(k), IRA, emergency fund, debt payoff strategies, “How much house.”
- **Tier 2 (after Tier 1):** Crypto basics, real estate as investment, STR, “Pay debt vs invest,” tax/insurance basics.
- **Life stage tracks** enforce order within the track; cross-track we only suggest “Start with Tier 0 in this domain.”

### How to prevent overwhelming users

- **One track at a time.** User picks one life stage; we show 8–12 lessons in order. No “full library” dump.
- **Next lesson is obvious.** After each lesson, one clear “Next” (and optional “See also” for 1–2 links).
- **Progress visible.** Checkmarks or progress bar so they see how much they’ve done.
- **Skip allowed.** They can jump, but we don’t push 50 lessons at once.
- **No “you must read this.”** Framing: “Recommended next” or “Often taken next,” not “Required.”

---

## 6) PRIORITIZED BUILD ROADMAP

### Order of execution (domains)

1. **Money Foundations** — Needed by every track. Small set of lessons, high reuse.
2. **Banking & Accounts** — Same: every track touches accounts. Keeps scope tight.
3. **Credit & Debt Basics** — Critical for Debt track and First Job / College. Enables “debt vs invest” and home-buying prep.
4. **Investing — Stocks & Markets** — Highest user interest. Build “What is a stock,” “Why prices change,” “Diversification,” “Index/ETF,” plus 401(k)/IRA and “how much to save.”
5. **Debt & Loans (Strategy)** — Student loans and payoff strategy. Unlocks Debt track and College track.
6. **Retirement & Long-Term** — 401(k), IRA, simple targets. Unlocks First Full-Time Job and Catching Up.
7. **Real Estate & Housing** — Mortgage and affordability first; then “real estate as investment” and STR. Unlocks First-Time Home Buyer.
8. **Crypto Basics** — Short set. “What it is,” “vs stocks,” “why riskier,” “if you’re curious.” No product push.
9. **Tax Basics (Light)** — 3–4 lessons. Paycheck, W-4, refund vs owe, when to get help.
10. **Insurance Basics (Light)** — 3 lessons. What insurance is, health terms, renters/homeowners.

### Flagship life stage track

**Recommendation: “First Full-Time Job” (Track 3) as flagship.**

- **Why:** Big audience (22–28, first W-2), clear moment (“I have a job, now what?”). Covers 401(k), emergency fund, stocks, index funds, and debt vs invest—core Wilbur value.
- **Build order for flagship:** Money Foundations (2–3) → Banking (1–2) → 401(k) + emergency fund → What is a stock → Why prices change → Diversification → Index/ETF → Student loans tradeoff → Credit cards → Financial health check. That’s the Track 3 list; build those lessons first within each domain.
- **Then:** Add “First Job” (high school) and “College” tracks reusing the same lessons in different order. Then “Catching Up” and “Debt Focus,” then “First-Time Home Buyer” and “First-Gen Professional.”

### Why this order

- Foundations and Banking are small and shared.
- Credit and Debt unlock multiple tracks and feel urgent.
- Stocks/Investing is the most requested; do it early but after foundations.
- Debt strategy and Retirement complete the “adult money basics” set.
- Real Estate and Crypto extend without blocking core paths.
- Tax and Insurance are light and can close gaps.

---

*End of architecture. Use this with the Wilbur Content System and project-context docs for consistent, scalable content.*
