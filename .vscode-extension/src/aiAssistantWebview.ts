import * as vscode from "vscode";

export class AIAssistantWebviewProvider implements vscode.WebviewViewProvider {
  constructor(private context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = { enableScripts: true };
    const apiKey = this.context.globalState.get<string>("openaiApiKey", "");
    webviewView.webview.html = this.getHtml(apiKey);

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (msg.command === "saveKey") {
        await this.context.globalState.update("openaiApiKey", msg.key);
        webviewView.webview.html = this.getHtml(msg.key); // Mask or show confirmation
      }
    });
  }

  getHtml(apiKey: string) {
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
    } else {
      return `<div style="padding: 1em;"><h3>API Key registered ✅</h3></div>`;
    }
  }
}
