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
import { isMobile } from 'react-device-detect';

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

    const LeftCard = (
        <Card className="h-full" radius="none" shadow="none">
            <CardBody className="p-0 lg:p-3">
                <PresetsList onSelect={setPreset} presets={Presets} />
                <FunctionList
                    functions={functions}
                    isDisabled={!isEnabled}
                    onVisualize={clickHandler}
                    preset={preset}
                />
                {!isMobile && (
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
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    />
                )}
            </CardBody>
        </Card>
    );

    const RightCard = (
        <Card className="h-full grow" radius="none" shadow="none">
            <CardBody className="p-0 lg:p-3">
                <iframe
                    title="Recursion visualizer"
                    className="h-full grow auto-color-scheme line-grid-bg"
                    srcDoc={iframeDoc}
                ></iframe>
            </CardBody>
        </Card>
    );

    return (
        <Wrapper>
            <Header
                home={{
                    title: 'Recursion Viewer',
                    url: './',
                    logoUrl: logo,
                }}
                menu={[
                    {
                        title: 'VS Code Extension',
                        url: 'https://marketplace.visualstudio.com/items?itemName=DmytroBaida.recursion-viewer',
                    },
                    {
                        title: 'GitHub Repo',
                        url: 'https://github.com/dmytrobaida/recursion-viewer',
                    },
                ]}
            />
            <Content>
                {isMobile ? (
                    [LeftCard, RightCard]
                ) : (
                    <PanelGroup
                        autoSaveId="recursion-visualizer"
                        direction={'horizontal'}
                        className="grow"
                    >
                        <Panel>{LeftCard}</Panel>
                        <PanelResizeHandle className="w-1 ml-3 mr-3 bg-slate-500/50" />
                        <Panel>{RightCard}</Panel>
                    </PanelGroup>
                )}
            </Content>
            <Footer
                socials={[
                    {
                        url: 'https://github.com/dmytrobaida',
                    },
                    {
                        url: 'https://www.linkedin.com/in/dmytrobaida',
                    },
                    {
                        url: 'https://leetcode.com/dmytrobaida',
                    },
                ]}
                credentials={{
                    year: 2024,
                    title: 'Dmytro Baida',
                    url: 'https://dmytrobaida.github.io',
                }}
            />
        </Wrapper>
    );
}

export default App;
