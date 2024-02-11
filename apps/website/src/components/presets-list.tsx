import { Presets } from '../constants/presets';

type PresetsListProps = {
    onSelect: (preset: (typeof Presets)[0]) => void;
    presets: typeof Presets;
};

export default function PresetsList(props: PresetsListProps) {
    const { onSelect, presets } = props;

    return (
        <div className="mb-4">
            <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                Select a preset
            </label>
            <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => {
                    const index = Number(e.target.value);
                    const preset = presets[index];
                    onSelect(preset);
                }}
                defaultValue={0}
            >
                {presets.map((p, i) => (
                    <option key={i} value={i}>
                        {p.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
