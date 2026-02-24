# Wilbur Summary Output Engine v1

Structured output logic and content-generation rules for converting questionnaire results (from Scoring Architecture v1) into a personalized summary page and lesson recommendations. Not UI design—logic and copy rules only.

---

## Inputs (from Questionnaire Scoring Architecture v1)

The engine receives:

- **scoreDimensions** — lifeStage, incomeStability, resourceLevel, debtUrgency, emergencyPreparedness, investmentReadiness, confidence, goalOrientation (0–4 or 0–1)
- **derivedTiers** — investmentReadinessTier, debtUrgencyTier, stabilityTier
- **persona** — id, name
- **topPriorities** — ordered array of 3 focus area keys
- **priorityScores** — full map area → score (optional, for debugging)
- **gatingFlags** — advancedInvesting, stocksDeepDive, crypto, strRealEstate (boolean)
- **learningMode** — "tailored" | "explore"
- **state** — string | null
- **rawAnswers** — q1–q10 (for optional personalization)

---

# PART 1 — SUMMARY PAGE STRUCTURE

Standard structure of the summary page. Each section has a purpose, input data, output rules, and tone constraints.

---

## Section 1: Persona Identity

**Purpose:** Name the user’s situation in a non-labeling way so they feel seen, not boxed in.

**Input data used:** `persona.id`, `persona.name`, optionally `rawAnswers.q3` (life stage) and `rawAnswers.q9` (goal) for natural language.

**Output rules:**
- One short sentence or two that reflects the persona name and intent.
- Use “You’re in a …” or “Your situation sounds like …” framing, not “You are a …”.
- Do not repeat the literal persona label as a headline unless it’s friendly (e.g. “Early career builder” is OK; “Debt stabilizer” → soften to “Focusing on debt and stability” or similar).
- If `learningMode === "explore"`, optionally add: “You chose to explore freely—here’s a suggested order based on your answers.”

**Tone constraints:** Calm, neutral, non-judgmental. No “you should” or “you need to.”

---

## Section 2: What This Means

**Purpose:** Explain in one or two sentences what this summary is and how to use it—no advice, just orientation.

**Input data used:** `learningMode`, `persona.id`.

**Output rules:**
- State that this is a suggested path based on their answers.
- State that they can follow the order or jump to any topic.
- If tailored: “We’ve ordered lessons to match where you are and what you said you care about.”
- If explore: “We’ve still suggested an order below—use it if you like, or browse any topic.”

**Tone constraints:** Informative only. No urgency, no “you must.”

---

## Section 3: Your Top Priorities (Ranked 1–3)

**Purpose:** Surface the top 3 focus areas from the priority engine with short, educational labels and one line each.

**Input data used:** `topPriorities[0..2]`, optionally `priorityScores` for consistency checks.

**Output rules:**
- Emit exactly 3 items when `topPriorities` has length ≥ 3.
- If fewer than 3, fill with next-highest non-suppressed areas (from priority engine) so the section always shows 3.
- Each item has: **rank** (1, 2, 3), **focus area key** (for linking), **display label** (from mapping below), **one-line description** (from mapping below).
- Do not add “you should do X” or “start with Y.” Use “A good place to start is …” or “Many people in your situation focus on …” only if needed; prefer neutral “This area covers ….”

**Focus area → display label + one-line description (stable mapping):**

| Key | Display label | One-line description |
|-----|----------------|----------------------|
| stabilize | Build a money foundation | Budgeting, emergency fund, and where to keep your money. |
| high_interest_debt | High-interest debt | Understanding and managing credit card and other high-interest debt. |
| student_loans | Student loan strategy | Repayment options, payoff vs invest, and planning ahead. |
| retirement_benefits | Retirement basics | 401(k), IRA, and making the most of employer benefits. |
| investing_basics | Investing basics | What investing is, risk, and diversification in plain English. |
| stocks_deep_dive | Stocks and ETFs | How stocks and index funds work and how people use them. |
| crypto_basics | Cryptocurrency basics | What crypto is and how it’s different from stocks—education only. |
| real_estate_mortgages | Real estate and mortgages | Renting vs buying, mortgages, and what you can afford. |
| str_basics | Short-term rentals | What STR is and what to consider before getting involved. |
| taxes_basics | Tax basics | What’s taken from your paycheck and how to stay on top of taxes. |
| insurance_basics | Insurance basics | Health, renters, and homeowners insurance in plain English. |
| side_income_basics | Side income basics | Freelance, 1099, and managing irregular income. |

