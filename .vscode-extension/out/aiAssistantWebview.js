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
        const autoFixEnabled = this.context.globalState.get("autoFixEnabled", false);
        webviewView.webview.html = this.getHtml(apiKey, autoFixEnabled);
        webviewView.webview.onDidReceiveMessage(async (msg) => {
            if (msg.command === "saveKey") {
                await this.context.globalState.update("openaiApiKey", msg.key);
                webviewView.webview.html = this.getHtml(msg.key, this.context.globalState.get("autoFixEnabled", false));
            }
            if (msg.command === "toggleAutoFix") {
                await this.context.globalState.update("autoFixEnabled", msg.value);
                webviewView.webview.html = this.getHtml(this.context.globalState.get("openaiApiKey", ""), msg.value);
            }
        });
    }
    getHtml(apiKey, autoFixEnabled) {
        const autoFixLabel = autoFixEnabled ? "ON" : "OFF";
        const autoFixButton = `<button onclick="toggleAutoFix()">Auto Fix: <b>${autoFixLabel}</b></button>`;
        if (!apiKey) {
            return `
        <div style="padding: 1em;">
          <h3>Enter OpenAI API Key</h3>
          <input id="apiKey" type="password" style="width: 100%; margin-bottom: 0.5em;" />
          <button onclick="saveKey()">Save</button>
          <div style="margin-top:1em;">${autoFixButton}</div>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          function saveKey() {
            const key = document.getElementById('apiKey').value;
            vscode.postMessage({ command: 'saveKey', key });
          }
          function toggleAutoFix() {
            vscode.postMessage({ command: 'toggleAutoFix', value: !${autoFixEnabled} });
          }
        </script>
      `;
        }
        else {
            return `
        <div style="padding: 1em;">
          <h3>API Key registered ✅</h3>
          <div style="margin-top:1em;">${autoFixButton}</div>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          function toggleAutoFix() {
            vscode.postMessage({ command: 'toggleAutoFix', value: !${autoFixEnabled} });
          }
        </script>
      `;
        }
    }
}
exports.AIAssistantWebviewProvider = AIAssistantWebviewProvider;
//# sourceMappingURL=aiAssistantWebview.js.map