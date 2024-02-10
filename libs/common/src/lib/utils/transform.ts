import { GlobalRootId } from "../constants/config";
import { BuilderResult } from "../types/builder-result";
import { CytoEdge, CytoElements, CytoNode } from "../types/cyto-data";
import { DataNode } from "../types/d3-data";

type CallParams = {
    [hash: string]: {
        inputParams: any[];
        callResult: any;
    };
};

export function transformBuilderResultToD3Data(
    builderResult: BuilderResult
): DataNode {
    const callParams = getCallParams(builderResult);

    function dfs(key: number | string) {
        const cur = callParams[key];
        const node = new DataNode(
            `${builderResult.funcName}(${cur.inputParams.join(",")})`,
            `${cur.callResult}`
        );

        for (const callItem of builderResult.calls[key] ?? []) {
            const child = dfs(callItem.targetHash);
            node.children.push(child);
        }

        return node;
    }

    return dfs(GlobalRootId).children[0];
}

export function getCallParams(builderResult: BuilderResult) {
    const callParams: CallParams = {};
    const allCalls = Object.values(builderResult.calls).flatMap(
        (items) => items
    );
    const root = builderResult.calls[GlobalRootId];

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

export function transformBuilderResultToCytoElements(
    builderResult: BuilderResult
): CytoElements {
    const nodes: CytoNode[] = [];
    const edges: CytoEdge[] = [];
    const callParams = getCallParams(builderResult);

    function dfs(key: number | string) {
        const cur = callParams[key];
        const node: CytoNode = {
            data: {
                id: key.toString(),
                label: `${builderResult.funcName}(${cur.inputParams
                    .map((p) => JSON.stringify(p))
                    .join(",")})`,
            },
        };

        nodes.push(node);

        for (const callItem of builderResult.calls[key] ?? []) {
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
