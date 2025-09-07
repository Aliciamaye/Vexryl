import React, { useState } from 'react';
import { HOSTING_SERVICES, HostingService } from '../services/HostingService.js';

export default function HostingManager({ bot, onClose }) {
  const [selectedService, setSelectedService] = useState('railway');
  const [deploymentConfig, setDeploymentConfig] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState('select'); // select, configure, deploy, done

  const supportedServices = Object.entries(HOSTING_SERVICES).filter(([key, service]) => service.supported);

  const generateDeployment = async () => {
    setIsGenerating(true);
    try {
      const hostingService = new HostingService(selectedService);
      const envVars = [
        { key: 'DISCORD_TOKEN', description: 'Your bot token', example: 'your_bot_token_here' },
        { key: 'CLIENT_ID', description: 'Your application ID', example: 'your_client_id_here' }
      ];

      const config = hostingService.generateConfig(bot, envVars);
      setDeploymentConfig(config);
      setStep('deploy');
    } catch (error) {
      console.error('Deployment generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFiles = () => {
    if (!deploymentConfig) return;

    // Create and download zip file with all the generated files
    const files = deploymentConfig.files;
    Object.entries(files).forEach(([filename, content]) => {
      const blob = new Blob([typeof content === 'string' ? content : JSON.stringify(content, null, 2)], 
        { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-lg border border-gray-800 w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Deploy Your Bot</h2>
            <p className="text-gray-400">Choose a hosting service and deploy your bot to the cloud</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {step === 'select' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Choose Hosting Service</h3>
              
              {/* Popular Services */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-green-400 mb-3">🌟 Recommended</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {supportedServices.filter(([key, service]) => service.popular).map(([key, service]) => (
                    <ServiceCard
                      key={key}
                      serviceKey={key}
                      service={service}
                      selected={selectedService === key}
                      onSelect={setSelectedService}
                    />
                  ))}
                </div>
              </div>

              {/* Other Services */}
              <div>
                <h4 className="text-lg font-medium text-gray-400 mb-3">Other Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {supportedServices.filter(([key, service]) => !service.popular).map(([key, service]) => (
                    <ServiceCard
                      key={key}
                      serviceKey={key}
                      service={service}
                      selected={selectedService === key}
                      onSelect={setSelectedService}
                    />
                  ))}
                </div>
              </div>

              {/* Selected Service Details */}
              {selectedService && (
                <div className="mt-6 p-4 bg-neutral-800 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-medium text-white mb-2">
                    Selected: {HOSTING_SERVICES[selectedService].name}
                  </h4>
                  <div className="text-gray-300 space-y-2">
                    <p><strong>Setup Time:</strong> {HOSTING_SERVICES[selectedService].setupTime}</p>
                    <p><strong>Difficulty:</strong> {HOSTING_SERVICES[selectedService].difficulty}</p>
                    <p><strong>Pricing:</strong> {HOSTING_SERVICES[selectedService].pricing}</p>
                    <div>
                      <strong>Features:</strong>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {HOSTING_SERVICES[selectedService].features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={generateDeployment}
                  disabled={!selectedService || isGenerating}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate Deployment'}
                </button>
              </div>
            </div>
          )}

          {step === 'deploy' && deploymentConfig && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Deployment for {HOSTING_SERVICES[selectedService].name}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Files */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Generated Files</h4>
                  <div className="space-y-2">
                    {Object.entries(deploymentConfig.files).map(([filename, content]) => (
                      <div key={filename} className="p-3 bg-neutral-800 rounded border border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-green-400">{filename}</span>
                          <span className="text-xs text-gray-400">
                            {typeof content === 'string' ? content.length : JSON.stringify(content).length} bytes
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={downloadFiles}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download All Files
                  </button>
                </div>

                {/* Deployment Steps */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Deployment Steps</h4>
                  <div className="space-y-3">
                    {deploymentConfig.deployment.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Environment Variables */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-white mb-3">Environment Variables</h4>
                <div className="bg-neutral-800 rounded p-4 border border-gray-700">
                  <div className="font-mono text-sm">
                    {deploymentConfig.deployment.envVars.map((env, index) => (
                      <div key={index} className="mb-2">
                        <span className="text-green-400">{env.key}</span>
                        <span className="text-gray-400">=</span>
                        <span className="text-yellow-400">{env.example}</span>
                        {env.description && (
                          <span className="text-gray-500 ml-2"># {env.description}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep('select')}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('done')}
                  className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark as Deployed
                </button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-4">Deployment Ready!</h3>
              <p className="text-gray-400 mb-6">
                Your bot deployment files have been generated. Follow the steps to deploy your bot.
              </p>
              <div className="space-y-3">
                <p className="text-green-400">✅ Files generated</p>
                <p className="text-green-400">✅ Configuration ready</p>
                <p className="text-green-400">✅ Instructions provided</p>
              </div>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ serviceKey, service, selected, onSelect }) {
  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition ${
        selected
          ? 'border-green-500 bg-green-900/20'
          : 'border-gray-700 bg-neutral-800 hover:border-gray-600'
      }`}
      onClick={() => onSelect(serviceKey)}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
          <span className="text-xs font-bold text-gray-800">
            {service.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-white">{service.name}</h3>
          {service.popular && (
            <span className="text-xs text-green-400">Popular</span>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-400 mb-3">{service.description}</p>
      
      <div className="space-y-1 text-xs text-gray-500">
        <div>💰 {service.pricing}</div>
        <div>⏱️ {service.setupTime}</div>
        <div>📊 {service.difficulty}</div>
      </div>

      {service.note && (
        <div className="mt-2 text-xs text-yellow-400">{service.note}</div>
      )}
    </div>
  );
}
