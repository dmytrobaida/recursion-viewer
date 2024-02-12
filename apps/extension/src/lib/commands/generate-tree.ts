import * as vscode from 'vscode';

import {
    build,
    parseValue,
    transformCallResultToCytoElements,
    visualize,
} from '@recursion-viewer/common';

export const generateTree = (context: vscode.ExtensionContext) =>
    async function (funcName: string, functionText: string) {
        const functions = build(functionText);
        const func = functions.find((f) => f.name === funcName);

        if (func == null) {
            vscode.window.showErrorMessage('Something went wrong!');
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
        const htmlDoc = visualize(transformed);
        const panel = vscode.window.createWebviewPanel(
            'recursion-viewer',
            'Recursion Viewer',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
            }
        );

        panel.iconPath = vscode.Uri.joinPath(
            context.extensionUri,
            'assets',
            'icon.svg'
        );
        panel.webview.html = htmlDoc;
    };
