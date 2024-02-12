export function parseValue(val: string | undefined) {
    if (val == null) {
        throw new Error('Empty value provided!');
    }

    const parsed = Number.parseInt(val);

    if (Number.isNaN(parsed)) {
        return val;
    }

    return parsed;
}
