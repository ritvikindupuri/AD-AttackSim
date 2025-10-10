import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { runAiServiceTests, TestResult } from './services/aiService.test';

const TestRunner: React.FC = () => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [running, setRunning] = useState(true);

    useEffect(() => {
        const runTests = async () => {
            const testResults = await runAiServiceTests();
            setResults(testResults);
            setRunning(false);
        };
        runTests();
    }, []);

    const passedCount = results.filter(r => r.passed).length;
    const failedCount = results.length - passedCount;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-white mb-2" style={{fontFamily: "'Exo 2', sans-serif"}}>
                ADversary Unit Tests
            </h1>
            <p className="text-gray-400 mb-8">Test results for the application's core services.</p>

            <div className="bg-black/40 rounded-lg border border-green-500/20 p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-green-400 mb-4">aiService.ts</h2>
                
                <div className="flex items-center gap-6 mb-6 text-lg">
                    <div className={`font-bold ${failedCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {running ? 'Running...' : (failedCount === 0 ? 'All Tests Passed' : `${failedCount} Test(s) Failed`)}
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-green-400">Passed: {passedCount}</span>
                       <span className="text-red-400">Failed: {failedCount}</span>
                       <span>Total: {results.length}</span>
                    </div>
                </div>

                <div className="space-y-3 font-mono text-sm">
                    {results.map((result, index) => (
                        <div key={index} className={`p-3 rounded-md border ${result.passed ? 'bg-green-900/30 border-green-500/40' : 'bg-red-900/30 border-red-500/40'}`}>
                           <p className="font-bold mb-1">{result.passed ? '✅ PASS' : '❌ FAIL'}: {result.description}</p>
                           {!result.passed && <p className="text-red-300 ml-7">{result.error}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<TestRunner />);
}
