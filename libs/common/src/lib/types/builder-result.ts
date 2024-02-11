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
    run: BuilderFunction;
    name: string;
    parameters: {
        name: string;
    }[];
};
