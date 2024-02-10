import {
    encode,
    visualize,
    build,
    transformCallResultToCytoElements,
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

// const def = `
// const fn = (n) => {
//     if (n == 0 || n == 1)
//       return n

//     return fn(n-1) + fn(n-2)
//   }
// `;

export function App() {
    const [functionText, setFunctionText] = useState(def);
    const [isEnabled, setIsEnabled] = useState(false);
    const [iframeDoc, setIframeDoc] = useState<string>();

    const clickHandler = useCallback(() => {
        try {
            const functions = build(functionText);
            const cur = functions[0];

            const result = cur.func(10);
            const transformed = transformCallResultToCytoElements(
                result,
                cur.funcName
            );

            setIframeDoc(visualize('v2', transformed));
        } catch (err) {
            // add proper error handling
            alert(err);
        }
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
                    srcDoc={iframeDoc}
                ></iframe>
            </div>
        </div>
    );
}

export default App;
