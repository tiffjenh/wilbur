# Wilbur Questionnaire Scoring Architecture v1

Implementation-ready spec for deterministic scoring, classification, and lesson-ranking inputs from the existing questionnaire. Product logic only.

---

## 1) Scoring Dimensions (8)

All dimensions use a **0–4** scale unless noted. Higher = more of that signal.

| Dimension | Scale | Low (0–1) means | High (3–4) means | Why it matters |
|-----------|--------|------------------|-------------------|------------------|
| **LifeStage** | 0–4 | Pre-work / student | Established / retired | Drives persona and which life-stage track to suggest. |
| **IncomeStability** | 0–4 | No income / irregular | W-2 or steady 1099 | Affects “stabilize first” vs “invest” emphasis. |
| **ResourceLevel** | 0–4 | Low income, no emergency fund | Higher income, has emergency fund | Suppresses advanced topics when low. |
| **DebtUrgency** | 0–4 | No debt / manageable | High-interest or multiple debt types | Gates investing emphasis; raises “debt” priority. |
| **EmergencyPreparedness** | 0–2 | No emergency fund | Has emergency fund | Gate: don’t push investing before basics. |
| **InvestmentReadiness** | 0–4 | Never invested, low confidence | Invests regularly or advanced | Gates stocks deep dive, crypto, advanced investing. |
| **Confidence** | 0–4 | Very lost (1) | Very confident (5 → map to 4) | Soft gate; low confidence suppresses advanced. |
| **GoalOrientation** | 0–4 | “I’m not sure” / diffuse | Single clear goal (e.g. home, retire early) | Biases priority ranking toward that goal. |

**Notes:**
- Confidence uses Q7 raw 1–5; we map 1→0, 2→1, 3→2, 4→3, 5→4 for the 0–4 scale.
- EmergencyPreparedness is 0 or 1 (or 2 if we add “fully funded” later); for v1 use 0 = no, 1 = yes.

---

## 2) Answer → Score Mapping

### Q1 — Learning Mode (single select)

| Answer | Effect | Notes |
|--------|--------|--------|
| Tailored lessons to my situation | `learningMode = "tailored"` | Use scores for gating, ordering, persona, priorities. |
| Explore all lessons freely | `learningMode = "explore"` | Compute all scores in background; **do not** apply gating or priority ordering to recommendations. Store scores for future use if user switches to tailored. |

No dimension scores are set by Q1. It only sets the mode that controls whether scores affect UI.

---

### Q2 — Topics Interested In (multi-select)

**Rule:** Q2 does **not** set readiness or urgency. It only produces **interest weights** used later for lesson ranking (light bias). No direct changes to LifeStage, DebtUrgency, InvestmentReadiness, or EmergencyPreparedness.

| Option | Use in scoring | Notes |
|--------|----------------|--------|
| Budgeting & saving | Interest weight: `budgeting_saving += 1` | Bias lesson ranking. |
| Credit & debt | Interest weight: `credit_debt += 1` | Bias lesson ranking. |
| Investing basics | Interest weight: `investing_basics += 1` | Bias lesson ranking. |
| Stocks & ETFs | Interest weight: `stocks_etfs += 1` | Bias lesson ranking. |
| Advanced investing (options, trading) | Interest weight: `advanced_investing += 1` | Still gated by InvestmentReadiness; interest only. |
| Retirement (401k, IRA) | Interest weight: `retirement += 1` | Bias lesson ranking. |
| Taxes | Interest weight: `taxes += 1` | Bias lesson ranking. |
| Real estate & mortgages | Interest weight: `real_estate += 1` | Bias lesson ranking. |
| Short-term rentals (Airbnb/VRBO) | Interest weight: `str += 1` | Bias lesson ranking. |
| Cryptocurrency | Interest weight: `crypto += 1` | Still gated; interest only. |
| Side income / entrepreneurship | Interest weight: `side_income += 1` | Bias lesson ranking. |
| Insurance & risk | Interest weight: `insurance += 1` | Bias lesson ranking. |
| I don’t know what any of these are | Set all interest weights to **0.5** (equal light interest) | Don’t overweight any area. |
| I want to learn about everything | Set all interest weights to **1.0** (equal) | Don’t overweight any area. |

