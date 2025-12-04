'use client';

import { useState } from 'react';
import type { TestCase } from '@/lib/markdown';

interface TestCasesProps {
  testCases: TestCase[];
  questionTitle?: string;
}

export function TestCases({ testCases, questionTitle = 'solution' }: TestCasesProps) {
  const [copied, setCopied] = useState(false);
  const [showTestCode, setShowTestCode] = useState(false);

  if (testCases.length === 0) {
    return null;
  }

  const copyTestCases = async () => {
    const testCasesText = testCases
      .map((tc, i) => `# Test Case ${i + 1}\n# Input: ${tc.input}\n# Expected Output: ${tc.output}`)
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(testCasesText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Generate test code template
  const generateTestCode = () => {
    const funcName = questionTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'solution';

    return `# Copy your solution here
def ${funcName}(nums, target):
    # Your code here
    pass

# Run test cases
test_cases = [
${testCases.map(tc => `    (${tc.input}, ${tc.output}),`).join('\n')}
]

print("Running tests...")
for i, (inputs, expected) in enumerate(test_cases, 1):
    # Adjust the function call based on the problem
    result = ${funcName}(*inputs) if isinstance(inputs, tuple) else ${funcName}(inputs)
    status = "✓" if result == expected else "✗"
    print(f"Test {i}: {status} | Input: {inputs} | Expected: {expected} | Got: {result}")`;
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Test Cases
        </h3>
        <button
          onClick={copyTestCases}
          className="text-sm px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy All
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {testCases.map((testCase, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              Example {index + 1}
            </div>
            <div className="font-mono text-sm space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-semibold min-w-[60px]">Input:</span>
                <code className="text-gray-800 bg-gray-100 px-2 py-0.5 rounded break-all">
                  {testCase.input}
                </code>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-semibold min-w-[60px]">Output:</span>
                <code className="text-gray-800 bg-gray-100 px-2 py-0.5 rounded break-all">
                  {testCase.output}
                </code>
              </div>
              {testCase.explanation && (
                <div className="text-gray-500 text-xs mt-2 flex items-start gap-1.5 pt-2 border-t border-gray-100">
                  <svg className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                  <span>{testCase.explanation}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Expandable test code section */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => setShowTestCode(!showTestCode)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showTestCode ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {showTestCode ? 'Hide' : 'Show'} example test code
        </button>

        {showTestCode && (
          <div className="mt-3 animate-fadeIn">
            <div className="relative">
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto">
                <code>{generateTestCode()}</code>
              </pre>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(generateTestCode());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch (error) {
                    console.error('Failed to copy:', error);
                  }
                }}
                className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition"
                title="Copy test code"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Copy this code and paste it after your solution to run the tests locally.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
