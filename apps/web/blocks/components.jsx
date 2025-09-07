// JSX Component Registry for Block Configuration UI
import React from 'react';

// Flow JSX Components
import OnMessageReceivedJSX from './flows/OnMessageReceived.jsx';
import OnUserJoinedJSX from './flows/OnUserJoined.jsx';
import OnButtonClickJSX from './flows/OnButtonClick.jsx';
import OnReactionAddedJSX from './flows/OnReactionAdded.jsx';

// Action JSX Components
import MessageTextJSX from './actions/MessageText.jsx';
import MessageEmbedJSX from './actions/MessageEmbed.jsx';
import MessageEditJSX from './actions/MessageEdit.jsx';
import MessageDeleteJSX from './actions/MessageDelete.jsx';
import UserKickJSX from './actions/UserKick.jsx';
import UserBanJSX from './actions/UserBan.jsx';
import UserUnbanJSX from './actions/UserUnban.jsx';
import UserTimeoutJSX from './actions/UserTimeout.jsx';
import UserNicknameJSX from './actions/UserNickname.jsx';
import RoleAddJSX from './actions/RoleAdd.jsx';
import RoleRemoveJSX from './actions/RoleRemove.jsx';
import ReactionAddJSX from './actions/ReactionAdd.jsx';
import ReactionRemoveJSX from './actions/ReactionRemove.jsx';
import ButtonAddJSX from './actions/ButtonAdd.jsx';
import MenuSelectJSX from './actions/MenuSelect.jsx';
import ModalCreateJSX from './actions/ModalCreate.jsx';
import ChannelCreateJSX from './actions/ChannelCreate.jsx';
import VoiceMoveJSX from './actions/VoiceMove.jsx';
import ThreadCreateJSX from './actions/ThreadCreate.jsx';

// Condition JSX Components
import UserHasRoleJSX from './conditions/UserHasRole.jsx';
import MessageContainsJSX from './conditions/MessageContains.jsx';
import UserPermissionCheckJSX from './conditions/UserPermissionCheck.jsx';
import UserIsBotJSX from './conditions/UserIsBot.jsx';
import ChannelTypeIsJSX from './conditions/ChannelTypeIs.jsx';
import MessageLengthCheckJSX from './conditions/MessageLengthCheck.jsx';
import MessageHasAttachmentJSX from './conditions/MessageHasAttachment.jsx';
import ChannelNameContainsJSX from './conditions/ChannelNameContains.jsx';

// Option JSX Components
import VariableGetJSX from './options/VariableGet.jsx';
import VariableSetJSX from './options/VariableSet.jsx';

export const BlockComponentRegistry = {
  // Flow Components
  flows: {
    'on_message_received': OnMessageReceivedJSX,
    'on_user_joined': OnUserJoinedJSX,
    'on_button_click': OnButtonClickJSX,
    'on_reaction_added': OnReactionAddedJSX,
  },
  
  // Action Components
  actions: {
    'message_text': MessageTextJSX,
    'message_embed': MessageEmbedJSX,
    'message_edit': MessageEditJSX,
    'message_delete': MessageDeleteJSX,
    'user_kick': UserKickJSX,
    'user_ban': UserBanJSX,
    'user_unban': UserUnbanJSX,
    'user_timeout': UserTimeoutJSX,
    'user_nickname': UserNicknameJSX,
    'role_add': RoleAddJSX,
    'role_remove': RoleRemoveJSX,
    'reaction_add': ReactionAddJSX,
    'reaction_remove': ReactionRemoveJSX,
    'button_add': ButtonAddJSX,
    'menu_select': MenuSelectJSX,
    'modal_create': ModalCreateJSX,
    'channel_create': ChannelCreateJSX,
    'voice_move': VoiceMoveJSX,
    'thread_create': ThreadCreateJSX,
  },
  
  // Condition Components
  conditions: {
    'user_has_role': UserHasRoleJSX,
    'message_contains': MessageContainsJSX,
    'user_permission_check': UserPermissionCheckJSX,
    'user_is_bot': UserIsBotJSX,
    'channel_type_is': ChannelTypeIsJSX,
    'message_length_check': MessageLengthCheckJSX,
    'message_has_attachment': MessageHasAttachmentJSX,
    'channel_name_contains': ChannelNameContainsJSX,
  },
  
  // Option Components
  options: {
    'variable_get': VariableGetJSX,
    'variable_set': VariableSetJSX,
  },
};

// Helper function to get component by block type and ID
export const getBlockComponent = (category, blockId) => {
  const categoryComponents = BlockComponentRegistry[category];
  if (!categoryComponents) {
    console.warn(`No components found for category: ${category}`);
    return null;
  }
  
  const component = categoryComponents[blockId];
  if (!component) {
    console.warn(`No component found for block: ${category}/${blockId}`);
    return null;
  }
  
  return component;
};

// Higher-order component for block configuration
export const BlockConfigWrapper = ({ block, config, onChange }) => {
  const Component = getBlockComponent(block.category, block.id);
  
  if (!Component) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">
          Configuration component not found for: {block.category}/{block.id}
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{block.name}</h3>
        <p className="text-sm text-gray-600">{block.description}</p>
      </div>
      <Component config={config} onChange={onChange} />
    </div>
  );
};

export default BlockComponentRegistry;