**Tone constraints:** Labels and descriptions are educational only. No “you should prioritize X.”

---

## Section 4: What to Focus on Right Now

**Purpose:** One to three short bullets of “immediate focus” guidance—frameworks and questions, not specific advice.

**Input data used:** `derivedTiers`, `topPriorities`, `gatingFlags`, `persona.id`, `scoreDimensions` (e.g. emergencyPreparedness, debtUrgency).

**Output rules:**
- **If debtUrgencyTier === "High":** Include one bullet about understanding your debt and repayment options (education, not “pay X first”).
- **If emergencyPreparedness === 0 and resourceLevel ≤ 2:** Include one bullet about what an emergency fund is and why people build one first.
- **If investmentReadinessTier === "New" and topPriorities includes investing_basics:** Include one bullet that “investing basics” is a good next step before diving into stocks or crypto.
- **If persona is Home Buyer Planner:** Include one bullet about affordability and mortgage basics as a focus.
- **Maximum 3 bullets.** Prefer 2 when possible. Each bullet is one sentence; no “you should” or dollar amounts or product names.
- Use phrasing like: “Many people in your situation …”, “A common focus is …”, “It can help to understand …”, “Questions to explore: …”.

**Tone constraints:** Frameworks and themes only. No specific recommendations, no “do this now.”

---

## Section 5: Recommended Lessons (Ordered)

**Purpose:** Deliver the ordered lesson stack (6–12 lessons) that the user should see as “recommended” or “your path.”

**Input data used:** Output of **Lesson Stack Generation** (Part 3): ordered list of lesson slugs and optional metadata (title, domain, estimated time).

**Output rules:**
- Emit the list in order. Each item: slug, display title, optional domain label, optional time.
- If `learningMode === "explore"`, same list can be shown as “Suggested order” or “You might try this order” rather than “Your recommended path.”
- No commentary per lesson beyond title; no “you should take this next.”

**Tone constraints:** Neutral list. No advice in the list itself.

---

## Section 6: Explore Later

**Purpose:** Name 1–3 areas or topics that are available but not in the top priorities—so the user knows they can come back without feeling they “must” do them now.

**Input data used:** `topPriorities`, `gatingFlags`, full list of focus areas.

**Output rules:**
- **Suppressed areas (gatingFlags false):** If crypto or advanced investing or STR is gated, do not list them as “explore later” with a push—either omit or one line: “When you’re ready, we also have lessons on [X].” No implication they “should” get ready.
- **Non–top-3 areas:** Pick 1–2 areas that ranked 4–6 in priority (or that match persona but weren’t top 3). Label as “You can also explore” or “When you’re curious.”
- Maximum 2–3 “explore later” items. Use the same display labels as in Section 3.
- If the user selected “I want to learn about everything” (Q2), keep “explore later” short so the main list doesn’t feel dwarfed.

**Tone constraints:** Optional, low-pressure. No “you’ll need this later” or “don’t forget.”

---

## Section 7: Encouragement & Framing

**Purpose:** One or two sentences that reinforce agency, reduce shame, and keep the tone beginner-friendly.

**Input data used:** `persona.id`, `derivedTiers` (e.g. stabilityTier, debtUrgencyTier), optionally `confidence`.

**Output rules:**
- One sentence that normalizes their situation (e.g. “Lots of people start here,” “There’s no single right order,” “You can go at your own pace”).
- Optional second sentence that reinforces learning over outcomes (e.g. “Learning the basics first often makes the rest easier”).
- **Do not:** Promise results, use “you should feel good,” or imply they’re behind. **Do not:** “You’re on the right track” (can feel hollow). Prefer: “You can move at your own pace” / “There’s no one right order.”