**Conflict:** If both “I don’t know” and “I want to learn about everything” are selected, treat as “I want to learn about everything” (all weights 1.0). If “I don’t know” is selected with any other topic, ignore “I don’t know” and use the other selections only.

**Output:** A map `interestWeights: Record<string, number>` with keys for each topic area (e.g. `budgeting_saving`, `stocks_etfs`, …). Default 0; add 1 per selected option (or 0.5 / 1.0 for the two special options above). Used in Priority Engine and lesson ranking only.

---

### Q3 — Life Stage (single select)

| Answer | LifeStage | Notes |
|--------|-----------|--------|
| High school student | 0 | Pre-work. |
| College student | 1 | Student. |
| Early career (0–5 years) | 2 | Early career. |
| Mid-career professional | 3 | Established. |
| Business owner / self-employed | 3 | Treated as established for stage. |
| Exploring career change | 2 | Treated like early/mid transition. |
| Retired | 4 | Later stage. |
| Prefer not to say | 2 | Neutral middle. |

---

### Q4 — Income Type (multi-select)

| Answer | IncomeStability adjustment | Notes |
|--------|----------------------------|--------|
| W-2 job | +1 | Steady employment. |
| 1099 / freelance | +0.5 | Less stable than W-2. |
| Business owner | +0.5 | Variable. |
| Investment income | +0.5 | Assume some stability. |
| Not earning income yet | 0 (no change) | Low stability. |
| Other | 0 (no change) | Neutral. |

**Aggregation:** Sum adjustments; cap **IncomeStability** at 4. If “Not earning income yet” is selected with any other, still sum others (e.g. W-2 + Not earning = treat as W-2 only, ignore “Not earning” for this dimension). If **only** “Not earning income yet” or “Other”: set IncomeStability from this question to 0 (rest of IncomeStability can still come from Q5/Q6).

**Simplified rule for v1:**  
- Any “W-2 job” → IncomeStability += 1 (max 4).  
- Only 1099/freelance or business owner (no W-2) → IncomeStability += 0.5.  
- Only “Not earning” or “Other” → no change to IncomeStability from Q4.

---

### Q5 — Income Range (single select)

| Answer | ResourceLevel adjustment | Notes |
|--------|--------------------------|--------|
| Under $25,000 | 0 | Low resources. |
| $25k–$50k | 1 | Moderate. |
| $50k–$100k | 2 | Moderate–good. |
| $100k–$200k | 3 | Good. |
| $200k+ | 4 | High (cap at 4). |
| Prefer not to say | 1 | Neutral; assume moderate. |

This sets a **base** for ResourceLevel. Q6 can add or subtract (e.g. emergency fund adds, no emergency fund doesn’t add).

---

### Q6 — Current Financial Situation (multi-select)

**Conflict resolution (apply in order):**

1. If both “I have no debt” and any of “I have student loans” / “I have credit card debt” are selected: **ignore “I have no debt.”** Use the debt options that are selected.
2. All other combinations: use each selected option’s effect below.

| Option | DebtUrgency | EmergencyPreparedness | ResourceLevel | InvestmentReadiness | Notes |
|--------|-------------|------------------------|---------------|---------------------|--------|
| I have student loans | +1 | — | — | — | Debt signal. |
| I have credit card debt | +2 | — | — | — | Higher urgency. |
| I have no debt | 0 (set DebtUrgency contribution from debt to 0) | — | +0.5 | — | Only if not overridden by conflict rule above. |
| I have an emergency fund | — | 1 | +0.5 | — | Gate input. |
| I invest regularly | — | — | — | +2 | Readiness. |
| I’ve never invested before | — | — | — | 0 (no change) | Baseline. |
| I own property | — | — | +0.5 | +0.5 | Resources + slight readiness. |
| I want to buy a home | — | — | — | — | No dimension change; used in GoalOrientation (Q9) and priority engine. |

**DebtUrgency from Q6 only:**  
- Student loans only: +1.  
- Credit card debt only: +2.  
- Both: +2 (cap at 4 when combined with other sources).  
- Neither (and “I have no debt” not overridden): 0 from debt part of Q6.

