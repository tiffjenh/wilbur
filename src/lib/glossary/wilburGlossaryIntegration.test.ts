/**
 * Integration test: highlight with glossary term returns 200 and glossary body without calling OpenAI.
 * Mocks fetch to assert it is not called when glossary matches.
 * Run: npm run test -- src/lib/glossary/wilburGlossaryIntegration.test.ts
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Wilbur API glossary fast-path", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    fetchMock = vi.fn(() => Promise.reject(new Error("fetch should not be called for glossary hit")));
    (globalThis as { fetch: unknown }).fetch = fetchMock;
    process.env.OPENAI_API_KEY = "sk-test-dummy";
  });

  afterEach(() => {
    (globalThis as { fetch: unknown }).fetch = originalFetch;
    delete process.env.OPENAI_API_KEY;
    vi.restoreAllMocks();
  });

  it("highlight with FDIC returns glossary answer and does not call fetch", async () => {
    const handler = (await import("../../../api/wilbur")).default;
    const res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const req = {
      method: "POST",
      body: {
        mode: "highlight",
        selectedText: "FDIC",
      },
      headers: {},
    };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "glossary",
        answer: expect.stringContaining("FDIC"),
        citations: expect.arrayContaining([
          expect.objectContaining({
            title: "CFPB Youth Financial Education Glossary",
            domain: "consumerfinance.gov",
          }),
        ]),
      })
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("highlight with Stocks returns glossary answer and does not call OpenAI", async () => {
    const handler = (await import("../../../api/wilbur")).default;
    const res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const req = {
      method: "POST",
      body: {
        mode: "highlight",
        selectedText: "Stocks",
      },
      headers: {},
    };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "glossary",
        glossaryTerm: "Stock",
        answer: expect.stringContaining("Stock"),
        citations: expect.arrayContaining([
          expect.objectContaining({
            title: "CFPB Youth Financial Education Glossary",
            domain: "consumerfinance.gov",
          }),
        ]),
      })
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
