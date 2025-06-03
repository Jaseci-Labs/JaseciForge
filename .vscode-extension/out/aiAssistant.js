"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAssistant = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class AIAssistant {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async fixCode(fileContent, errorMessage, language = "typescript") {
        const prompt = `
You are an expert ${language} developer. The following code has a bug or syntax error:
---
${fileContent}
---
Error message: ${errorMessage}
Please return the corrected code only, with no explanation.
    `.trim();
        const response = await (0, node_fetch_1.default)("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 2048,
                temperature: 0,
            }),
        });
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }
        const data = (await response.json());
        const fixedCode = data.choices?.[0]?.message?.content;
        return fixedCode || null;
    }
}
exports.AIAssistant = AIAssistant;
//# sourceMappingURL=aiAssistant.js.map