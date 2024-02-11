/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    visualize,
    build,
    transformCallResultToCytoElements,
} from '@recursion-viewer/common';
import { useCallback, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

import { Presets } from '../constants/presets';

import './app.css';

type FunctionListItemProps = {
    index: number;
    func: ReturnType<typeof build>[0];
    isDisabled: boolean;
    onVisualize: (func: ReturnType<typeof build>[0], params: any[]) => void;
};

function parseValue(v: any) {
    const parsed = Number.parseInt(v);

    if (Number.isNaN(parsed)) {
        return v;
    }

    return parsed;
}

const colors = [
    'text-green-500',
    'text-blue-500',
    'text-red-500',
    'text-yellow-500',
    'text-purple-500',
];

function FunctionListItem(props: FunctionListItemProps) {
    const { func, isDisabled, onVisualize, index } = props;
    const [params, setParams] = useState<any[]>(
        new Array(func.parameters.length).fill(0)
    );

    return (
        <div className="flex items-baseline justify-between">
            <span>
                <span
                    className={`${
                        colors[index % colors.length]
                    } lowercase underline underline-offset-2`}
                >
                    {func.name}
                </span>
                <span>{'('}</span>
                <span>
                    {func.parameters.map((p, i) => (
                        <span key={i}>
                            <span className="mr-1">{p.name} = </span>
                            <input
                                type="text"
                                className="p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                defaultValue={params[i]}
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
                <span>{')'}</span>
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

type FunctionListProps = {
    functions?: ReturnType<typeof build>;
    isDisabled: boolean;
    onVisualize: (func: ReturnType<typeof build>[0], params: any[]) => void;
};

function FunctionList(props: FunctionListProps) {
    const { functions, isDisabled, onVisualize } = props;

    if (functions == null) {
        return <div>There are no functions yet</div>;
    }

    return (
        <div className="w-full mb-4">
            <div>List of functions found:</div>
            {functions.map((f, i) => (
                <FunctionListItem
                    key={i}
                    index={i}
                    func={f}
                    isDisabled={isDisabled}
                    onVisualize={onVisualize}
                />
            ))}
        </div>
    );
}

export function App() {
    const [functionText, setFunctionText] = useState(Presets[0].body);
    const [isEnabled, setIsEnabled] = useState(true);
    const [iframeDoc, setIframeDoc] = useState<string>();
    const [functions, setFunctions] = useState<ReturnType<typeof build>>();

    const processFunctions = useCallback(() => {
        const functions = build(functionText);
        setFunctions(functions);
    }, [functionText]);

    useEffect(() => {
        processFunctions();
    }, []);

    const clickHandler = useCallback(
        (func: ReturnType<typeof build>[0], params: any[]) => {
            try {
                const result = func.run(...params);
                const transformed = transformCallResultToCytoElements(
                    result,
                    func.name
                );

                setIframeDoc(visualize('v2', transformed));
            } catch (err) {
                // add proper error handling
                alert(err);
            }
        },
        []
    );

    return (
        <div className="h-screen p-14">
            <PanelGroup autoSaveId="example" direction="horizontal">
                <Panel>
                    <div className="h-full">
                        <FunctionList
                            functions={functions}
                            isDisabled={!isEnabled}
                            onVisualize={clickHandler}
                        />
                        <Editor
                            language="typescript"
                            defaultValue={functionText}
                            onValidate={(markers) => {
                                const isValid = markers.every(
                                    (m) => m.severity === 1
                                );
                                setIsEnabled(isValid);

                                if (isValid) {
                                    processFunctions();
                                }
                            }}
                            onChange={(v) => setFunctionText(v ?? '')}
                        />
                    </div>
                </Panel>
                <PanelResizeHandle className="w-1 ml-3 mr-3 bg-slate-500/50" />
                <Panel>
                    <iframe
                        title="Recursion visualizer"
                        className="w-full h-full line-grid-bg"
                        srcDoc={iframeDoc}
                    ></iframe>
                </Panel>
            </PanelGroup>
        </div>
    );
}

export default App;
