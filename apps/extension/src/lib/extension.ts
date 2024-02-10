import * as vscode from 'vscode';

import { encode } from '@recursion-viewer/common';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'recursion-viewer.helloWorld',
        () => {
            const encoded = encode({ hello: 1 });

            vscode.window.showInformationMessage('Hello From NX!' + encoded);
        }
    );

    context.subscriptions.push(disposable);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
