export class DataNode {
    name: string;
    returns: string;
    children: DataNode[];

    constructor(name: string, returns: string) {
        this.name = name;
        this.returns = returns;
        this.children = [];
    }
}