**InvestmentReadiness from Q6:**  
- “I invest regularly” → +2.  
- “I’ve never invested before” → no change (0 from this question).  
- “I own property” → +0.5.  
- Sum and cap InvestmentReadiness at 4 after all questions.

**EmergencyPreparedness:**  
- “I have an emergency fund” selected → 1; else 0. (No partial; binary for v1.)

---

### Q7 — Confidence Level (slider 1–5)

| Raw value | Confidence (0–4) | Notes |
|-----------|------------------|--------|
| 1 | 0 | Very lost. |
| 2 | 1 | |
| 3 | 2 | |
| 4 | 3 | |
| 5 | 4 | Very confident. |

Store both raw (1–5) and normalized (0–4) if needed for display; use 0–4 for all logic.

---

### Q8 — Investing Experience (single select)

| Answer | InvestmentReadiness adjustment | Notes |
|--------|---------------------------------|--------|
| I’ve never invested | 0 | Baseline. |
| I’ve used a brokerage app | +1 | Beginner. |
| I understand ETFs and index funds | +2 | Beginner+. |
| I actively trade | +3 | Ready for deep dives. |
| I trade options or advanced strategies | +3 | Ready; still gated by explicit gate rules. |
| (if missing) | 0 | Default. |

Add to InvestmentReadiness; then cap at 4. This is a **strong** signal; Q2 interest does not change InvestmentReadiness.

---

### Q9 — Primary Financial Goal (single select)

| Answer | GoalOrientation | Priority area bias | Notes |
|--------|-----------------|--------------------|--------|
| Build savings | 2 | stabilize | Clear but foundational. |
| Pay off debt | 3 | high_interest_debt or student_loans | Strong; raises debt priority. |
| Start investing | 3 | investing_basics | Clear. |
| Grow investments faster | 4 | stocks_deep_dive | Advanced goal. |
| Save for a home | 4 | real_estate_mortgages | Clear. |
| Build passive income | 3 | investing_basics / side_income | Clear. |
| Retire early | 4 | retirement_benefits, investing_basics | Clear. |
| I’m not sure | 0 | (none) | No bias. |

**GoalOrientation scale 0–4:** Use the value in the “GoalOrientation” column above as the **contribution** from Q9. (Other dimensions don’t set GoalOrientation; this question is the primary source.)

**Priority area bias:** Used in Priority Engine to add weight to the corresponding focus area(s) when computing PriorityScore(area).

---

### Q10 — State (optional)

| Handling | Notes |
|----------|--------|
| Selected state | Store as `state: string` (e.g. "CA"). Use for future state-specific content or links; **no effect** on dimensions, persona, or gating in v1. |
| Prefer not to say / not answered | `state: null`. |

No dimension scores depend on Q10.

---

## 3) Aggregation and Caps

After applying all mappings:

- **LifeStage:** 0–4 (from Q3 only).
- **IncomeStability:** 0–4. Sum from Q4 (+ Q3 if we ever add); cap at 4.
- **ResourceLevel:** 0–4. Start from Q5 base; add Q6 adjustments; cap at 4.
- **DebtUrgency:** 0–4. Sum from Q6 (and Q9 “Pay off debt” if we add +1); cap at 4.
- **EmergencyPreparedness:** 0 or 1 (from Q6 only).
- **InvestmentReadiness:** 0–4. Sum Q6 + Q8; cap at 4.
- **Confidence:** 0–4 (from Q7 mapping only).
- **GoalOrientation:** 0–4 (from Q9 only).

---

## 4) Derived Tiers (Computed Outputs)

All derived from the eight dimensions. Deterministic.

### Investment Readiness Tier

| Tier | Condition | Use |
|------|-----------|-----|
| **New** | InvestmentReadiness in [0, 1] | No stocks deep dive, no crypto, no advanced investing. |
| **Beginner** | InvestmentReadiness = 2 | Stocks basics and investing basics OK; no crypto, no advanced. |
| **Beginner+** | InvestmentReadiness = 3 | Stocks deep dive OK; crypto and advanced still gated by gate rules. |
| **Ready for Deep Dives** | InvestmentReadiness = 4 | All investing content allowed if gating flags pass. |

