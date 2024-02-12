import * as vscode from 'vscode';

import { ViewRecursionProvider } from './codelens/view-recursion-provider';
import { generateTree } from './commands/generate-tree';

export function activate(context: vscode.ExtensionContext) {
    const viewRecursionProvider = new ViewRecursionProvider();

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'recursion-viewer.generate',
            generateTree(context)
        )
    );

    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            [
                {
                    language: 'typescript',
                    scheme: 'file',
                },
                {
                    language: 'javascript',
                    scheme: 'file',
                },
            ],
            viewRecursionProvider
        )
    );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
