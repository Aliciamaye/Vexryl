export const VariableGet = {
  id: 'variable_get',
  name: 'Get Variable',
  description: 'Retrieve the value of a stored variable',
  category: 'Variables',
  inputs: {
    variableName: {
      type: 'string',
      name: 'Variable Name',
      required: true,
    },
    defaultValue: {
      type: 'string',
      name: 'Default Value',
      required: false,
    },
    scope: {
      type: 'select',
      name: 'Variable Scope',
      options: ['global', 'server', 'user', 'channel'],
      default: 'global',
    },
  },
  outputs: {
    value: {
      type: 'any',
      name: 'Variable Value',
    },
  },
  execute: (inputs) => {
    const { variableName, defaultValue, scope } = inputs;
    // Implementation will be handled by the bot runtime
    return {
      value: `{variable:${scope}:${variableName}:${defaultValue || 'null'}}`
    };
  },
};
