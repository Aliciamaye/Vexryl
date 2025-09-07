import React, { useState, useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

export default function ScriptEditor({ initialCode = '', language = 'javascript', onChange, readOnly = false }) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (containerRef.current && !editor) {
      // Configure Monaco for Discord.js
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types'],
      });

      // Add Discord.js type definitions
      monaco.languages.typescript.javascriptDefaults.addExtraLib(`
        declare module 'discord.js' {
          export interface CommandInteraction {
            reply(options: any): Promise<any>;
            editReply(options: any): Promise<any>;
            followUp(options: any): Promise<any>;
            user: User;
            guild: Guild;
            channel: Channel;
            options: CommandInteractionOptionResolver;
          }
          
          export interface User {
            id: string;
            username: string;
            discriminator: string;
            avatar: string;
            send(options: any): Promise<any>;
          }
          
          export interface Guild {
            id: string;
            name: string;
            members: GuildMemberManager;
            channels: GuildChannelManager;
            roles: RoleManager;
          }
          
          export interface Channel {
            id: string;
            type: number;
            send(options: any): Promise<any>;
          }
        }
      `, 'discord.d.ts');

      const newEditor = monaco.editor.create(containerRef.current, {
        value: initialCode,
        language: language,
        theme: 'vs-dark',
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: readOnly,
        automaticLayout: true,
        minimap: { enabled: false },
        contextmenu: true,
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false
        },
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        wordBasedSuggestions: true
      });

      // Add change listener
      newEditor.onDidChangeModelContent(() => {
        const value = newEditor.getValue();
        onChange?.(value);
      });

      setEditor(newEditor);
      setIsLoading(false);
    }

    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, []);

  // Update editor value when initialCode changes
  useEffect(() => {
    if (editor && initialCode !== editor.getValue()) {
      editor.setValue(initialCode);
    }
  }, [initialCode, editor]);

  return (
    <div className="script-editor h-full w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
          <div className="text-white">Loading editor...</div>
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

// Advanced Script Editor Modal
export function AdvancedScriptEditor({ isOpen, onClose, onSave, initialCode = '', blockType, blockId }) {
  const [code, setCode] = useState(initialCode);
  const [isModified, setIsModified] = useState(false);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setIsModified(newCode !== initialCode);
  };

  const handleSave = () => {
    onSave(code);
    setIsModified(false);
    onClose();
  };

  const getTemplateCode = () => {
    if (blockType === 'action') {
      return `
// Advanced Action Script
export default {
  async execute(interaction, config, variables = {}) {
    try {
      // Your custom action logic here
      
      // Example: Reply to interaction
      await interaction.reply({
        content: 'Custom action executed!',
        ephemeral: true
      });
      
      // Access user data
      const user = interaction.user;
      const guild = interaction.guild;
      const channel = interaction.channel;
      
      // Use configuration
      console.log('Config:', config);
      console.log('Variables:', variables);
      
      return { success: true };
    } catch (error) {
      console.error('Action Error:', error);
      throw error;
    }
  },
  
  validate(config, value) {
    // Validate configuration
    return { valid: true, errors: [] };
  },
  
  getRequiredPermissions() {
    return ['SendMessages'];
  }
};
      `.trim();
    } else if (blockType === 'condition') {
      return `
// Advanced Condition Script
export default {
  async evaluate(interaction, config, variables = {}) {
    try {
      // Your custom condition logic here
      
      // Example: Check if user has role
      const member = interaction.member;
      if (!member) return false;
      
      // Access configuration
      const targetRole = config.roleId;
      
      // Return true/false based on condition
      return member.roles.cache.has(targetRole);
      
    } catch (error) {
      console.error('Condition Error:', error);
      return false;
    }
  },
  
  validate(config, value) {
    // Validate configuration
    return { valid: true, errors: [] };
  }
};
      `.trim();
    } else if (blockType === 'option') {
      return `
// Advanced Option Script
export default {
  generateOption(config, value) {
    return {
      type: 3, // STRING type
      name: value || 'custom',
      description: config.description || 'Custom option',
      required: config.required || false
    };
  },
  
  getValue(interaction, paramName) {
    return interaction.options.getString(paramName);
  },
  
  validate(config, value) {
    // Validate configuration
    return { valid: true, errors: [] };
  }
};
      `.trim();
    }
    
    return '// Custom script\n';
  };

  const insertTemplate = () => {
    setCode(getTemplateCode());
    setIsModified(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-lg border border-gray-800 w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">Advanced Script Editor</h2>
            <p className="text-sm text-gray-400">
              Edit the JavaScript code for this {blockType} block
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={insertTemplate}
              className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Insert Template
            </button>
            <button
              onClick={handleSave}
              disabled={!isModified}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4">
          <ScriptEditor
            initialCode={code}
            language="javascript"
            onChange={handleCodeChange}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-neutral-800 rounded-b-lg">
          <div className="text-sm text-gray-400">
            <strong>Available APIs:</strong> Discord.js v14, Node.js built-ins
            <br />
            <strong>Variables:</strong> interaction, config, variables (event data)
            <br />
            <strong>Note:</strong> Changes take effect immediately. Test thoroughly before deploying.
          </div>
        </div>
      </div>
    </div>
  );
}
