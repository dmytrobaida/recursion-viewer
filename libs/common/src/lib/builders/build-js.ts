/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ts from 'typescript';
import * as vm from 'node:vm';

import { BuilderResult } from '../types/builder-result';
import {
    GlobalRootId,
    MaxHashValue,
    MinHashValue,
    RecursionLimit,
} from '../constants/config';
import { isBrowser } from '../utils/platform';

function wrapFunction(src: string, functionName: string, params: object[]) {
    return `
        ${src}

        const calls = {};

        function wrapFunction(func: Function) {
            const proxy = new Proxy(func, {
                apply: (target, thisArg, argArray) => {
                    const hash = Math.floor(Math.random() * ${MaxHashValue}) + ${MinHashValue};
                    
                    thisArg.hashes.push(hash);
                    thisArg.total += 1;

                    if (thisArg.total >= ${RecursionLimit}) {
                        throw new Error('Reached recursion calls maximum: ${RecursionLimit}!');
                    }

                    const result = target.apply(thisArg, argArray);
                    const currentHash = thisArg.hashes.pop();
                    const parentHash = thisArg.hashes[thisArg.hashes.length - 1] ?? ${GlobalRootId};

                    if (thisArg.calls[parentHash] == null) {
                        thisArg.calls[parentHash] = [];
                    }

                    thisArg.calls[parentHash].push({
                        targetHash: currentHash,
                        inputParams: argArray,
                        callResult: result,
                    });

                    return result;
                },
            });

            return proxy;
        }

        ${functionName} = wrapFunction(${functionName}).bind({
            hashes: [],
            calls: calls,
            total: 0,
        });

        ${functionName}.apply(null, ${JSON.stringify(params)});

        JSON.stringify(calls);
    `;
}

export function build(src: string): BuilderResult[] {
    const functions = getAllFunctionsInSource(src);

    if (functions.length === 0) {
        throw new Error('There are no functions!');
    }

    if (functions.some((f) => f.name == null)) {
        throw new Error("Some of the functions doesn't have name");
    }

    return functions.map((func) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const functionName = func.name!.text;

        return {
            name: functionName,
            run: function (...params: object[]) {
                const scriptSrc = ts.transpileModule(
                    wrapFunction(src, functionName, params),
                    {}
                ).outputText;

                const result = executeScript(scriptSrc);

                return JSON.parse(result);
            },
            parameters: func.parameters.map((p: any) => ({
                name: p.name.text,
            })),
        };
    });
}

function getAllFunctionsInSource(src: string) {
    const srcFile = ts.createSourceFile('src.ts', src, ts.ScriptTarget.Latest);
    const allFunctions: ts.FunctionDeclaration[] = [];

    srcFile.forEachChild((node) => {
        if (ts.isFunctionDeclaration(node)) {
            allFunctions.push(node);
        }
    });

    return allFunctions;
}

function executeScript(scriptSrc: string) {
    if (isBrowser()) {
        return eval(scriptSrc);
    } else {
        const script = new vm.Script(scriptSrc);
        return script.runInContext(vm.createContext({}));
    }
}
