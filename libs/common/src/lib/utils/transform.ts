/* eslint-disable @typescript-eslint/no-explicit-any */
import { GlobalRootId } from '../constants/config';
import { CallResult } from '../types/builder-result';
import { CytoEdge, CytoElements, CytoNode } from '../types/cyto-data';

type CallParams = {
    [hash: string]: {
        inputParams: any[];
        callResult: any;
    };
};

export function getCallParams(callResult: CallResult) {
    const callParams: CallParams = {};
    const allCalls = Object.values(callResult).flatMap((items) => items);
    const root = callResult[GlobalRootId];

    callParams[GlobalRootId] = {
        inputParams: root[0].inputParams,
        callResult: root[0].callResult,
    };

    for (const call of allCalls) {
        callParams[call.targetHash] = {
            inputParams: call.inputParams,
            callResult: call.callResult,
        };
    }

    return callParams;
}

export function transformCallResultToCytoElements(
    callResult: CallResult,
    funcName: string
): CytoElements {
    const nodes: CytoNode[] = [];
    const edges: CytoEdge[] = [];
    const callParams = getCallParams(callResult);

    function dfs(key: number | string) {
        const cur = callParams[key];
        const node: CytoNode = {
            data: {
                id: key.toString(),
                label: `${funcName}(${cur.inputParams
                    .map((p) => JSON.stringify(p))
                    .join(',')})`,
            },
        };

        nodes.push(node);

        for (const callItem of callResult[key] ?? []) {
            const edge: CytoEdge = {
                data: {
                    source: node.data.id,
                    target: callItem.targetHash.toString(),
                    label: JSON.stringify(callItem.callResult),
                },
            };

            edges.push(edge);
            dfs(callItem.targetHash);
        }
    }

    dfs(GlobalRootId);

    return {
        nodes: nodes,
        edges: edges,
    };
}
