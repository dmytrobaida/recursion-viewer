/* eslint-disable @typescript-eslint/no-explicit-any */
import { build, parseValue } from '@recursion-viewer/common';
import { useEffect, useState } from 'react';

import { Presets } from '../constants/presets';

type FunctionListProps = {
    functions?: ReturnType<typeof build>;
    isDisabled: boolean;
    onVisualize: (func: ReturnType<typeof build>[0], params: any[]) => void;
    preset: (typeof Presets)[0];
};

type FunctionListItemProps = {
    index: number;
    func: ReturnType<typeof build>[0];
    isDisabled: boolean;
    onVisualize: (func: ReturnType<typeof build>[0], params: any[]) => void;
    preset: (typeof Presets)[0];
};

const Colors = [
    'text-green-500',
    'text-blue-500',
    'text-red-500',
    'text-yellow-500',
    'text-purple-500',
];

function FunctionListItem(props: FunctionListItemProps) {
    const { func, isDisabled, onVisualize, index, preset } = props;
    const [params, setParams] = useState<any[]>(
        new Array(func.parameters.length).fill(0)
    );

    useEffect(() => {
        setParams(preset.defaultParameters);
    }, [preset]);

    return (
        <div className="flex items-baseline justify-between pb-2 pt-2">
            <span>
                <span
                    className={`${
                        Colors[index % Colors.length]
                    } lowercase underline underline-offset-2`}
                >
                    {func.name}
                </span>
                <span className="text-black dark:text-white">{'('}</span>
                <span>
                    {func.parameters.map((p, i) => (
                        <span key={i}>
                            <span className="mr-1 text-black dark:text-white">
                                {p.name} ={' '}
                            </span>
                            <input
                                type="text"
                                className="p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={params[i]}
                                size={
                                    params[i] != null
                                        ? params[i].toString().length || 1
                                        : 1
                                }
                                onChange={(e) =>
                                    setParams((prev) => {
                                        const copy = [...prev];
                                        copy[i] = parseValue(e.target.value);
                                        return copy;
                                    })
                                }
                            />
                            {i !== func.parameters.length - 1 && (
                                <span>, </span>
                            )}
                        </span>
                    ))}
                </span>
                <span className="text-black dark:text-white">{')'}</span>
            </span>

            <button
                className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                disabled={isDisabled}
                onClick={() => onVisualize(func, params)}
            >
                Visualize
            </button>
        </div>
    );
}

export default function FunctionList(props: FunctionListProps) {
    const { functions, isDisabled, onVisualize, preset } = props;

    if (functions == null || functions.length === 0) {
        return <div className="mb-4">There are no functions yet</div>;
    }

    return (
        <div className="w-full mb-4 divide-dashed divide-y-2 divide-y-reverse ">
            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Set arguments
            </p>
            {functions.map((f, i) => (
                <FunctionListItem
                    key={i}
                    index={i}
                    func={f}
                    preset={preset}
                    isDisabled={isDisabled}
                    onVisualize={onVisualize}
                />
            ))}
        </div>
    );
}
