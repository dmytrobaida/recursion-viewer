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

function FunctionListItem(props: FunctionListItemProps) {
    const { func, isDisabled, onVisualize } = props;
    const [params, setParams] = useState<any[]>(
        new Array(func.parameters.length).fill(0)
    );

    return (
        <div className="function-list-item">
            <div className="function-list-item-name">{func.name}</div>
            {func.parameters.map((p, i) => (
                <div className="function-list-item-params" key={i}>
                    <div>{p.name} = </div>{' '}
                    <input
                        type="text"
                        defaultValue={params[i]}
                        onChange={(e) =>
                            setParams((prev) => {
                                prev[i] = parseValue(e.target.value);
                                return prev;
                            })
                        }
                    />
                </div>
            ))}
            <button
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
        <div className="function-list">
            <div>Functions:</div>
            {functions.map((f, i) => (
                <FunctionListItem
                    key={i}
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
        <div className="wrapper">
            <PanelGroup
                autoSaveId="example"
                direction="horizontal"
                className="panel-t"
            >
                <Panel>
                    <div className="vertical-box">
                        <FunctionList
                            functions={functions}
                            isDisabled={!isEnabled}
                            onVisualize={clickHandler}
                        />
                        <Editor
                            language="typescript"
                            className="code-editor"
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
                <PanelResizeHandle className="resize-handle" />
                <Panel>
                    <iframe
                        title="Recursion visualizer"
                        className="visualizer"
                        srcDoc={iframeDoc}
                    ></iframe>
                </Panel>
            </PanelGroup>
        </div>
    );
}

export default App;
