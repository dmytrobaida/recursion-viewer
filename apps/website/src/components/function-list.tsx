/* eslint-disable @typescript-eslint/no-explicit-any */
import { build, parseValue } from '@recursion-viewer/common';
import { useEffect, useState } from 'react';
import { Button, Tooltip } from '@portfolio.md/components';

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
            <span className="leading-3">
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
                                className="text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

            <Tooltip content="You can change input arguments">
                <Button
                    isDisabled={isDisabled}
                    onClick={() => onVisualize(func, params)}
                    color="primary"
                >
                    Visualize
                </Button>
            </Tooltip>
        </div>
    );
}

export default function FunctionList(props: FunctionListProps) {
    const { functions, isDisabled, onVisualize, preset } = props;

    if (functions == null || functions.length === 0) {
        return <div className="mb-4">There are no functions yet</div>;
    }

    return (
        <div className="w-full mb-2 divide-dashed divide-y-2 divide-y-reverse ">
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
