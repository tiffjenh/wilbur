# Wilbur Content System

A guide for engineers and writers generating and maintaining lesson content in Cursor. Use this doc to keep Wilbur’s lessons clear, safe, and motivating.

---

## 1) North Star & Positioning

**What Wilbur is**
- A financial literacy web app that teaches money basics in plain language.
- Lessons are short, block-based, and designed for people with little or no finance background.
- Includes an AI helper that explains highlighted terms—education only, no personalized advice.

**What Wilbur is not**
- Not a brokerage, advisor, or recommendation engine.
- Not a replacement for professional advice for complex situations.
- Not a deep-dive into regulation, tax code, or edge cases.

**Promise to users (one sentence)**  
*“We explain money in plain English so you can learn at your own pace and make decisions with confidence.”*

**#1 content goal**  
Every lesson leaves the learner with one or two clear, usable ideas they can remember and act on—without feeling overwhelmed or talked down to.

---

## 2) Wilbur Writing Principles (10–12 rules)

**DO**
- Use plain language; assume zero prior knowledge.
- Define any necessary jargon in one sentence, in simple terms.
- Keep lessons short and engaging (target 5–8 minutes).
- Teach what matters for real life first; skip edge cases and regulatory minutiae.
- Use examples, visuals, and simple mental models (e.g., “interest is the cost of borrowing”).
- Frame everything as education: “here’s how it works” and “here are tradeoffs,” not “you should do X.”
- Use “you” and “your” to feel direct; avoid “one might consider” or passive corporate voice.
- Prefer short sentences and short paragraphs (max ~2–3 sentences per paragraph in body text).
- End sections with a single takeaway or next step when it helps.

**DON’T**
- Don’t give personalized financial advice or specific recommendations (“you should buy X,” “put 60% in stocks”).
- Don’t use jargon without defining it (e.g., “APR,” “compound interest,” “diversification”).
- Don’t write long, dense paragraphs or academic tone.
- Don’t teach regulatory fine print (e.g., FDIC details) unless it’s essential for the concept.
- Don’t promise outcomes (“you’ll get rich”) or create fear (“you’re behind if you don’t…”).

**Jargon → plain language (examples)**
- *APR* → “The yearly cost of borrowing money, shown as a percentage.”
- *Compound interest* → “Interest that’s calculated on your original amount plus any interest you’ve already earned.”
- *Diversification* → “Spreading your money across different types of investments so one bad outcome doesn’t wipe you out.”
- *Volatility* → “How much a price tends to move up and down over time.”

**Minimum effective detail**
- One idea per paragraph or bullet group.
- One clear definition per term when first used.
- One concrete example per concept when it helps (e.g., “If you put $100 in a savings account at 4% interest…”).
- Cut anything that doesn’t help a beginner decide or understand.

**Sample rewrites (Wilbur style)**

*Before (jargony):* “Investors often utilize dollar-cost averaging to mitigate the impact of volatility on their portfolio’s risk-adjusted returns.”

*After (Wilbur):* “When you invest a fixed amount on a regular schedule—say $50 every month—you buy more shares when prices are low and fewer when they’re high. That can smooth out the effect of ups and downs over time.”

*Before (vague):* “Understanding the time value of money is essential for long-term financial planning.”

*After (Wilbur):* “Money today is worth more than the same amount later, because you can earn interest on it or use it now. That’s why starting to save early often beats waiting.”

---

## 3) Lesson Design Blueprint (standard structure)

**Standard flow:** Hook → Concept → Mechanics → Pitfalls → Practice → Summary

| Section      | Purpose                         | Must include                          | Length / density      |
|-------------|----------------------------------|--------------------------------------|------------------------|
| **Hook**    | Grab attention, state why it matters | One sentence “why this matters”; relatable scenario or question | 1–2 short paragraphs   |
| **Concept** | Core idea in plain language      | Simple definition; one mental model or analogy | 2–3 short paragraphs   |
| **Mechanics** | How it actually works           | Steps or building blocks; one concrete example | Bullets or short paras; keep scannable |
| **Pitfalls** | What to watch out for            | 1–2 common mistakes or myths; no fear-mongering | 1 short paragraph + optional callout |
| **Practice** | Make it real (example / scenario) | One “try this” or “example” (e.g., person or numbers) | 1 paragraph or example block |
| **Summary** | Lock in the takeaway             | 1–3 bullet takeaways; optional “next step” | 3–5 bullets max        |

