import {
    encode,
    visualize,
    build,
    transformBuilderResultToCytoElements,
} from '@recursion-viewer/common';
import { useCallback, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import './app.css';

const def = `
function fn(n) {
    if (n == 0 || n == 1)
      return n
    
    return fn(n-1) + fn(n-2)
  }
`;

export function App() {
    const [functionText, setFunctionText] = useState(def);
    const [encodedData, setEncodedData] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);

    const iframeUrl = useMemo(() => {
        return visualize('v2') + '?data=' + encodedData;
    }, [encodedData]);

    const clickHandler = useCallback(() => {
        const result = build(functionText)(6);
        const transformed = transformBuilderResultToCytoElements(result);
        setEncodedData(encode(transformed));
    }, [functionText]);

    return (
        <div className="wrapper">
            <div className="vert">
                <button disabled={!isEnabled} onClick={clickHandler}>
                    Visualize
                </button>
            </div>
            <div className="horiz">
                <Editor
                    width="100%"
                    language="typescript"
                    defaultValue={functionText}
                    onValidate={(markers) => {
                        const isValid = markers.every((m) => m.severity === 1);
                        setIsEnabled(isValid);
                    }}
                    onChange={(v) => setFunctionText(v ?? '')}
                />
                <iframe
                    id="ifra"
                    title="frame"
                    className="ifra"
                    src={iframeUrl}
                ></iframe>
            </div>
        </div>
    );
}

export default App;
