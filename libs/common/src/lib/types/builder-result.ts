/* eslint-disable @typescript-eslint/no-explicit-any */
export type CallItem = {
    targetHash: number;
    inputParams: any[];
    callResult: any;
};

export type CallResult = {
    [hash: string]: CallItem[];
};

export type BuilderFunction = (...params: any[]) => CallResult;

export type BuilderResult = {
    func: BuilderFunction;
    funcName: string;
    parameters: {
        name: string;
    }[];
};
