export type CallItem = {
    targetHash: number;
    inputParams: any[];
    callResult: any;
};

export type BuilderResult = {
    funcName: string;
    calls: {
        [hash: string]: CallItem[];
    };
};

export type BuilderFunction = (...params: any[]) => BuilderResult;
