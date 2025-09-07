import React, { useState } from 'react';
import { X, Users, Crown, Settings, UserPlus, MessageSquare, Eye, EyeOff } from 'lucide-react';

const TeamCollaboration = ({ botData, collaborators, onTeamChange, onClose }) => {
  const [activeTab, setActiveTab] = useState('members');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('editor');
  const [showInviteLink, setShowInviteLink] = useState(false);

  const teamRoles = {
    owner: {
      name: 'Owner',
      color: 'text-red-500',
      permissions: ['read', 'write', 'delete', 'manage', 'deploy']
    },
    admin: {
      name: 'Admin',
      color: 'text-orange-500',
      permissions: ['read', 'write', 'delete', 'manage']
    },
    editor: {
      name: 'Editor',
      color: 'text-blue-500',
      permissions: ['read', 'write']
    },
    viewer: {
      name: 'Viewer',
      color: 'text-gray-500',
      permissions: ['read']
    }
  };

  const mockTeamMembers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff',
      role: 'owner',
      online: true,
      lastSeen: null
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10B981&color=fff',
      role: 'editor',
      online: true,
      lastSeen: null,
      currentlyEditing: 'welcome-command'
    },
    {
      id: 3,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Wilson&background=F59E0B&color=fff',
      role: 'viewer',
      online: false,
      lastSeen: '2 hours ago'
    }
  ];

  const inviteTeamMember = () => {
    if (!newMemberEmail) return;

    const newMember = {
      id: Date.now(),
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      avatar: `https://ui-avatars.com/api/?name=${newMemberEmail.split('@')[0]}&background=6B7280&color=fff`,
      role: newMemberRole,
      online: false,
      lastSeen: 'Never',
      pending: true
    };

    // In real app, send invitation email
    console.log('Inviting team member:', newMember);
    
    setNewMemberEmail('');
    alert(`Invitation sent to ${newMemberEmail}`);
  };

  const generateInviteLink = () => {
    const inviteCode = Math.random().toString(36).substring(2, 15);
    return `https://vexryl.com/invite/${botData.id}/${inviteCode}`;
  };

  const updateMemberRole = (memberId, newRole) => {
    console.log(`Updating member ${memberId} to role ${newRole}`);
    // Update team member role
  };

  const removeMember = (memberId) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      console.log(`Removing member ${memberId}`);
      // Remove team member
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-white">Team Collaboration</h2>
              <p className="text-gray-400 text-sm">Manage your bot development team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex px-6">
            {['members', 'permissions', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'members' && (
            <div className="space-y-6">
              {/* Invite Section */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Invite Team Members</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Role</label>
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={inviteTeamMember}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
                  >
                    <UserPlus className="w-4 h-4" />
                    Send Invitation
                  </button>
                  
                  <button
                    onClick={() => setShowInviteLink(!showInviteLink)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-white"
                  >
                    {showInviteLink ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    Invite Link
                  </button>
                </div>

                {showInviteLink && (
                  <div className="mt-4 p-3 bg-gray-600 rounded-lg">
                    <label className="block text-sm font-medium text-white mb-2">Shareable Invite Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={generateInviteLink()}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-500 rounded-lg text-white font-mono text-sm"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(generateInviteLink())}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white text-sm"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">This link expires in 7 days and grants {teamRoles[newMemberRole].name} access</p>
                  </div>
                )}
              </div>

              {/* Team Members List */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Team Members ({mockTeamMembers.length})</h3>
                
                <div className="space-y-3">
                  {mockTeamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-700 ${
                            member.online ? 'bg-green-400' : 'bg-gray-500'
                          }`} />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">{member.name}</h4>
                            {member.pending && (
                              <span className="px-2 py-1 bg-yellow-600 text-yellow-100 rounded text-xs">
                                Pending
                              </span>
                            )}
                            {member.currentlyEditing && (
                              <span className="px-2 py-1 bg-blue-600 text-blue-100 rounded text-xs">
                                Editing {member.currentlyEditing}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{member.email}</p>
                          <p className="text-xs text-gray-500">
                            {member.online ? 'Online' : `Last seen ${member.lastSeen}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <select
                          value={member.role}
                          onChange={(e) => updateMemberRole(member.id, e.target.value)}
                          disabled={member.role === 'owner'}
                          className={`px-3 py-1 bg-gray-600 border border-gray-500 rounded text-sm ${teamRoles[member.role].color} ${
                            member.role === 'owner' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-500'
                          }`}
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                          <option value="owner">Owner</option>
                        </select>
                        
                        {member.role !== 'owner' && (
                          <button
                            onClick={() => removeMember(member.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Role Permissions</h3>
              
              <div className="space-y-4">
                {Object.entries(teamRoles).map(([roleKey, role]) => (
                  <div key={roleKey} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Crown className={`w-5 h-5 ${role.color}`} />
                      <h4 className={`font-medium ${role.color}`}>{role.name}</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {role.permissions.map((permission) => (
                        <div key={permission} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="capitalize">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Recent Activity</h3>
              
              <div className="space-y-4">
                {/* Mock activity feed */}
                <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                  <img
                    src="https://ui-avatars.com/api/?name=Jane+Smith&background=10B981&color=fff"
                    alt="Jane Smith"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-white text-sm">
                      <span className="font-medium">Jane Smith</span> modified the welcome command
                    </p>
                    <p className="text-gray-400 text-xs">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                  <img
                    src="https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff"
                    alt="John Doe"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-white text-sm">
                      <span className="font-medium">John Doe</span> added a new moderation event
                    </p>
                    <p className="text-gray-400 text-xs">15 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                  <img
                    src="https://ui-avatars.com/api/?name=Jane+Smith&background=10B981&color=fff"
                    alt="Jane Smith"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-white text-sm">
                      <span className="font-medium">Jane Smith</span> deployed bot to production
                    </p>
                    <p className="text-gray-400 text-xs">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Real-time collaboration • Auto-save enabled
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamCollaboration;
