import { encode } from '@recursion-viewer/common';

export function App() {
    return <div>Hello {encode({ test: 1 })}</div>;
}

export default App;
