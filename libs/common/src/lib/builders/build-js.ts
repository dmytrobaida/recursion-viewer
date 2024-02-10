/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ts from 'typescript';
import * as vm from 'node:vm';

import { BuilderFunction } from '../types/builder-result';
import { GlobalRootId, MaxHashValue, MinHashValue } from '../constants/config';
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
        });

        ${functionName}.apply(null, ${JSON.stringify(params)});

        JSON.stringify(calls);
    `;
}

export function build(src: string): BuilderFunction {
    const srcFile = ts.createSourceFile('src.ts', src, ts.ScriptTarget.Latest);
    const functionNames = srcFile
        .getChildren()
        .map((node) => node.getChildren())
        .flatMap((nodes) => nodes)
        .filter((node) => ts.isFunctionDeclaration(node))
        .map((node: any) => node.name?.text);

    // TODO: what if there are multiple functions?
    const functionName = functionNames[0];

    return function (...params: object[]) {
        const scriptSrc = ts.transpileModule(
            wrapFunction(src, functionName, params),
            {}
        ).outputText;

        const result = executeScript(scriptSrc);

        return {
            funcName: functionName,
            calls: JSON.parse(result),
        };
    };
}

function executeScript(scriptSrc: string) {
    if (isBrowser()) {
        return eval(scriptSrc);
    } else {
        const script = new vm.Script(scriptSrc);
        return script.runInContext(vm.createContext({}));
    }
}
