import React, { useState, useEffect } from 'react';

const MathOperation = ({ config, onChange }) => {
  const [formData, setFormData] = useState({
    operation: config.operation || 'add',
    value1: config.value1 || 0,
    value2: config.value2 || 0,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const operations = [
    { value: 'add', label: 'Add (+)', needsTwo: true },
    { value: 'subtract', label: 'Subtract (-)', needsTwo: true },
    { value: 'multiply', label: 'Multiply (×)', needsTwo: true },
    { value: 'divide', label: 'Divide (÷)', needsTwo: true },
    { value: 'modulo', label: 'Modulo (%)', needsTwo: true },
    { value: 'power', label: 'Power (^)', needsTwo: true },
    { value: 'sqrt', label: 'Square Root (√)', needsTwo: false },
    { value: 'abs', label: 'Absolute Value (|x|)', needsTwo: false },
    { value: 'round', label: 'Round', needsTwo: false },
    { value: 'floor', label: 'Floor', needsTwo: false },
    { value: 'ceil', label: 'Ceiling', needsTwo: false },
  ];

  const selectedOperation = operations.find(op => op.value === formData.operation);

  const calculateResult = () => {
    const val1 = parseFloat(formData.value1) || 0;
    const val2 = parseFloat(formData.value2) || 0;
    
    switch (formData.operation) {
      case 'add': return val1 + val2;
      case 'subtract': return val1 - val2;
      case 'multiply': return val1 * val2;
      case 'divide': return val2 !== 0 ? val1 / val2 : 'Error: Division by zero';
      case 'modulo': return val2 !== 0 ? val1 % val2 : 'Error: Division by zero';
      case 'power': return Math.pow(val1, val2);
      case 'sqrt': return val1 >= 0 ? Math.sqrt(val1) : 'Error: Negative number';
      case 'abs': return Math.abs(val1);
      case 'round': return Math.round(val1);
      case 'floor': return Math.floor(val1);
      case 'ceil': return Math.ceil(val1);
      default: return 0;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div>
            <h3 className="font-medium text-indigo-900">Math Operation</h3>
            <p className="text-sm text-indigo-700">Perform mathematical calculations</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Operation *
        </label>
        <select
          value={formData.operation}
          onChange={(e) => handleChange('operation', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {operations.map(op => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {selectedOperation?.needsTwo ? 'First Value' : 'Value'} *
        </label>
        <input
          type="number"
          step="any"
          value={formData.value1}
          onChange={(e) => handleChange('value1', parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {selectedOperation?.needsTwo && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Second Value *
          </label>
          <input
            type="number"
            step="any"
            value={formData.value2}
            onChange={(e) => handleChange('value2', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <h4 className="font-medium text-gray-900 mb-2">Preview Result</h4>
        <div className="text-lg font-mono bg-white p-2 rounded border">
          {calculateResult()}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Use this block to perform calculations with numbers. The result can be used in other blocks as a variable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathOperation;
