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
import CardWrapper from '../components/card-wrapper';
import FunctionList from '../components/function-list';
import PresetsList from '../components/presets-list';

import './app.css';

export function App() {
    const [preset, setPreset] = useState(Presets[0]);
    const [functionText, setFunctionText] = useState(preset.body);
    const [isEnabled, setIsEnabled] = useState(true);
    const [iframeDoc, setIframeDoc] = useState<string>();
    const [functions, setFunctions] = useState<ReturnType<typeof build>>();

    const processFunctions = useCallback(() => {
        const functions = build(functionText);
        setFunctions(functions);
    }, [functionText]);

    useEffect(() => {
        try {
            processFunctions();
        } catch (err) {
            setFunctions([]);
        }
    }, [functionText, processFunctions]);

    useEffect(() => {
        setFunctionText(preset.body);
    }, [preset]);

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
                // TODO: add proper error handling
                alert(err);
            }
        },
        []
    );

    return (
        <div className="h-screen p-14">
            <PanelGroup
                autoSaveId="recursion-visualizer"
                direction="horizontal"
            >
                <Panel>
                    <CardWrapper>
                        <PresetsList onSelect={setPreset} presets={Presets} />
                        <FunctionList
                            functions={functions}
                            isDisabled={!isEnabled}
                            onVisualize={clickHandler}
                            preset={preset}
                        />

                        <Editor
                            className="mon-editor"
                            language="typescript"
                            value={functionText}
                            // height="75%"
                            onValidate={(markers) => {
                                const isValid = markers.every(
                                    (m) => m.severity === 1
                                );
                                setIsEnabled(isValid);
                            }}
                            onChange={(v) => setFunctionText(v ?? '')}
                        />
                    </CardWrapper>
                </Panel>
                <PanelResizeHandle className="w-1 ml-3 mr-3 bg-slate-500/50" />
                <Panel>
                    <CardWrapper>
                        <iframe
                            title="Recursion visualizer"
                            className="w-full h-full line-grid-bg"
                            srcDoc={iframeDoc}
                        ></iframe>
                    </CardWrapper>
                </Panel>
            </PanelGroup>
        </div>
    );
}

export default App;
