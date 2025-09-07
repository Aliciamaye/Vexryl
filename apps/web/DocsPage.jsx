import React, { useState } from "react";
// Import heroicons manually with jsx components instead
const BookOpenIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CodeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const RocketLaunchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const UserGroupIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ClockIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const GlobeAltIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const DocumentTextIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sidebarSections = [
    { id: "overview", title: "Overview", icon: BookOpenIcon },
    { id: "getting-started", title: "Getting Started", icon: RocketLaunchIcon },
    { id: "visual-builder", title: "Visual Builder", icon: CodeIcon },
    { id: "api-reference", title: "API Reference", icon: DocumentTextIcon },
    { id: "blocks", title: "Block Library", icon: GlobeAltIcon },
    { id: "collaboration", title: "Team Collaboration", icon: UserGroupIcon },
    { id: "deployment", title: "Deployment", icon: RocketLaunchIcon }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-xl">
        <h1 className="text-4xl font-bold mb-4">Vexryl Documentation</h1>
        <p className="text-xl mb-6">The most advanced visual Discord bot builder platform.</p>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5" />
            <span>Development Time: 1 Month</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="w-5 h-5" />
            <span>Team: 5 Engineers</span>
          </div>
          <div className="flex items-center space-x-2">
            <StarIcon className="w-5 h-5" />
            <span>Built with React & Node.js</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CodeIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">Visual Programming</h3>
          </div>
          <p className="text-gray-600">Build Discord bots using an intuitive drag-and-drop interface with no coding required.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Real-time Collaboration</h3>
          </div>
          <p className="text-gray-600">Work with your team in real-time with live cursors, presence indicators, and role-based permissions.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <RocketLaunchIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">One-Click Deploy</h3>
          </div>
          <p className="text-gray-600">Deploy your bots to multiple hosting platforms with a single click. No server management needed.</p>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">About Vexryl</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Story</h3>
            <p className="text-gray-600 mb-4">
              Vexryl was conceived and built in just one month by a dedicated team of 5 engineers who saw the need for a more intuitive and powerful Discord bot creation platform. 
              Inspired by the success of BotGhost but frustrated by its limitations, we set out to create something better.
            </p>
            <p className="text-gray-600">
              Our mission is to democratize Discord bot development, making it accessible to everyone regardless of their coding experience, 
              while providing the advanced features that power users demand.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Technology Stack</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>React 18 + Vite for lightning-fast development</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Node.js + Express for robust backend services</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>ReactFlow for visual programming interface</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Discord.js v14 for complete API coverage</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>WebSockets for real-time collaboration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Development Timeline</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-purple-600">W1</span>
            </div>
            <div>
              <h4 className="font-semibold">Week 1: Foundation & Architecture</h4>
              <p className="text-gray-600">Core platform architecture, React components, and basic visual builder interface.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600">W2</span>
            </div>
            <div>
              <h4 className="font-semibold">Week 2: Discord Integration & Block System</h4>
              <p className="text-gray-600">Complete Discord.js integration, block library development, and code generation engine.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-green-600">W3</span>
            </div>
            <div>
              <h4 className="font-semibold">Week 3: Advanced Features & Collaboration</h4>
              <p className="text-gray-600">Real-time collaboration system, marketplace integration, and team management features.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-yellow-600">W4</span>
            </div>
            <div>
              <h4 className="font-semibold">Week 4: Deployment & Polish</h4>
              <p className="text-gray-600">Multi-platform deployment system, UI/UX refinements, and comprehensive testing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGettingStarted = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Getting Started</h1>
        <p className="text-gray-600 text-lg">Learn how to create your first Discord bot with Vexryl in just a few minutes.</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Prerequisites</h3>
        <ul className="list-disc list-inside text-yellow-700 space-y-1">
          <li>A Discord account</li>
          <li>A Discord server where you have administrator permissions</li>
          <li>Basic understanding of Discord's permission system (optional)</li>
        </ul>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold">1</span>
            </div>
            <h3 className="text-xl font-semibold">Create Your Discord Application</h3>
          </div>
          <div className="ml-11">
            <p className="text-gray-600 mb-4">First, you'll need to create a Discord application and bot user.</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Go to the <a href="https://discord.com/developers/applications" className="text-purple-600 hover:underline">Discord Developer Portal</a></li>
              <li>Click "New Application" and give it a name</li>
              <li>Navigate to the "Bot" section in the sidebar</li>
              <li>Click "Add Bot" and confirm</li>
              <li>Copy your bot token (keep this secure!)</li>
            </ol>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold">2</span>
            </div>
            <h3 className="text-xl font-semibold">Connect to Vexryl</h3>
          </div>
          <div className="ml-11">
            <p className="text-gray-600 mb-4">Connect your Discord bot to Vexryl's platform.</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Sign up for a Vexryl account</li>
              <li>Click "Create New Bot" on your dashboard</li>
              <li>Enter your bot token in the setup wizard</li>
              <li>Choose your bot's name and description</li>
              <li>Select the servers you want to add your bot to</li>
            </ol>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold">3</span>
            </div>
            <h3 className="text-xl font-semibold">Build Your First Flow</h3>
          </div>
          <div className="ml-11">
            <p className="text-gray-600 mb-4">Use the visual builder to create your bot's functionality.</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Open the Visual Builder from your bot dashboard</li>
              <li>Drag an "On Message" trigger from the Events section</li>
              <li>Connect it to a "Send Message" action from the Actions section</li>
              <li>Configure the message content in the right panel</li>
              <li>Click "Save" to update your bot</li>
            </ol>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold">4</span>
            </div>
            <h3 className="text-xl font-semibold">Deploy Your Bot</h3>
          </div>
          <div className="ml-11">
            <p className="text-gray-600 mb-4">Deploy your bot to the cloud with one click.</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click the "Deploy" button in the top toolbar</li>
              <li>Choose your preferred hosting platform</li>
              <li>Configure any environment variables</li>
              <li>Click "Deploy Now" and wait for the process to complete</li>
              <li>Your bot is now live and ready to use!</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">🎉 Congratulations!</h3>
        <p className="text-green-700">You've successfully created and deployed your first Discord bot with Vexryl. Check out the other sections to learn about advanced features like variables, conditions, and team collaboration.</p>
      </div>
    </div>
  );

  const renderVisualBuilder = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Visual Builder</h1>
        <p className="text-gray-600 text-lg">Master the art of visual bot programming with Vexryl's advanced block-based system.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Interface Overview</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="w-3 h-3 bg-purple-600 rounded"></span>
              </div>
              <div>
                <h4 className="font-medium">Block Library (Left Panel)</h4>
                <p className="text-sm text-gray-600">Drag blocks from here to build your bot's logic</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="w-3 h-3 bg-blue-600 rounded"></span>
              </div>
              <div>
                <h4 className="font-medium">Canvas (Center)</h4>
                <p className="text-sm text-gray-600">Your visual programming workspace</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="w-3 h-3 bg-green-600 rounded"></span>
              </div>
              <div>
                <h4 className="font-medium">Configuration (Right Panel)</h4>
                <p className="text-sm text-gray-600">Configure selected blocks and manage variables</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Block Categories</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="font-medium">Events</span>
              <span className="text-sm text-gray-500">Triggers that start your flows</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="font-medium">Actions</span>
              <span className="text-sm text-gray-500">Things your bot can do</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="font-medium">Conditions</span>
              <span className="text-sm text-gray-500">Logic and decision making</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="font-medium">Variables</span>
              <span className="text-sm text-gray-500">Store and manipulate data</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="font-medium">Integrations</span>
              <span className="text-sm text-gray-500">Connect to external services</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-6">Advanced Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <UserGroupIcon className="w-5 h-5 text-purple-600" />
              <span>Real-time Collaboration</span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Live cursors show team member activity</li>
              <li>• Presence indicators for active collaborators</li>
              <li>• Role-based permissions and access control</li>
              <li>• Conflict resolution for simultaneous edits</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <CodeIcon className="w-5 h-5 text-blue-600" />
              <span>Variable System</span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Global and local variable scopes</li>
              <li>• Dynamic variable references</li>
              <li>• Type validation and autocomplete</li>
              <li>• Variable usage tracking</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg border border-purple-200">
        <h3 className="text-xl font-semibold mb-4">Pro Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">💡</span>
              </div>
              <div>
                <h5 className="font-medium">Use keyboard shortcuts</h5>
                <p className="text-sm text-gray-600">Press Ctrl+Space to open the block search, Del to delete selected blocks</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">🔍</span>
              </div>
              <div>
                <h5 className="font-medium">Group related blocks</h5>
                <p className="text-sm text-gray-600">Select multiple blocks and use Ctrl+G to group them for better organization</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">⚡</span>
              </div>
              <div>
                <h5 className="font-medium">Test before deploying</h5>
                <p className="text-sm text-gray-600">Use the integrated debugger to test your flows locally before going live</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">🎨</span>
              </div>
              <div>
                <h5 className="font-medium">Customize block colors</h5>
                <p className="text-sm text-gray-600">Right-click any block to change its color for better visual organization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "getting-started":
        return renderGettingStarted();
      case "visual-builder":
        return renderVisualBuilder();
      case "api-reference":
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">API Reference</h1>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">REST API Endpoints</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">GET /api/bots</code>
                  <p className="text-gray-600 mt-1">Retrieve all bots for the authenticated user</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">POST /api/bots</code>
                  <p className="text-gray-600 mt-1">Create a new bot</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">PUT /api/bots/:id</code>
                  <p className="text-gray-600 mt-1">Update an existing bot</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">DELETE /api/bots/:id</code>
                  <p className="text-gray-600 mt-1">Delete a bot</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "blocks":
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">Block Library</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Event Blocks</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded">
                    <h4 className="font-medium">On Message</h4>
                    <p className="text-sm text-gray-600">Triggers when a message is sent in a channel</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded">
                    <h4 className="font-medium">On Member Join</h4>
                    <p className="text-sm text-gray-600">Triggers when a user joins the server</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded">
                    <h4 className="font-medium">On Reaction Add</h4>
                    <p className="text-sm text-gray-600">Triggers when a reaction is added to a message</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Action Blocks</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded">
                    <h4 className="font-medium">Send Message</h4>
                    <p className="text-sm text-gray-600">Send a message to a channel</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <h4 className="font-medium">Add Role</h4>
                    <p className="text-sm text-gray-600">Add a role to a user</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <h4 className="font-medium">Create Embed</h4>
                    <p className="text-sm text-gray-600">Create a rich embed message</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "collaboration":
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">Team Collaboration</h1>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">Real-time Features</h2>
              <p className="text-gray-600 mb-6">Vexryl's collaboration system allows multiple team members to work on the same bot simultaneously with live updates and conflict resolution.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Live Collaboration</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• See team members' cursors in real-time</li>
                    <li>• Live presence indicators</li>
                    <li>• Automatic conflict resolution</li>
                    <li>• Activity feed with change history</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Permissions</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Owner: Full access to all features</li>
                    <li>• Admin: Manage team and bot settings</li>
                    <li>• Editor: Edit bot flows and configurations</li>
                    <li>• Viewer: Read-only access to bots</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      case "deployment":
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">Deployment</h1>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">Supported Platforms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold mb-2">Railway</h3>
                  <p className="text-sm text-gray-600 mb-3">Deploy with automatic scaling and built-in database support.</p>
                  <div className="text-xs text-gray-500">Free tier available</div>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold mb-2">Render</h3>
                  <p className="text-sm text-gray-600 mb-3">Simple deployment with automatic HTTPS and custom domains.</p>
                  <div className="text-xs text-gray-500">Free tier available</div>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold mb-2">Heroku</h3>
                  <p className="text-sm text-gray-600 mb-3">Industry standard platform with extensive add-on ecosystem.</p>
                  <div className="text-xs text-gray-500">Paid plans only</div>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold mb-2">DigitalOcean</h3>
                  <p className="text-sm text-gray-600 mb-3">App Platform with predictable pricing and high performance.</p>
                  <div className="text-xs text-gray-500">Starter tier available</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"></div>
              <span className="text-xl font-bold">Vexryl Docs</span>
            </div>
            <nav className="space-y-1">
              {sidebarSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-purple-100 text-purple-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="max-w-4xl mx-auto py-8 px-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
