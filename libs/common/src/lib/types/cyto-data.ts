export type CytoNode = {
    data: {
        id: string;
        label?: string;
    };
};

export type CytoEdge = {
    data: {
        source: string;
        target: string;
        label?: string;
    };
};

export type CytoElements = {
    nodes: CytoNode[];
    edges: CytoEdge[];
};