**Length targets**
- Total lesson: 5–8 minutes read (roughly 400–700 words of body text, depending on blocks).
- Paragraph: max 2–3 sentences; break up longer ideas.
- Bullet list: 3–5 items per list; use sub-bullets only when necessary.
- One main idea per screen or block group.

**Content density**
- No wall of text: alternate paragraphs with bullets, callouts, or headings.
- At least one visual or structural break (heading, callout, divider) every 2–3 paragraphs.

---

## 4) Block-by-Block Content Guidelines

| Block                | Best for                                      | Do’s / Don’ts                                                                 | Example snippet (Wilbur style) |
|----------------------|-----------------------------------------------|-------------------------------------------------------------------------------|---------------------------------|
| **heading**          | Section titles; clear hierarchy (level 2 main, 3 sub) | Use sentence case; keep under ~8 words where possible                        | “Why do stock prices change?”   |
| **paragraph**        | Explaining one idea; short narrative          | 2–3 sentences; one idea per paragraph                                         | “When you buy a stock, you own a small piece of that company. If the company does well, your share can become more valuable. If it doesn’t, the value can go down.” |
| **bullets**          | Lists of facts, steps, or options             | 3–5 items; parallel structure; complete thoughts                             | “Stocks are also called shares or equity.” / “Companies sell stock to raise money to grow.” |
| **callout**          | Tips, mistakes, reality checks, “try this”    | One clear message; match variant (tip / note / warning) to tone               | *Tip:* “You don’t need to time the market. Many people invest a set amount on a schedule to smooth out ups and downs.” |
| **chips**            | Key terms, tags, or quick takeaways           | 3–6 short labels; no full sentences                                            | Share · Ticker · Dividend · Volatility · Portfolio |
| **divider**          | Visual break between big ideas                | Use between sections, not after every paragraph                                | —                              |
| **chartPlaceholder** | Showing trend, comparison, or “how it works”  | Title + short description; specify chartType (line/bar/pie) for the renderer  | Title: “How a stock price might move over time.” Description: “Hypothetical line chart showing ups and downs over 12 months.” |
| **imagePlaceholder** | Diagrams, simple illustrations               | Title + description so engineers know intent                                   | “Simple diagram: one share = one tile in a big grid.” |
| **twoColumn**        | Compare two options or before/after            | Left/right parallel structure; keep each side short                            | Left: “Paying minimum only.” Right: “Paying a bit extra each month.” |
| **comparisonCards**  | Side-by-side choices (e.g., two account types) | Two cards; each has title + bullets (+ optional badge)                         | Card 1: “Savings account” / Card 2: “Checking account” with 2–3 bullets each |

---

## 5) Visual Learning Guidelines

**When to use charts/diagrams**
- When a number or trend over time is the main point (e.g., interest growing, debt shrinking).
- When comparing two or three options (e.g., payoff strategies, account types).
- When a simple diagram clarifies a relationship (e.g., “your share” = one tile in a grid).

**What makes a good beginner chart**
- One main message (e.g., “over time, balance goes up” or “this option pays off faster”).
- Clear labels; avoid tiny type or too many series.
- Realistic but simple numbers (round numbers, one scenario).
- Short caption or description in the lesson that states the takeaway.

**Examples of visuals that explain**
- **Interest:** Line or bar showing balance over time with “no extra payments” vs “small extra each month.”
- **Inflation:** Bar or line comparing “same dollar amount” vs “what it buys over time.”
- **Risk/volatility:** Line chart with ups and downs and a “time in market” or “average over time” line.
- **Debt payoff:** Two lines or two bars: “minimum only” vs “extra principal”; or a simple table of “month 1, 12, 24.”

---

## 6) Safety & Advice Guardrails

**Forbidden content**
- Personalized financial advice (“you should invest in X,” “your allocation should be…”).
- Specific stock, fund, or product recommendations.
- “Do this now” or “you must” framing for financial decisions.
- Promises of outcomes (“you’ll get rich,” “guaranteed returns”).
- Tax or legal advice (beyond “this is a concept; consider talking to a professional for your situation”).

**Safe alternatives**
- Explain how things work and what tradeoffs people often consider.
- Use “many people…” or “one approach is…” instead of “you should.”
- Offer questions to ask oneself or a professional (“How much risk am I comfortable with?” “Do I have an emergency fund first?”).
- Use examples with generic numbers or “Person A / Person B” rather than “you.”

**Required disclaimer language**
- **In-app (AI helper):** “This is for education only, not personalized financial advice.”
- **Lesson footer or first callout when relevant:** “Wilbur teaches concepts to help you learn. We don’t give personalized advice. For your situation, consider speaking with a qualified professional.”
- Keep disclaimers one sentence where possible; avoid long legal blocks in the body.