### Debt Urgency Tier

| Tier | Condition | Use |
|------|-----------|-----|
| **Low** | DebtUrgency in [0, 1] | No suppression of investing. |
| **Medium** | DebtUrgency = 2 | Slightly deprioritize “grow investments”; prioritize debt/stabilize. |
| **High** | DebtUrgency in [3, 4] | Strongly prioritize debt and stabilize; suppress investing growth in top priorities. |

### Stability Tier

| Tier | Condition | Use |
|------|-----------|-----|
| **Unstable** | IncomeStability ≤ 1 **or** ResourceLevel ≤ 1 | Emphasize stabilize, emergency fund; suppress advanced. |
| **Somewhat Stable** | IncomeStability in [2, 3] **or** ResourceLevel = 2 | Normal logic. |
| **Stable** | IncomeStability = 4 **and** ResourceLevel ≥ 3 | No suppression from stability. |

**Tie-breaker:** If IncomeStability and ResourceLevel point to different tiers, use the **lower** tier (more conservative).

---

## 5) Persona Model (8 Personas)

**Tie-breaker order:** Evaluate personas in the order listed below. **First** matching persona wins. So order matters: more specific personas first, then generic.

**Edge cases:**
- **Prefer not to say** on Q3 / Q5: use neutral LifeStage or ResourceLevel as defined in mappings; still assign a persona.
- **Minimal data:** If Q3 or Q9 is missing, use LifeStage = 2 and GoalOrientation = 0; continue with thresholds.

**Evaluation order (first match wins):** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → Default.

### Persona 1: Student Starter

- **Who:** High school or college, first job or part-time. Building habits and basics.
- **Condition:** LifeStage in [0, 1].

### Persona 2: Debt Stabilizer

- **Who:** Meaningful debt (cards and/or student loans); getting stable is the focus.
- **Condition:** DebtUrgency ≥ 3 **and** LifeStage in [1, 2, 3].
- **Tie-breaker:** Evaluated before Early Career Builder so high-debt users get this persona.

### Persona 3: Home Buyer Planner

- **Who:** Actively saving for a home or planning to buy.
- **Condition:** Q9 = “Save for a home” **or** (Q6 includes “I want to buy a home” **and** GoalOrientation ≥ 3).
- **Tie-breaker:** If both Growth-Oriented and Home Buyer match, prefer **Home Buyer Planner** if Q9 = “Save for a home”; else Growth-Oriented.

### Persona 4: Independent Earner

- **Who:** 1099, business owner, or side income as primary; different tax and benefit reality.
- **Condition:** Q4 includes “1099 / freelance” **or** “Business owner” **and** no “W-2 job” **and** LifeStage in [2, 3].
- **Tie-breaker:** When income type is 1099/business only, prefer over Early Career Builder.

### Persona 5: Benefit-Confused Professional

- **Who:** Mid-career, W-2, but “I’m not sure” or diffuse goals; may not be using benefits well.
- **Condition:** LifeStage = 3 **and** GoalOrientation ≤ 1 **and** IncomeStability ≥ 2.

### Persona 6: Catch-Up Builder

- **Who:** Mid-career or later, behind on savings or retirement; “It’s not too late” message.
- **Condition:** LifeStage ≥ 3 **and** (InvestmentReadiness ≤ 2 **or** ResourceLevel ≤ 2) **and** GoalOrientation ≥ 2.
- **Tie-breaker:** If both Catch-Up and Benefit-Confused match, prefer **Catch-Up Builder** when GoalOrientation ≥ 2.

### Persona 7: Growth-Oriented Beginner

- **Who:** Wants to invest or grow money; low or moderate investing experience; not dominated by debt.
- **Condition:** InvestmentReadiness in [1, 2] **and** DebtUrgency ≤ 2 **and** Q9 in {Start investing, Grow investments faster, Build passive income, Retire early}.

### Persona 8: Early Career Builder

- **Who:** 0–5 years in workforce, W-2 or similar. Maximizing benefits and starting to invest.
- **Condition:** LifeStage = 2 **and** (IncomeStability ≥ 1 **or** ResourceLevel ≥ 1).
- **Tie-breaker:** Default when no prior persona matches.