**Tone constraints:** Calm, brief. Non-judgmental and non-preachy.

---

# PART 2 — PRIORITY TRANSLATION LOGIC

## From priorityScores to Summary

- **Top 3 priorities:** Already produced by Scoring Architecture v1 as `topPriorities`. Use as-is for Section 3. No re-ranking in the summary engine.
- **Suppressed priorities:** Any focus area for which `gatingFlags` or suppression in the priority engine set the score to 0 (or effectively suppressed) does not appear in top 3. Do not surface suppressed areas as “your top priority.”
- **Secondary opportunities:** Areas that ranked 4–6 in `priorityScores` (after sort) and are not gated. Use these for “Explore later” (Section 6). If there are fewer than 2, use 1 or 0; do not invent areas.

## Avoiding Overwhelm

- **Never show more than 3 “top priorities”** in the main summary. Secondary is “explore later,” not a second ranking.
- **Never show more than 12 lessons** in the recommended list. Prefer 6–10 for tailored mode.
- **One idea per bullet** in “What to focus on right now.” No nested lists.
- **No timelines** (“in 30 days,” “by next year”). No “steps 1–5” unless it’s the lesson list itself.

## Avoiding Prescriptive Language

- **Banned in summary copy:** “You should,” “You need to,” “You must,” “Start with,” “Don’t skip,” “Make sure to.”
- **Allowed:** “A good place to start is …,” “Many people in your situation focus on …,” “You might consider …,” “Questions to explore: …,” “This area covers ….”
- **Priorities:** Describe the area; do not tell the user to “tackle” or “do” it. Example: “High-interest debt” → “Understanding and managing credit card and other high-interest debt,” not “Pay off your credit cards first.”

## Avoiding Financial Advice

- **No:** Specific dollar amounts, allocation percentages, product names, “open an IRA at X,” “put 20% in Y,” “refinance now,” “pay extra on loan Z.”
- **Yes:** “Understanding how 401(k)s work,” “Learning about repayment options,” “Exploring what affordability means for you.”
- **Tradeoffs:** Phrase as “People often weigh …” or “A question many people ask is …” or “There are tradeoffs between ….” Never “You should pay off debt before investing” or “You should invest in index funds.”

---

# PART 3 — LESSON STACK GENERATION

## Goal

Produce an ordered list of **6–12 lesson slugs** (and optional metadata) that respects:
- `topPriorities` (order and identity)
- `gatingFlags` (exclude or demote gated content)
- `learningMode` (tailored = enforce order and gating; explore = suggest order but don’t hide)
- Prerequisites (conceptual: e.g. investing_basics before stocks_deep_dive when readiness is low)

## Inputs

- `topPriorities`: [area1, area2, area3]
- `gatingFlags`: { advancedInvesting, stocksDeepDive, crypto, strRealEstate }
- `learningMode`: "tailored" | "explore"
- **Lesson catalog:** A static or dynamic list of lessons, each with: `slug`, `title`, `domain` or `focusArea`, `estimatedMinutes`, optional `prereqSlugs` or `prereqFocusAreas`.

## Algorithm (pseudo-code)

