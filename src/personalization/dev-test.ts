import { getPersonalization } from "./index";

const testProfile = {
  learningMode: "tailored",
  topicsInterestedIn: ["Investing basics", "Retirement (401k, IRA)", "Stocks & ETFs"],
  lifeStage: "early_career",
  incomeType: ["w2"],
  incomeRange: "50_100",
  financialSituation: [
    "student_loans",
    "credit_card_debt",
    "never_invested",
    "want_buy_home"
  ],
  confidence: 2,
  investingExperience: "never",
  primaryGoal: "start_investing",
  state: "NY"
};

const result = getPersonalization(testProfile as any);

console.log("PERSONA:", result.persona);
console.log("TOP PRIORITIES:", result.topPriorities);
console.log("DOMAIN VISIBILITY:", result.domainVisibility);
console.log("GATING:", result.gating);
console.log("SUMMARY:", result.summary);