**Default (if no persona 1–8 matches):** Assign **Early Career Builder** if LifeStage = 2; else **Growth-Oriented Beginner** if InvestmentReadiness ≥ 1 and Q9 in investing set; else **Early Career Builder**.

---

## 6) Priority Engine (Ranked Focus Areas)

### Focus areas (list)

- `stabilize` — Cash flow, emergency fund, budgeting  
- `high_interest_debt` — Credit card and high-interest debt  
- `student_loans` — Student loan strategy  
- `retirement_benefits` — 401(k), IRA, HSA basics  
- `investing_basics` — What is investing, risk, diversification  
- `stocks_deep_dive` — Stocks, ETFs, index funds in depth  
- `crypto_basics` — Crypto education  
- `real_estate_mortgages` — Buying a home, mortgages  
- `str_basics` — Short-term rentals  
- `taxes_basics` — Tax basics  
- `insurance_basics` — Insurance basics  
- `side_income_basics` — Side income / entrepreneurship  

### PriorityScore(area) formula

```
PriorityScore(area) =
  baseWeight(area)           // 0–1 from persona + goal fit
  + interestWeight(area)     // 0–1 from Q2, normalized
  + goalBias(area)           // 0 or 0.3 if Q9 matches this area
  - suppression(area)        // 0 or large (e.g. 2) if gated/suppressed
```

- **baseWeight(area):** From persona and default priorities (e.g. Debt Stabilizer → high base for `stabilize`, `high_interest_debt`, `student_loans`). Define a 12-column table per persona (one weight per area, 0–1).
- **interestWeight(area):** Map Q2 keys to these areas; use stored `interestWeights`; normalize so max = 1 across areas (e.g. divide by max).
- **goalBias(area):** If Q9 matches area (e.g. “Save for a home” → `real_estate_mortgages`), add 0.3.
- **suppression(area):** If gating says “don’t recommend,” add 2 (or set score to 0). See Section 7.

### Suppression rules (before ranking)

- If **DebtUrgency ≥ 3:** suppression(stocks_deep_dive) = 2, suppression(crypto_basics) = 2, suppression(advanced_investing) = 2. Reduce (don’t zero) retirement_benefits and investing_basics by 0.5 so stabilize and debt rank higher.
- If **EmergencyPreparedness = 0** and **ResourceLevel ≤ 2:** suppression(stocks_deep_dive) = 1, suppression(crypto_basics) = 1. Boost stabilize base weight.
- If **Investment Readiness Tier = New:** suppression(stocks_deep_dive) = 2, suppression(crypto_basics) = 2.
- If **Investment Readiness Tier = Beginner:** suppression(crypto_basics) = 2.
- Apply **explicit gating flags** from Section 7: if a module is gated off, set its suppression = 2.

### Top 3 selection

1. Compute PriorityScore(area) for all 12 areas.  
2. Sort descending.  
3. Take top 3.  
4. If fewer than 3 have score > 0, fill with next highest (can be 0) so that we always return 3 areas.  
5. Output as `topPriorities: [area1, area2, area3]` and optionally `priorityScores: Record<string, number>` for debugging.

---

## 7) Gating Rules (Unlock / Suppress)

Gates produce **boolean flags** per content area. If a flag is false, that content is **suppressed** (not recommended in top priorities; can be hidden or de-emphasized in UI).

### Advanced investing (options, trading)

- **Show only if:** InvestmentReadiness ≥ 3 **and** Confidence ≥ 2 **and** DebtUrgency ≤ 2 **and** (EmergencyPreparedness = 1 **or** ResourceLevel ≥ 2).
- **Default:** Suppress (gate = false) unless all conditions above hold.

### Stocks deep dive

- **Show only if:** InvestmentReadiness ≥ 2 **and** DebtUrgency ≤ 3 **and** (EmergencyPreparedness = 1 **or** ResourceLevel ≥ 2).
- **Default:** Suppress if InvestmentReadiness &lt; 2 or DebtUrgency &gt; 3.

### Crypto

