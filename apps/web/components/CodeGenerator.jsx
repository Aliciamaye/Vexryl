import React, { useState } from 'react';

/**
 * Discord.js Code Generator
 * Converts visual bot flows into executable Discord.js code
 */

export default function CodeGenerator({ nodes, edges, variables = [] }) {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Template for Discord.js bot structure
  const getBotTemplate = () => {
    return `const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions
  ]
});

// Variables
${generateVariables()}

${generateEvents()}

${generateCommands()}

client.login(process.env.DISCORD_TOKEN);
`;
  };

  // Generate variable declarations
  const generateVariables = () => {
    if (!variables.length) return '// No custom variables defined';
    
    return variables.map(variable => {
      const defaultValue = getDefaultValue(variable.type);
      return `let ${variable.name} = ${defaultValue}; // ${variable.description || 'Custom variable'}`;
    }).join('\n');
  };

  // Get default value for variable type
  const getDefaultValue = (type) => {
    switch (type) {
      case 'string': return '""';
      case 'number': return '0';
      case 'boolean': return 'false';
      case 'array': return '[]';
      case 'object': return '{}';
      default: return 'null';
    }
  };

  // Generate event listeners
  const generateEvents = () => {
    const eventNodes = nodes.filter(node => node.type === 'event');
    if (!eventNodes.length) return '// No events configured';

    return eventNodes.map(eventNode => {
      const eventType = eventNode.data.event;
      const connectedNodes = getConnectedNodes(eventNode.id);
      
      return `
// ${eventNode.data.label || eventType} Event
client.on('${eventType}', async (${getEventParameters(eventType)}) => {
  try {
${generateNodeFlow(connectedNodes, 2)}
  } catch (error) {
    console.error('Error in ${eventType} event:', error);
  }
});`;
    }).join('\n');
  };

  // Generate slash commands
  const generateCommands = () => {
    const commandNodes = nodes.filter(node => node.type === 'command');
    if (!commandNodes.length) return '// No commands configured';

    let commandsCode = `
// Command handling
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
`;

    commandNodes.forEach(commandNode => {
      const connectedNodes = getConnectedNodes(commandNode.id);
      commandsCode += `
    if (interaction.commandName === '${commandNode.data.name}') {
${generateNodeFlow(connectedNodes, 3)}
    }
`;
    });

    commandsCode += `
  } catch (error) {
    console.error('Error handling command:', error);
    if (!interaction.replied) {
      await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  }
});

// Register commands
client.once('ready', async () => {
  console.log(\`Bot is ready! Logged in as \${client.user.tag}\`);
  
  const commands = [
${commandNodes.map(node => generateCommandRegistration(node)).join(',\n')}
  ];

  try {
    await client.application.commands.set(commands);
    console.log('Commands registered successfully!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});
`;

    return commandsCode;
  };

  // Generate command registration object
  const generateCommandRegistration = (commandNode) => {
    const { name, description, options = [] } = commandNode.data;
    
    let commandObj = `    {
      name: '${name}',
      description: '${description || 'Bot command'}'`;

    if (options.length > 0) {
      commandObj += `,
      options: [
${options.map(option => `        {
          name: '${option.name}',
          description: '${option.description}',
          type: ${getDiscordOptionType(option.type)},
          required: ${option.required || false}
        }`).join(',\n')}
      ]`;
    }

    commandObj += '\n    }';
    return commandObj;
  };

  // Get Discord API option type number
  const getDiscordOptionType = (type) => {
    const types = {
      'string': 3,
      'integer': 4,
      'boolean': 5,
      'user': 6,
      'channel': 7,
      'role': 8,
      'mentionable': 9,
      'number': 10
    };
    return types[type] || 3;
  };

  // Get event parameters based on event type
  const getEventParameters = (eventType) => {
    const eventParams = {
      'messageCreate': 'message',
      'guildMemberAdd': 'member',
      'guildMemberRemove': 'member',
      'messageReactionAdd': 'reaction, user',
      'messageReactionRemove': 'reaction, user',
      'voiceStateUpdate': 'oldState, newState',
      'guildBanAdd': 'ban',
      'guildBanRemove': 'ban',
      'messageUpdate': 'oldMessage, newMessage',
      'messageDelete': 'message',
      'channelCreate': 'channel',
      'channelDelete': 'channel',
      'roleCreate': 'role',
      'roleDelete': 'role',
      'guildCreate': 'guild',
      'guildDelete': 'guild'
    };
    return eventParams[eventType] || 'interaction';
  };

  // Get nodes connected to a specific node
  const getConnectedNodes = (nodeId) => {
    const connectedEdges = edges.filter(edge => edge.source === nodeId);
    const connectedNodeIds = connectedEdges.map(edge => edge.target);
    return nodes.filter(node => connectedNodeIds.includes(node.id));
  };

  // Generate code flow for connected nodes
  const generateNodeFlow = (nodesList, indentLevel = 0) => {
    if (!nodesList.length) return '';
    
    const indent = '  '.repeat(indentLevel);
    let code = '';

    nodesList.forEach(node => {
      switch (node.type) {
        case 'action':
          code += generateActionCode(node, indent);
          break;
        case 'condition':
          code += generateConditionCode(node, indent);
          break;
        default:
          code += `${indent}// Unsupported node type: ${node.type}\n`;
      }
    });

    return code;
  };

  // Generate action node code
  const generateActionCode = (node, indent) => {
    const { action, config } = node.data;
    
    switch (action) {
      case 'send_message':
        return generateSendMessageCode(config, indent);
      case 'send_embed':
        return generateSendEmbedCode(config, indent);
      case 'add_role':
        return generateAddRoleCode(config, indent);
      case 'remove_role':
        return generateRemoveRoleCode(config, indent);
      case 'kick_member':
        return generateKickMemberCode(config, indent);
      case 'ban_member':
        return generateBanMemberCode(config, indent);
      case 'create_channel':
        return generateCreateChannelCode(config, indent);
      case 'delete_channel':
        return generateDeleteChannelCode(config, indent);
      case 'send_dm':
        return generateSendDMCode(config, indent);
      case 'add_reaction':
        return generateAddReactionCode(config, indent);
      case 'timeout_member':
        return generateTimeoutMemberCode(config, indent);
      case 'set_variable':
        return generateSetVariableCode(config, indent);
      default:
        return `${indent}// Action: ${action} (not implemented)\n`;
    }
  };

  // Generate condition node code
  const generateConditionCode = (node, indent) => {
    const { condition, config } = node.data;
    const connectedTrueNodes = getConnectedNodes(node.id).filter(n => 
      edges.find(e => e.source === node.id && e.target === n.id && e.sourceHandle === 'true')
    );
    const connectedFalseNodes = getConnectedNodes(node.id).filter(n => 
      edges.find(e => e.source === node.id && e.target === n.id && e.sourceHandle === 'false')
    );

    let conditionCode = '';
    
    switch (condition) {
      case 'has_permission':
        conditionCode = `member.permissions.has(PermissionFlagsBits.${config.permission || 'Administrator'})`;
        break;
      case 'has_role':
        conditionCode = `member.roles.cache.has('${config.roleId || 'ROLE_ID'}')`;
        break;
      case 'message_contains':
        conditionCode = `message.content.toLowerCase().includes('${config.text?.toLowerCase() || 'text'}')`;
        break;
      case 'user_is_bot':
        conditionCode = `user.bot`;
        break;
      case 'channel_type':
        conditionCode = `interaction.channel.type === ${config.channelType || 0}`;
        break;
      default:
        conditionCode = 'true';
    }

    let code = `${indent}if (${conditionCode}) {\n`;
    code += generateNodeFlow(connectedTrueNodes, Math.floor(indent.length / 2) + 1);
    
    if (connectedFalseNodes.length > 0) {
      code += `${indent}} else {\n`;
      code += generateNodeFlow(connectedFalseNodes, Math.floor(indent.length / 2) + 1);
    }
    
    code += `${indent}}\n`;
    return code;
  };

  // Action code generators
  const generateSendMessageCode = (config, indent) => {
    const content = config.content || 'Hello!';
    const ephemeral = config.ephemeral ? ', ephemeral: true' : '';
    return `${indent}await interaction.reply({ content: \`${content}\`${ephemeral} });\n`;
  };

  const generateSendEmbedCode = (config, indent) => {
    const title = config.title || 'Embed Title';
    const description = config.description || 'Embed Description';
    const color = config.color || '0x0099FF';
    
    return `${indent}const embed = new EmbedBuilder()
${indent}  .setTitle(\`${title}\`)
${indent}  .setDescription(\`${description}\`)
${indent}  .setColor(${color});
${indent}await interaction.reply({ embeds: [embed] });\n`;
  };

  const generateAddRoleCode = (config, indent) => {
    const roleId = config.roleId || 'ROLE_ID';
    return `${indent}const role = interaction.guild.roles.cache.get('${roleId}');
${indent}if (role) {
${indent}  await interaction.member.roles.add(role);
${indent}  await interaction.reply({ content: 'Role added successfully!', ephemeral: true });
${indent}} else {
${indent}  await interaction.reply({ content: 'Role not found!', ephemeral: true });
${indent}}\n`;
  };

  const generateRemoveRoleCode = (config, indent) => {
    const roleId = config.roleId || 'ROLE_ID';
    return `${indent}const role = interaction.guild.roles.cache.get('${roleId}');
${indent}if (role) {
${indent}  await interaction.member.roles.remove(role);
${indent}  await interaction.reply({ content: 'Role removed successfully!', ephemeral: true });
${indent}} else {
${indent}  await interaction.reply({ content: 'Role not found!', ephemeral: true });
${indent}}\n`;
  };

  const generateKickMemberCode = (config, indent) => {
    const reason = config.reason || 'No reason provided';
    return `${indent}const targetMember = interaction.options.getMember('user');
${indent}if (targetMember && targetMember.kickable) {
${indent}  await targetMember.kick('${reason}');
${indent}  await interaction.reply({ content: \`Kicked \${targetMember.user.tag}\`, ephemeral: true });
${indent}} else {
${indent}  await interaction.reply({ content: 'Cannot kick this member!', ephemeral: true });
${indent}}\n`;
  };

  const generateBanMemberCode = (config, indent) => {
    const reason = config.reason || 'No reason provided';
    const deleteMessageDays = config.deleteMessageDays || 0;
    return `${indent}const targetMember = interaction.options.getMember('user');
${indent}if (targetMember && targetMember.bannable) {
${indent}  await targetMember.ban({ reason: '${reason}', deleteMessageDays: ${deleteMessageDays} });
${indent}  await interaction.reply({ content: \`Banned \${targetMember.user.tag}\`, ephemeral: true });
${indent}} else {
${indent}  await interaction.reply({ content: 'Cannot ban this member!', ephemeral: true });
${indent}}\n`;
  };

  const generateCreateChannelCode = (config, indent) => {
    const channelName = config.channelName || 'new-channel';
    const channelType = config.channelType || 0;
    return `${indent}const channel = await interaction.guild.channels.create({
${indent}  name: '${channelName}',
${indent}  type: ${channelType}
${indent}});
${indent}await interaction.reply({ content: \`Created channel \${channel}\`, ephemeral: true });\n`;
  };

  const generateDeleteChannelCode = (config, indent) => {
    return `${indent}const channel = interaction.options.getChannel('channel');
${indent}if (channel && channel.deletable) {
${indent}  await channel.delete();
${indent}  await interaction.reply({ content: 'Channel deleted successfully!', ephemeral: true });
${indent}} else {
${indent}  await interaction.reply({ content: 'Cannot delete this channel!', ephemeral: true });
${indent}}\n`;
  };

  const generateSendDMCode = (config, indent) => {
    const content = config.content || 'Direct message';
    return `${indent}const targetUser = interaction.options.getUser('user');
${indent}try {
${indent}  await targetUser.send(\`${content}\`);
${indent}  await interaction.reply({ content: 'DM sent successfully!', ephemeral: true });
${indent}} catch (error) {
${indent}  await interaction.reply({ content: 'Could not send DM to user!', ephemeral: true });
${indent}}\n`;
  };

  const generateAddReactionCode = (config, indent) => {
    const emoji = config.emoji || '👍';
    return `${indent}await interaction.message?.react('${emoji}');
${indent}await interaction.reply({ content: 'Reaction added!', ephemeral: true });\n`;
  };

  const generateTimeoutMemberCode = (config, indent) => {
    const duration = config.duration || 60000; // 1 minute default
    const reason = config.reason || 'No reason provided';
    return `${indent}const targetMember = interaction.options.getMember('user');
${indent}if (targetMember && targetMember.moderatable) {
${indent}  await targetMember.timeout(${duration}, '${reason}');
${indent}  await interaction.reply({ content: \`Timed out \${targetMember.user.tag}\`, ephemeral: true });
${indent}} else {
${indent}  await interaction.reply({ content: 'Cannot timeout this member!', ephemeral: true });
${indent}}\n`;
  };

  const generateSetVariableCode = (config, indent) => {
    const variableName = config.variableName || 'customVariable';
    const value = config.value || 'null';
    return `${indent}${variableName} = ${value};
${indent}console.log('Variable ${variableName} set to:', ${value});\n`;
  };

  // Generate the complete bot code
  const generateCode = async () => {
    setIsGenerating(true);
    try {
      const code = getBotTemplate();
      setGeneratedCode(code);
    } catch (error) {
      console.error('Error generating code:', error);
      setGeneratedCode('// Error generating code: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      alert('Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Download code as file
  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bot.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Code Generator</h3>
        <div className="flex gap-2">
          <button
            onClick={generateCode}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Code'}
          </button>
          {generatedCode && (
            <>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Copy
              </button>
              <button
                onClick={downloadCode}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Download
              </button>
            </>
          )}
        </div>
      </div>

      {generatedCode && (
        <div className="bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
            {generatedCode}
          </pre>
        </div>
      )}

      {!generatedCode && (
        <div className="text-center py-8 text-gray-400">
          <p>Connect some blocks and click "Generate Code" to see your Discord.js bot code!</p>
        </div>
      )}
    </div>
  );
}

export { CodeGenerator };
