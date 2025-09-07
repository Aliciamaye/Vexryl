export const TextManipulation = {
  id: 'text_manipulation',
  name: 'Text Manipulation',
  description: 'Manipulate and transform text',
  category: 'Text',
  inputs: {
    text: {
      type: 'string',
      name: 'Input Text',
      required: true,
    },
    operation: {
      type: 'select',
      name: 'Operation',
      options: ['uppercase', 'lowercase', 'capitalize', 'reverse', 'length', 'trim', 'replace', 'split', 'join'],
      required: true,
    },
    searchText: {
      type: 'string',
      name: 'Search Text',
      required: false,
    },
    replaceText: {
      type: 'string',
      name: 'Replace With',
      required: false,
    },
    separator: {
      type: 'string',
      name: 'Separator',
      required: false,
    },
  },
  outputs: {
    result: {
      type: 'string',
      name: 'Result',
    },
  },
  execute: (inputs) => {
    const { text, operation, searchText, replaceText, separator } = inputs;
    let result;
    
    switch (operation) {
      case 'uppercase': result = text.toUpperCase(); break;
      case 'lowercase': result = text.toLowerCase(); break;
      case 'capitalize': result = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(); break;
      case 'reverse': result = text.split('').reverse().join(''); break;
      case 'length': result = text.length.toString(); break;
      case 'trim': result = text.trim(); break;
      case 'replace': result = text.replace(new RegExp(searchText, 'g'), replaceText || ''); break;
      case 'split': result = text.split(separator || ' ').join('\n'); break;
      case 'join': result = text.split('\n').join(separator || ' '); break;
      default: result = text;
    }
    
    return { result };
  },
};
