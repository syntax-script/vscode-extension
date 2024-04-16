import * as path from "path";
import { workspace, ExtensionContext, window, commands } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {


  context.subscriptions.push(
    commands.registerCommand('syntaxs.reload', () => { client.restart().then(() => window.showInformationMessage('Succesfully reloaded language server!')).catch((e) => window.showErrorMessage(`Could not reload language server: ${e}`)); })
  );

  const serverModule = context.asAbsolutePath(
    path.join("server", "out", "server.js")
  );

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.stdio },
    debug: {
      module: serverModule,
      transport: TransportKind.stdio,
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "syx" }, { scheme: 'file', language: 'sys' }],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
    }
  };

  client = new LanguageClient(
    "syntax-script-lsp",
    "Syntax Script Language Server",
    serverOptions,
    clientOptions
  );

  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
