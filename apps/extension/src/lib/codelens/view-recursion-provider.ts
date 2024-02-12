import * as vscode from 'vscode';
import ts from 'typescript';

function getCommand(funcName: string, functionText: string): vscode.Command {
    return {
        title: 'Generate recursion tree',
        tooltip: 'Generate recursion tree',
        command: 'recursion-viewer.generate',
        arguments: [funcName, functionText],
    };
}

export class ViewRecursionProvider implements vscode.CodeLensProvider {
    private onDidChangeCodeLensesEmitter: vscode.EventEmitter<void> =
        new vscode.EventEmitter<void>();

    public readonly onDidChangeCodeLenses: vscode.Event<void> =
        this.onDidChangeCodeLensesEmitter.event;

    constructor() {
        vscode.workspace.onDidChangeTextDocument(() => {
            this.onDidChangeCodeLensesEmitter.fire();
        });
    }

    public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
        const src = document.getText();
        const srcFile = ts.createSourceFile(
            'src.ts',
            src,
            ts.ScriptTarget.Latest
        );
        const codeLenses: vscode.CodeLens[] = [];

        srcFile.forEachChild((node) => {
            if (ts.isFunctionDeclaration(node)) {
                const { line, character } =
                    srcFile.getLineAndCharacterOfPosition(
                        node.getStart(srcFile)
                    );

                const documentLine = document.lineAt(line);
                const position = new vscode.Position(
                    documentLine.lineNumber,
                    character
                );
                const range = document.getWordRangeAtPosition(position);

                if (range != null && node.name != null && node.body != null) {
                    codeLenses.push(
                        new vscode.CodeLens(
                            range,
                            getCommand(node.name.text, src)
                        )
                    );
                }
            }
        });

        return codeLenses;
    }

    public resolveCodeLens(codeLens: vscode.CodeLens) {
        return codeLens;
    }
}