- **Show only if:** InvestmentReadiness ≥ 2 **and** Confidence ≥ 2 **and** DebtUrgency ≤ 2 **and** (EmergencyPreparedness = 1 **or** ResourceLevel ≥ 2).
- **Default:** Suppress if any condition fails.

### STR / Real estate investing (STR basics, real estate as investment)

- **Show only if:** ResourceLevel ≥ 2 **and** DebtUrgency ≤ 2 **and** (LifeStage ≥ 2).
- **Default:** Suppress if ResourceLevel &lt; 2 or DebtUrgency &gt; 2.

**Output:** Set `gatingFlags.advancedInvesting`, `gatingFlags.stocksDeepDive`, `gatingFlags.crypto`, `gatingFlags.strRealEstate` to true/false. When `learningMode === "explore"`, these flags can be computed but **not** used to hide content (explore = see everything); when `learningMode === "tailored"`, use them to suppress and to apply suppression in PriorityScore.

---

## 8) Output Schema (Implementation Notes)

Proposed JSON shape returned after questionnaire submission. Stable and versioned.

```json
{
  "version": "1",
  "learningMode": "tailored" | "explore",
  "rawAnswers": {
    "q1": "Tailored lessons to my situation" | "Explore all lessons freely",
    "q2": ["Budgeting & saving", "..."],
    "q3": "Early career (0–5 years)",
    "q4": ["W-2 job"],
    "q5": "$50k–$100k",
    "q6": ["I have an emergency fund", "..."],
    "q7": 3,
    "q8": "I've never invested",
    "q9": "Start investing",
    "q10": "CA" | null
  },
  "scoreDimensions": {
    "lifeStage": 2,
    "incomeStability": 2,
    "resourceLevel": 2,
    "debtUrgency": 1,
    "emergencyPreparedness": 1,
    "investmentReadiness": 0,
    "confidence": 2,
    "goalOrientation": 3
  },
  "derivedTiers": {
    "investmentReadinessTier": "New" | "Beginner" | "Beginner+" | "Ready for Deep Dives",
    "debtUrgencyTier": "Low" | "Medium" | "High",
    "stabilityTier": "Unstable" | "Somewhat Stable" | "Stable"
  },
  "persona": {
    "id": "early_career_builder" | "debt_stabilizer" | "student_starter" | "home_buyer_planner" | "catch_up_builder" | "growth_oriented_beginner" | "benefit_confused_professional" | "independent_earner",
    "name": "Early Career Builder"
  },
  "topPriorities": ["stabilize", "investing_basics", "retirement_benefits"],
  "priorityScores": {
    "stabilize": 1.2,
    "investing_basics": 1.0,
    "retirement_benefits": 0.9
  },
  "recommendationWeights": {
    "interestWeights": { "budgeting_saving": 1, "stocks_etfs": 1 },
    "goalArea": "investing_basics",
    "personaFocusAreas": ["retirement_benefits", "investing_basics"]
  },
  "gatingFlags": {
    "advancedInvesting": false,
    "stocksDeepDive": false,
    "crypto": false,
    "strRealEstate": true
  },
  "state": "CA" | null
}
```

**Field notes:**

- **rawAnswers:** Exact option strings (or array for multi-select); q7 is number 1–5.
- **scoreDimensions:** All 0–4 except emergencyPreparedness 0–1.
- **derivedTiers:** From Section 4.
- **persona:** id = snake_case key; name = display label.
- **topPriorities:** Ordered array of 3 focus area keys.
- **priorityScores:** Optional; full map of area → score for debugging.
- **recommendationWeights:** Inputs for lesson-ranking: interestWeights from Q2, goalArea from Q9, personaFocusAreas from persona’s default areas. Lesson rank = f(priority, interestWeights, personaFocusAreas, gatingFlags).
- **gatingFlags:** Used when learningMode is tailored; when explore, can still be present but not used to hide content.
- **state:** From Q10; null if not provided or “Prefer not to say.”

**Versioning:** Include `version: "1"` so future changes can branch logic (e.g. v2 mappings) without breaking clients.

---

*End of Wilbur Questionnaire Scoring Architecture v1.*
