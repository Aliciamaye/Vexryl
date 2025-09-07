export const MathOperation = {
  id: 'math_operation',
  name: 'Math Operation',
  description: 'Perform mathematical calculations',
  category: 'Math',
  inputs: {
    operation: {
      type: 'select',
      name: 'Operation',
      options: ['add', 'subtract', 'multiply', 'divide', 'modulo', 'power', 'sqrt', 'abs', 'round', 'floor', 'ceil'],
      required: true,
    },
    value1: {
      type: 'number',
      name: 'First Value',
      required: true,
    },
    value2: {
      type: 'number',
      name: 'Second Value',
      required: false,
    },
  },
  outputs: {
    result: {
      type: 'number',
      name: 'Result',
    },
  },
  execute: (inputs) => {
    const { operation, value1, value2 } = inputs;
    let result;
    
    switch (operation) {
      case 'add': result = value1 + value2; break;
      case 'subtract': result = value1 - value2; break;
      case 'multiply': result = value1 * value2; break;
      case 'divide': result = value1 / value2; break;
      case 'modulo': result = value1 % value2; break;
      case 'power': result = Math.pow(value1, value2); break;
      case 'sqrt': result = Math.sqrt(value1); break;
      case 'abs': result = Math.abs(value1); break;
      case 'round': result = Math.round(value1); break;
      case 'floor': result = Math.floor(value1); break;
      case 'ceil': result = Math.ceil(value1); break;
      default: result = 0;
    }
    
    return { result };
  },
};
