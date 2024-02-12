import * as vscode from 'vscode';

import {
    build,
    parseValue,
    transformCallResultToCytoElements,
    visualize,
} from '@recursion-viewer/common';

import { ViewRecursionProvider } from './codelens/view-recursion-provider';

export function activate(context: vscode.ExtensionContext) {
    const viewRecursionProvider = new ViewRecursionProvider();

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'recursion-viewer.generate',
            async (funcName, functionText) => {
                const functions = build(functionText);
                const func = functions.find((f) => f.name === funcName);

                if (func == null) {
                    // TODO: add error handling
                    console.log('Something went wrong!');
                    return;
                }

                const params = [];

                for (const p of func.parameters) {
                    const val = await vscode.window.showInputBox({
                        title: `Please enter function parameter ${p.name} = `,
                        value: '0',
                        valueSelection: [0, 2],
                    });

                    const parsed = parseValue(val);
                    params.push(parsed);
                }

                const result = func.run(...params);
                const transformed = transformCallResultToCytoElements(
                    result,
                    func.name
                );
                const htmlDoc = visualize('v2', transformed);
                const panel = vscode.window.createWebviewPanel(
                    'recursion-viewer',
                    'Recursion Tree',
                    vscode.ViewColumn.One,
                    {
                        enableScripts: true,
                    }
                );

                panel.webview.html = htmlDoc;
            }
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
