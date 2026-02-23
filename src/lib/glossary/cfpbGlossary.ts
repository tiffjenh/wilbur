/**
 * CFPB Youth Financial Education "Financial terms glossary" — local fast-path for highlight/chat.
 * Source: https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/glossary/
 * Entries use paraphrased short definitions; citations link to CFPB.
 */

export type GlossaryEntry = {
  term: string;
  normalized: string;
  short: string;
  url: string;
  domain: string;
  tier: 1;
};

const CFPB_GLOSSARY_URL =
  "https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/glossary/";

const domain = "consumerfinance.gov";

function norm(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/["""']/g, "")
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?]+$/g, "")
    .replace(/\((.*?)\)/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Same normalization used for glossary keys; use in API for matching. */
export function normalizeForGlossary(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/^["""'\s]+|["""'\s]+$/g, "")
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?]+$/g, "")
    .replace(/\((.*?)\)/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findGlossaryEntry(input: string, glossary: GlossaryEntry[] = CFPB_GLOSSARY): GlossaryEntry | null {
  if (!input?.trim()) return null;
  const exact = normalizeForGlossary(input);
  let entry = glossary.find((e) => e.normalized === exact) ?? null;
  if (entry) return entry;
  const stripped = input.replace(/^["""'\s]+|["""'\s]+$/g, "").trim();
  const bestEffort = normalizeForGlossary(stripped);
  entry = glossary.find((e) => e.normalized === bestEffort) ?? null;
  if (entry) return entry;
  const tokens = bestEffort.split(/\s+/).filter(Boolean);
  if (tokens.length >= 1) {
    const asPhrase = tokens.join(" ");
    entry = glossary.find((e) => e.normalized === asPhrase) ?? null;
  }
  return entry;
}

export function formatGlossaryAnswer(entry: GlossaryEntry): string {
  const bullets = entry.short.split(/(?<=[.!])\s+/).filter(Boolean).slice(0, 4);
  const bulletLines = bullets.length > 1 ? bullets.map((b) => `- ${b.trim()}`).join("\n") : `- ${entry.short}`;
  return `${entry.term}\n\n${bulletLines}\n\nSource: CFPB glossary`;
}

export const CFPB_GLOSSARY: GlossaryEntry[] = [
  { term: "529 plan", normalized: norm("529 plan"), short: "A tax-advantaged savings plan to help pay for education costs. There are prepaid tuition and savings versions.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "529 prepaid tuition plan", normalized: norm("529 prepaid tuition plan"), short: "A 529 option that lets you pay tuition ahead of time at today's rates for certain schools/systems.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "529 savings plan", normalized: norm("529 savings plan"), short: "A 529 option where you invest education savings; the value can rise or fall with the market.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Advertisement", normalized: norm("Advertisement"), short: "A message used to promote a product or service (online, TV, posters, etc.).", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Annual return", normalized: norm("Annual return"), short: "The profit or loss from an investment over a one-year period.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "APR (Annual Percentage Rate)", normalized: norm("APR Annual Percentage Rate"), short: "The yearly cost of borrowing money, expressed as a percentage.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Asset", normalized: norm("Asset"), short: "Something of value you own (like cash, property, or investments).", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "ATM", normalized: norm("ATM automated teller machine"), short: "A machine that lets you do basic bank transactions like withdrawals or deposits.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Automatic or direct debit", normalized: norm("Automatic or direct debit"), short: "A bill payment setup where a company pulls money from your account on a schedule.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Bank", normalized: norm("Bank"), short: "A business that accepts deposits, makes loans, and provides financial services.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Beneficiary", normalized: norm("Beneficiary"), short: "A person or organization designated to receive money/benefits (like from insurance).", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Benefit", normalized: norm("Benefit"), short: "Something provided by an employer, government, or insurer for a specific purpose (or an advantage).", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Bill-payment service", normalized: norm("Bill-payment service"), short: "A way to pay bills through a bank/app or directly through a company you owe.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Bond", normalized: norm("Bond"), short: "A type of debt investment: you lend money to an issuer who pays interest and repays principal at maturity.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Borrow", normalized: norm("Borrow"), short: "To receive something (often money) now with an agreement to pay/return it later.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Borrower", normalized: norm("Borrower"), short: "A person or organization that takes out a loan.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Budget", normalized: norm("Budget"), short: "A plan for your income and expenses over a period of time (a spending plan).", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Capital gain", normalized: norm("Capital gain"), short: "Money you make when you sell an investment for more than you paid.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Capital loss", normalized: norm("Capital loss"), short: "Money you lose when you sell an investment for less than you paid.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Cash", normalized: norm("Cash"), short: "Physical money: bills and coins.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Certificate of deposit (CD)", normalized: norm("Certificate of deposit CD"), short: "A bank/credit union savings product with a fixed term and fixed interest rate.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Checking account", normalized: norm("Checking account"), short: "A bank account used for everyday spending and bill payments.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Credit", normalized: norm("Credit"), short: "Borrowed money or buying now and paying later under agreed terms.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Credit card", normalized: norm("Credit card"), short: "A card that lets you borrow for purchases; you repay the issuer later (often monthly).", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Credit report", normalized: norm("Credit report"), short: "A record of your credit history used by lenders to evaluate you.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Credit score", normalized: norm("Credit score"), short: "A number that summarizes credit risk based on your credit history.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Compound interest", normalized: norm("Compound interest"), short: "Interest earned on both the original amount and the interest already added.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Debt", normalized: norm("Debt"), short: "Money you owe that you must pay back, usually with interest.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Debit card", normalized: norm("Debit card"), short: "A card that uses money from your bank account to pay for purchases or withdraw cash.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Deposit", normalized: norm("Deposit"), short: "Money added to a bank account.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Diversification", normalized: norm("Diversification"), short: "Spreading money across different investments to reduce risk from any single one.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Emergency fund", normalized: norm("Emergency fund"), short: "Money set aside for unexpected expenses like medical bills or job loss.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Employer benefits", normalized: norm("Employer benefits"), short: "Non-wage compensation from a job, like health insurance or retirement plans.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "FDIC", normalized: norm("FDIC"), short: "A U.S. government agency that insures certain bank deposits up to legal limits.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Fee", normalized: norm("Fee"), short: "A charge for a service (like account maintenance or ATM use).", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Inflation", normalized: norm("Inflation"), short: "When prices rise over time, reducing what the same amount of money can buy.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Interest", normalized: norm("Interest"), short: "Money paid for borrowing, or money earned for saving/investing.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Interest rate", normalized: norm("Interest rate"), short: "The percentage charged or earned on money over time.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "IRA", normalized: norm("IRA"), short: "An Individual Retirement Account: a tax-advantaged account for retirement savings.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Investment", normalized: norm("Investment"), short: "Putting money into something with the goal of earning more money over time.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Loan", normalized: norm("Loan"), short: "Money you borrow and agree to repay, usually with interest, over time.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Liquidity", normalized: norm("Liquidity"), short: "How quickly you can turn something into cash without losing much value.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Mortgage", normalized: norm("Mortgage"), short: "A loan used to buy a home, or to borrow against a home's value.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Mutual fund", normalized: norm("Mutual fund"), short: "A pooled investment that holds many assets; investors own shares of the fund.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Principal", normalized: norm("Principal"), short: "The original amount of money borrowed or invested, not including interest.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Roth IRA", normalized: norm("Roth IRA"), short: "A type of IRA where contributions are typically after-tax; qualified withdrawals can be tax-free.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Risk", normalized: norm("Risk"), short: "The chance that an outcome differs from what you expect (including losing money).", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Savings account", normalized: norm("Savings account"), short: "A bank account typically used to save money and earn interest.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Stock", normalized: norm("Stock"), short: "A share of ownership in a company; its value can rise or fall.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Tax", normalized: norm("Tax"), short: "Money collected by governments to fund public services.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
  { term: "Withholding", normalized: norm("Withholding"), short: "Money taken from paychecks for taxes and credited when you file a return.", url: CFPB_GLOSSARY_URL, domain, tier: 1 },
];