```
LESSON_STACK(topPriorities, gatingFlags, learningMode, lessonCatalog):

  // 1) Build allowed focus areas
  allowedAreas = all focus areas
  if learningMode == "tailored":
    if !gatingFlags.stocksDeepDive:  remove lessons whose focusArea is "stocks_deep_dive" from consideration
    if !gatingFlags.crypto:           remove lessons whose focusArea is "crypto_basics"
    if !gatingFlags.advancedInvesting: remove lessons tagged "advanced_investing"
    if !gatingFlags.strRealEstate:   remove lessons whose focusArea is "str_basics" (or real_estate investing)
  else:
    // explore: no removal; all lessons allowed, but we still order by priorities

  // 2) Map focus areas to lesson slugs (from catalog)
  // Assume lessonCatalog has focusArea (or domain) per lesson.
  lessonsByArea = group lessonCatalog by focusArea (or primary domain)
  // Define area order: first topPriorities[0..2], then remaining in a fixed order (e.g. stabilize, credit_debt, investing_basics, ...)

  // 3) Select lessons per priority
  selectedSlugs = []
  for area in topPriorities:
    candidates = lessonsByArea[area] filtered by allowedAreas (if tailored)
    sort candidates by: recommended order within domain (e.g. "What is X" before "How to X")
    add up to 3 lessons from candidates to selectedSlugs (avoid duplicates)
    if len(selectedSlugs) >= 12: break

  // 4) If we have fewer than 6, fill from next-highest areas (from full priorityScores sort) that are allowed
  remainingAreas = all areas not in topPriorities, in descending priorityScore order
  for area in remainingAreas:
    if area not in allowedAreas and learningMode == "tailored": continue
    candidates = lessonsByArea[area] not already in selectedSlugs
    add up to 2 lessons from candidates until len(selectedSlugs) >= 6 or we've exhausted
    if len(selectedSlugs) >= 12: break

  // 5) Respect prerequisite order within selectedSlugs
  // If lesson A has prereqSlugs [B], ensure B appears before A in the list
  selectedSlugs = topologicalSort(selectedSlugs, lessonCatalog.prereqSlugs)

  // 6) Return ordered list with metadata
  return selectedSlugs.map(slug => ({ slug, title: catalog[slug].title, focusArea: catalog[slug].focusArea, estimatedMinutes: catalog[slug].estimatedMinutes }))
```

## Notes

- **Tailored:** Gated lessons are excluded from the stack. Result is 6–12 lessons from allowed areas only.
- **Explore:** No exclusions; same selection and ordering logic, but all areas are “allowed.” Label in UI as “suggested order” not “your path.”
- **Prerequisites:** If the catalog has `prereqSlugs`, run a topological sort so that prerequisite lessons appear before dependents. If no prereqs, order is: by topPriorities, then by domain order, then by recommended order within domain.
- **Count:** Aim 6–10 for tailored; up to 12 if the user has many priorities. Never return more than 12.

---

# PART 4 — EXAMPLE OUTPUTS

Three full examples: raw score summary, persona, priority ranking, summary output text, and ordered lesson list. Tone: calm, clear, non-judgmental, beginner-friendly, not preachy, no financial advice.

---

## Example 1: Early career, student loans, low investing experience

**Raw score summary (abbreviated):**
- lifeStage: 2, incomeStability: 2, resourceLevel: 2, debtUrgency: 2, emergencyPreparedness: 1, investmentReadiness: 0, confidence: 2, goalOrientation: 3  
- derivedTiers: investmentReadinessTier "New", debtUrgencyTier "Medium", stabilityTier "Somewhat Stable"  
- persona: Early Career Builder  
- topPriorities: ["student_loans", "retirement_benefits", "investing_basics"]  
- gatingFlags: stocksDeepDive false, crypto false, advancedInvesting false, strRealEstate true  

**Persona:** Early Career Builder  

**Priority ranking:** 1) Student loan strategy, 2) Retirement basics, 3) Investing basics  

**Summary output text:**

**Section 1 — Persona identity**  
Your situation fits an early-career builder: you’re in the first few years of work, have some stability, and are thinking about student loans, retirement, and investing.

**Section 2 — What this means**  
This summary suggests a path based on your answers. You can follow the order below or jump to any topic anytime.

**Section 3 — Your top priorities**  
1. **Student loan strategy** — Repayment options, payoff vs invest, and planning ahead.  
2. **Retirement basics** — 401(k), IRA, and making the most of employer benefits.  
3. **Investing basics** — What investing is, risk, and diversification in plain English.

