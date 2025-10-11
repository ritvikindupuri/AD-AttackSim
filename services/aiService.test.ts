// Simple testing framework
// FIX: Export TestResult for use in other files.
export interface TestResult {
    description: string;
    passed: boolean;
    error?: string;
}

// FIX: Move mock jest implementation to the top to avoid 'used before declaration' errors.
// Mock Jest for browser environment
const jest = {
    fn: () => {
        const mockFn: any = (...args: any[]) => {
            mockFn.mock.calls.push(args);
            return mockFn.mock.results[mockFn.mock.calls.length - 1]?.value;
        };
        mockFn.mock = {
            calls: [] as any[],
            results: [] as any[],
        };
        mockFn.mockResolvedValue = (value: any) => {
            mockFn.mock.results.push({ type: 'return', value: Promise.resolve(value) });
            return mockFn;
        };
        mockFn.mockRejectedValue = (value: any) => {
            mockFn.mock.results.push({ type: 'return', value: Promise.reject(value) });
            return mockFn;
        };
        mockFn.mockClear = () => {
            mockFn.mock.calls = [];
            mockFn.mock.results = [];
        };
        mockFn.toHaveBeenCalledWith = (...args: any[]) => {
            const calls = mockFn.mock.calls;
            const found = calls.some(call => JSON.stringify(call) === JSON.stringify(args));
            if (!found) {
                throw new Error(`Expected function to be called with ${JSON.stringify(args)}, but it was called with ${JSON.stringify(calls)}`);
            }
        };
        return mockFn;
    },
    mock: (path: string, factory: () => any) => {},
    requireActual: (path: string) => ({}),
};

// Mock dependencies
// Mock the entire module
// @FIX: Renamed mock to reflect the actual function name `startInitialSimulation`.
const mockStartInitialSimulation = jest.fn();

// @FIX: Updated mock to target `startInitialSimulation` and removed unused mock for `getMitreExplanation`.
jest.mock('./aiService', () => ({
    startInitialSimulation: mockStartInitialSimulation,
}));


// Import the service to be tested
// @FIX: Imported the correct function `startInitialSimulation` which is exported from aiService.ts.
import { startInitialSimulation } from './aiService';


const beforeEach = (fn: () => void) => { fn(); };
const afterAll = (fn: () => void) => {};

const tests: { description: string, testFn: () => Promise<void> }[] = [];

const it = (description: string, testFn: () => Promise<void>) => {
    tests.push({ description, testFn });
};

const expect = (actual: any) => ({
    toBe: (expected: any) => {
        if (actual !== expected) {
            throw new Error(`Expected ${actual} to be ${expected}`);
        }
    },
    toThrow: async (expectedError?: string) => {
        try {
            await actual();
        } catch (e: any) {
            if (!expectedError || e.message.includes(expectedError)) return;
            throw new Error(`Expected to throw error including "${expectedError}", but got "${e.message}"`);
        }
        throw new Error(`Expected to throw, but it did not.`);
    }
});


// Test definitions
// @FIX: Updated test to use `startInitialSimulation` instead of `generateSimulationScenario`.
it('should call startInitialSimulation with correct parameters', async () => {
    mockStartInitialSimulation.mockResolvedValue({ title: "Gemini Test" });
    // FIX: Added missing 'attackDirectives' argument to match the function signature.
    await startInitialSimulation('test env', 'Kerberoasting', '');
    // FIX: The custom mock function has `toHaveBeenCalledWith` directly on the mock, not on `expect`.
    // FIX: Added missing 'attackDirectives' argument to the mock assertion.
    mockStartInitialSimulation.toHaveBeenCalledWith('test env', 'Kerberoasting', '');
});

// @FIX: Updated test to use `startInitialSimulation` instead of `generateSimulationScenario`.
it('should handle errors from the AI service gracefully', async () => {
    mockStartInitialSimulation.mockRejectedValue(new Error("API Error"));
    await expect(async () => {
        // FIX: Added missing 'attackDirectives' argument to match the function signature.
        await startInitialSimulation('test env', 'Kerberoasting', '');
    }).toThrow("API Error");
});


// We need to mock the global fetch for the actual implementation tests
// FIX: Use `window.fetch` instead of `global.fetch` for browser environment.
const originalFetch = window.fetch;
beforeEach(() => {
    // Reset mocks before each test
    // @FIX: Updated to clear the correct mock and removed unused mock clear.
    mockStartInitialSimulation.mockClear();
    // FIX: Use `window.fetch` instead of `global.fetch` for browser environment.
    window.fetch = jest.fn() as any;
});
afterAll(() => {
    // FIX: Use `window.fetch` instead of `global.fetch` for browser environment.
    window.fetch = originalFetch;
});

// Run all defined tests
export const runAiServiceTests = async (): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    for (const test of tests) {
        beforeEach(() => {}); // Simulate test runner behavior
        try {
            await test.testFn();
            results.push({ description: test.description, passed: true });
        } catch (e: any) {
            results.push({ description: test.description, passed: false, error: e.message });
        }
    }
    afterAll(() => {});
    return results;
};
