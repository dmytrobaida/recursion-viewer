/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    visualize,
    build,
    transformCallResultToCytoElements,
} from '@recursion-viewer/common';
import { useCallback, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import {
    Content,
    Footer,
    Header,
    Wrapper,
    useTheme,
    Card,
    CardBody,
} from '@portfolio.md/components';

import { Presets } from '../constants/presets';
import FunctionList from '../components/function-list';
import PresetsList from '../components/presets-list';

import logo from '../../assets/logo.svg';

import './app.css';

export function App() {
    const [preset, setPreset] = useState(Presets[0]);
    const [functionText, setFunctionText] = useState(preset.body);
    const [isEnabled, setIsEnabled] = useState(true);
    const [iframeDoc, setIframeDoc] = useState<string>();
    const [functions, setFunctions] = useState<ReturnType<typeof build>>();
    const { theme } = useTheme();

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

                setIframeDoc(visualize(transformed));
            } catch (err) {
                // TODO: add proper error handling
                alert(err);
            }
        },
        []
    );

    return (
        <Wrapper>
            <Header
                home={{
                    title: 'Recursion Viewer',
                    url: '/',
                    logoUrl: logo,
                }}
                menu={[]}
            />
            <Content>
                <PanelGroup
                    autoSaveId="recursion-visualizer"
                    direction="horizontal"
                >
                    <Panel>
                        <Card className="h-full" radius="none" shadow="none">
                            <CardBody>
                                <PresetsList
                                    onSelect={setPreset}
                                    presets={Presets}
                                />
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
                                    onValidate={(markers) => {
                                        const isValid = markers.every(
                                            (m) => m.severity === 1
                                        );
                                        setIsEnabled(isValid);
                                    }}
                                    onChange={(v) => setFunctionText(v ?? '')}
                                    theme={
                                        theme === 'dark' ? 'vs-dark' : 'light'
                                    }
                                />
                            </CardBody>
                        </Card>
                    </Panel>
                    <PanelResizeHandle className="w-1 ml-3 mr-3 bg-slate-500/50" />
                    <Panel>
                        <Card
                            className="h-full p-0 line-grid-bg"
                            radius="none"
                            shadow="none"
                        >
                            <CardBody>
                                <iframe
                                    title="Recursion visualizer"
                                    className="h-full auto-color-scheme"
                                    srcDoc={iframeDoc}
                                ></iframe>
                            </CardBody>
                        </Card>
                    </Panel>
                </PanelGroup>
            </Content>
            <Footer
                socials={[
                    {
                        url: 'https://github.com/dmytrobaida',
                    },
                    {
                        url: 'https://www.linkedin.com/in/dmytrobaida/',
                    },
                ]}
                credentials={{
                    year: 2024,
                    title: 'Dmytro Baida',
                    url: '/',
                }}
            />
        </Wrapper>
    );
}

export default App;
