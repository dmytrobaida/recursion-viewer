import {
    encode,
    visualize,
    build,
    transformBuilderResultToCytoElements,
} from '@recursion-viewer/common';
import { useEffect, useState } from 'react';

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

    useEffect(() => {
        const result = build(functionText)(5);
        const transformed = transformBuilderResultToCytoElements(result);
        setEncodedData(encode(transformed));
    }, [functionText]);

    return (
        <>
            <textarea
                id="text"
                cols={30}
                rows={20}
                value={functionText}
                onChange={(e) => setFunctionText(e.target.value)}
            ></textarea>
            <iframe
                title="frame"
                src={visualize('v2') + '&data=' + encodedData}
            ></iframe>
        </>
    );
}

export default App;
