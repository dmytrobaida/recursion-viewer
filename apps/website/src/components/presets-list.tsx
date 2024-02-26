import { Select, SelectItem } from '@portfolio.md/components';

import { Presets } from '../constants/presets';

type PresetsListProps = {
    onSelect: (preset: (typeof Presets)[0]) => void;
    presets: typeof Presets;
};

export default function PresetsList(props: PresetsListProps) {
    const { onSelect, presets } = props;

    return (
        <Select
            label="Select a preset"
            className="w-full mb-4"
            selectionMode="single"
            disallowEmptySelection={true}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSelectionChange={(args: any) => {
                const index = Number(args.currentKey);
                const preset = presets[index];
                onSelect(preset);
            }}
            defaultSelectedKeys={['0']}
        >
            {presets.map((p, i) => (
                <SelectItem key={i} value={i}>
                    {p.name}
                </SelectItem>
            ))}
        </Select>
    );
}