---

## 7) Curriculum Scope Rules

**When to create a new lesson vs combine**
- **New lesson:** One clear learning objective (e.g., “What is a stock?” or “How does compound interest work?”). Concept is big enough to need its own hook, mechanics, and practice.
- **Combine:** Two ideas are always used together and under ~5 minutes total (e.g., “What is a stock?” + “Why do prices change?” can be one lesson if kept tight).

**How deep to go**
- Stop before edge cases (e.g., teach “what is a 401(k)” and “why match matters,” not plan loan rules in the first lesson).
- One level of “why” is enough for beginners (e.g., “prices change because of supply and demand” without market microstructure).
- If a detail doesn’t help someone make a better decision or feel less confused, cut it or move to “Learn more” / later lesson.

**“Remove or simplify” checklist**
- [ ] Is this sentence needed for the main idea?
- [ ] Would a beginner care about this in the first 5 minutes?
- [ ] Can we say it in fewer words or one example?
- [ ] Is this regulation/edge case or “what matters for real life”?
- [ ] Does this sound like advice? If yes, reframe to education.

---

## 8) Tone & Voice

**Persona**
- **Calm, clear older sibling:** Patient, not condescending. You’re on the learner’s side and you’ve seen this before. No corporate stiffness, no hype.

**Style guide**
- **Sentence length:** Mix short and medium; avoid long, multi-clause sentences.
- **Word choice:** Prefer common words (“use” not “utilize,” “help” not “facilitate”). Use “you” and “your.”
- **Analogies:** Use everyday comparisons (tiles in a grid, a shared pizza, a growing plant). Avoid sports or niche metaphors unless you briefly explain.
- **Humor:** Light and rare; never at the learner’s expense. When in doubt, skip it.

**Good vs bad tone**

| Avoid (bad)                          | Prefer (good)                                      |
|--------------------------------------|----------------------------------------------------|
| “One must consider asset allocation.” | “You might think about how to spread your money.”  |
| “It is imperative to save.”           | “Saving early often helps.”                         |
| “Retail investors often misunderstand.” | “A lot of people wonder why…”                    |
| “Maximize your risk-adjusted returns.” | “You can balance growth and how much swing you’re okay with.” |

---

## 9) Content QA Checklist

Before publishing, run through:

**Clarity**
- [ ] Can someone with no finance background follow the main idea?
- [ ] Is every necessary term defined in one sentence?
- [ ] Are paragraphs short (2–3 sentences) and one idea each?

**Relevance**
- [ ] Does this help with a real decision or real confusion?
- [ ] Are examples relatable (e.g., first job, first account, first investment)?

**Engagement**
- [ ] Is there a clear hook and a clear summary?
- [ ] Is there at least one concrete example or “try this”?
- [ ] Are blocks varied (not only paragraph after paragraph)?

**Safety**
- [ ] No personalized advice or “you should” recommendations?
- [ ] No specific products or tickers as recommendations?
- [ ] Disclaimer present where needed (AI helper, lesson when relevant)?

**Length**
- [ ] Total lesson ~5–8 minutes (roughly 400–700 words of body)?
- [ ] No section feels like a wall of text?

---

## 10) Templates

**Lesson outline (fill-in-the-blank)**

```text
Lesson: [Title]
Slug: [e.g. stocks-101]
Level: beginner | intermediate | advanced
Target time: 5–8 min

Hook
- Why this matters (1 sentence):
- Relatable scenario or question:

Concept
- Core idea in one sentence:
- Mental model or analogy:

Mechanics
- Key points or steps (3–5 bullets):
- One concrete example:

Pitfalls
- Common mistake or myth:
- Callout (tip/note/warning): 

Practice
- Example or “try this”:

Summary
- Takeaway 1:
- Takeaway 2:
- Takeaway 3:
- Optional next step:
```

**Callout library (titles + when to use)**

| Title            | When to use                         | Variant  |
|------------------|-------------------------------------|----------|
| Common Mistake   | Correcting a myth or typical error  | note / warning |
| Key Takeaway     | One thing to remember               | tip      |
| Reality Check    | Setting expectations (e.g., “this takes time”) | note |
| Try This         | One concrete next step or exercise  | tip      |
| Remember         | Short recap of a definition or rule | note     |

**Glossary entry template**

```text
Term: [e.g. APR]
Simple definition (1 sentence): 
Example (1 sentence or numbers): 
Common confusion (optional): 
```

---

*Use this doc in Cursor when generating or editing lesson content so Wilbur stays clear, safe, and on-brand.*