**Section 4 — What to focus on right now**  
- Many people in your situation start by understanding their student loan repayment options and how that fits with other goals.  
- A common next step is learning how a 401(k) and employer match work, if you have access.  
- Investing basics are a good foundation before diving into stocks or other investments.

**Section 5 — Recommended lessons (ordered)**  
1. Student loans: what you’re actually signing  
2. Student loans: repayment options in plain English  
3. Student loans: pay off faster or invest?  
4. What is a 401(k) (and why the match is free money)  
5. Your benefits package: what’s in it and what to use first  
6. What is a stock (plain English)  
7. Why do stock prices change  
8. What is diversification  
9. Index funds and ETFs in plain English  

**Section 6 — Explore later**  
You can also explore: Real estate and mortgages · Tax basics  

**Section 7 — Encouragement**  
There’s no single right order. Go at your own pace and come back to any topic when it’s useful.

---

## Example 2: College student, no income, high curiosity

**Raw score summary (abbreviated):**  
- lifeStage: 1, incomeStability: 0, resourceLevel: 0, debtUrgency: 0, emergencyPreparedness: 0, investmentReadiness: 0, confidence: 2, goalOrientation: 0  
- derivedTiers: investmentReadinessTier "New", debtUrgencyTier "Low", stabilityTier "Unstable"  
- persona: Student Starter  
- topPriorities: ["stabilize", "credit_debt", "investing_basics"] (stabilize and credit first when no income; investing_basics as curiosity)  
- gatingFlags: stocksDeepDive false, crypto false, advancedInvesting false, strRealEstate false  

**Persona:** Student Starter  

**Priority ranking:** 1) Build a money foundation, 2) Credit & debt, 3) Investing basics  

**Summary output text:**

**Section 1 — Persona identity**  
You’re in a student starter situation: you’re in school or early work and building money habits from the ground up.

**Section 2 — What this means**  
We’ve suggested an order below based on your answers. You can follow it or explore any topic—whatever feels useful.

**Section 3 — Your top priorities**  
1. **Build a money foundation** — Budgeting, emergency fund, and where to keep your money.  
2. **Credit & debt** — Understanding credit scores and how to use credit without getting stuck.  
3. **Investing basics** — What investing is, risk, and diversification in plain English.

**Section 4 — What to focus on right now**  
- A good place to start is understanding what a budget is and how a simple system (like spend / save / later) can help.  
- Learning what a credit score is and how it’s used can help when you’re ready for a first card or loan.  
- Investing basics give you the big picture; you can dive into stocks or other topics when you’re ready.

**Section 5 — Recommended lessons (ordered)**  
1. Why money habits matter now  
2. What is a budget (and why it’s not punishment)  
3. Your money in 3 buckets  
4. What is a credit score (and why it’s not scary)  
5. How to check your credit (free and safe)  
6. Debit vs credit: when to use which  
7. What is a stock (plain English)  
8. Why do stock prices change  
9. What is diversification  

**Section 6 — Explore later**  
When you’re curious, you can also explore: Retirement basics · Tax basics  

**Section 7 — Encouragement**  
Lots of people start here. Learning the basics first often makes the rest easier when you’re ready.

---

## Example 3: Mid-career, stable income, wants to grow investments

**Raw score summary (abbreviated):**  
- lifeStage: 3, incomeStability: 4, resourceLevel: 3, debtUrgency: 0, emergencyPreparedness: 1, investmentReadiness: 2, confidence: 3, goalOrientation: 4  
- derivedTiers: investmentReadinessTier "Beginner", debtUrgencyTier "Low", stabilityTier "Stable"  
- persona: Growth-Oriented Beginner  
- topPriorities: ["stocks_deep_dive", "investing_basics", "retirement_benefits"]  
- gatingFlags: stocksDeepDive true, crypto true, advancedInvesting false, strRealEstate true  

**Persona:** Growth-Oriented Beginner  

**Priority ranking:** 1) Stocks and ETFs, 2) Investing basics, 3) Retirement basics  

**Summary output text:**

