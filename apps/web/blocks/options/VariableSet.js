export const VariableSet = {
  id: 'variable_set',
  name: 'Set Variable',
  description: 'Store a value in a variable',
  category: 'Variables',
  inputs: {
    variableName: {
      type: 'string',
      name: 'Variable Name',
      required: true,
    },
    value: {
      type: 'any',
      name: 'Value to Store',
      required: true,
    },
    scope: {
      type: 'select',
      name: 'Variable Scope',
      options: ['global', 'server', 'user', 'channel'],
      default: 'global',
    },
    operation: {
      type: 'select',
      name: 'Operation',
      options: ['set', 'add', 'subtract', 'multiply', 'divide', 'append'],
      default: 'set',
    },
  },
  outputs: {
    success: {
      type: 'boolean',
      name: 'Success',
    },
    newValue: {
      type: 'any',
      name: 'New Value',
    },
  },
  execute: (inputs) => {
    const { variableName, value, scope, operation } = inputs;
    return {
      success: true,
      newValue: value
    };
  },
};
