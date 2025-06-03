"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAssistantWebviewProvider = void 0;
class AIAssistantWebviewProvider {
    constructor(context) {
        this.context = context;
    }
    resolveWebviewView(webviewView) {
        webviewView.webview.options = { enableScripts: true };
        const apiKey = this.context.globalState.get("openaiApiKey", "");
        webviewView.webview.html = this.getHtml(apiKey);
        webviewView.webview.onDidReceiveMessage(async (msg) => {
            if (msg.command === "saveKey") {
                await this.context.globalState.update("openaiApiKey", msg.key);
                webviewView.webview.html = this.getHtml(msg.key); // Mask or show confirmation
            }
        });
    }
    getHtml(apiKey) {
        if (!apiKey) {
            return `
        <div style="padding: 1em;">
          <h3>Enter OpenAI API Key</h3>
          <input id="apiKey" type="password" style="width: 100%; margin-bottom: 0.5em;" />
          <button onclick="saveKey()">Save</button>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          function saveKey() {
            const key = document.getElementById('apiKey').value;
            vscode.postMessage({ command: 'saveKey', key });
          }
        </script>
      `;
        }
        else {
            return `<div style="padding: 1em;"><h3>API Key registered ✅</h3></div>`;
        }
    }
}
exports.AIAssistantWebviewProvider = AIAssistantWebviewProvider;
//# sourceMappingURL=aiAssistantWebview.js.map