**Section 1 — Persona identity**  
Your situation fits a growth-oriented beginner: you’re on stable footing and want to understand investing and how to grow your money over time.

**Section 2 — What this means**  
We’ve ordered lessons below to match where you are and what you said you care about. You can follow this order or jump to any topic.

**Section 3 — Your top priorities**  
1. **Stocks and ETFs** — How stocks and index funds work and how people use them.  
2. **Investing basics** — What investing is, risk, and diversification in plain English.  
3. **Retirement basics** — 401(k), IRA, and making the most of employer benefits.

**Section 4 — What to focus on right now**  
- Many people in your situation focus on how stocks and index funds work before branching into other investments.  
- Understanding risk and diversification can help you make sense of different account types and choices.  
- A common question is how to balance retirement accounts with other investing—our retirement basics lessons cover the ideas.

**Section 5 — Recommended lessons (ordered)**  
1. What is a stock (plain English)  
2. Why do stock prices change  
3. What is diversification  
4. What is an index (and why it matters)  
5. Index funds and ETFs in plain English  
6. What is risk and volatility (for beginners)  
7. What is a 401(k) (and why the match is free money)  
8. What is an IRA (simple version)  
9. How much to save for retirement (simple targets)  
10. Real estate as investment (RE basics)  

**Section 6 — Explore later**  
You can also explore: Cryptocurrency basics · Tax basics  

**Section 7 — Encouragement**  
You can move at your own pace. There’s no one right order—pick what’s most useful for you right now.

---

# PART 5 — SAFETY + PRODUCT RULES

## Language that is not allowed

- **Directives:** “You should,” “You must,” “You need to,” “Don’t skip,” “Make sure to,” “Start with X.”
- **Advice:** “Open an IRA,” “Pay off this debt first,” “Put 20% in stocks,” “Refinance now,” “Get a high-yield account at X.”
- **Outcomes:** “You’ll be set,” “You’ll be ready for retirement,” “You’ll get out of debt faster.”
- **Judgment:** “You’re behind,” “You’re ahead,” “You should feel good,” “Most people don’t do this.”
- **Urgency:** “Do this before it’s too late,” “Act now,” “Time is running out.”
- **Product or provider names** as recommendations (e.g. “Use Vanguard” or “Sign up for Y”).

## How to avoid advice

- **Describe areas and concepts:** “This area covers …,” “Many people focus on …,” “A question people often ask is ….”
- **Offer frameworks, not decisions:** “People often weigh payoff speed vs. flexibility” instead of “You should pay off your highest-interest debt first.”
- **Use “learning” and “understanding”:** “Learning how 401(k)s work” instead of “Max out your 401(k).”
- **Tradeoffs:** Always frame as “there are tradeoffs” or “people consider” rather than “you should choose X.”

## How to phrase tradeoffs

- **Good:** “A question many people ask is whether to pay off debt faster or put money toward investing—there are tradeoffs.”  
- **Good:** “People often weigh building an emergency fund against paying extra on debt; both matter, and the order can depend on your situation.”  
- **Bad:** “You should pay off high-interest debt before investing.”  
- **Bad:** “Always build an emergency fund first.”

## How to prevent the summary from feeling generic

- **Use persona and priorities:** Section 1 and 3 must reflect the actual persona and top 3. No single boilerplate for everyone.
- **Vary “What to focus on right now” (Section 4):** Branch on debtUrgencyTier, emergencyPreparedness, investmentReadinessTier, and persona so at least one bullet is clearly situation-specific.
- **Vary encouragement (Section 7):** Choose from a small set of closing lines that fit stability and confidence (e.g. “Lots of people start here” for low stability; “You can move at your own pace” for stable/growth-oriented). Avoid one generic line for all.
- **Lesson list:** Always derived from the same algorithm and priorities so the stack is visibly different for different users (e.g. student vs. debt-focused vs. growth-oriented).

---

*End of Wilbur Summary Output Engine v1. Depends on Questionnaire Scoring Architecture v1 for inputs.*
