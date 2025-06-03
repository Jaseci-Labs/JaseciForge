import fetch from "node-fetch";

export class AIAssistant {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fixCode(
    fileContent: string,
    errorMessage: string,
    language: string = "typescript"
  ): Promise<string | null> {
    const prompt = `
You are an expert ${language} developer. The following code has a bug or syntax error:
---
${fileContent}
---
Error message: ${errorMessage}
Please return the corrected code only, with no explanation.
    `.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    const fixedCode = data.choices?.[0]?.message?.content;
    return fixedCode || null;
  }
}
