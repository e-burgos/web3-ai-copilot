import { useState, useEffect } from 'react';
import { Modal, InputSelect, InputSelectOption } from '@e-burgos/tucu-ui';
import { userChatStore } from '../../store/userChatStore';
import { useProviders } from '../../queries/useProviders';

export function ModelSelectorModal() {
  const {
    modelModalOpen,
    setModelModalOpen,
    model,
    provider,
    setModel,
    setProvider,
    setChatOpen,
  } = userChatStore();
  const { data: providersData } = useProviders();
  const [selectedProvider, setSelectedProvider] = useState<
    'groq' | 'openai' | 'anthropic' | 'llama' | null
  >(provider);

  const providers = providersData?.providers || [];

  // Sync selectedProvider with current provider when modal opens
  // Only set if the provider is available
  useEffect(() => {
    if (modelModalOpen) {
      const currentProvider = providers.find((p) => p.name === provider);
      if (currentProvider?.available) {
        setSelectedProvider(provider);
      } else {
        // If current provider is not available, find first available provider
        const firstAvailable = providers.find((p) => p.available);
        if (firstAvailable) {
          setSelectedProvider(firstAvailable.name as typeof provider);
          setProvider(firstAvailable.name as typeof provider);
          if (firstAvailable.models.length > 0) {
            setModel(firstAvailable.models[0]);
          }
        } else {
          setSelectedProvider(null);
        }
      }
    }
  }, [modelModalOpen, provider, providers, setProvider, setModel]);
  const currentProviderData = providers.find(
    (p) => p.name === selectedProvider
  );

  const handleProviderChange = (value: InputSelectOption) => {
    const providerName = value.value as
      | 'groq'
      | 'openai'
      | 'anthropic'
      | 'llama';
    const providerData = providers.find((p) => p.name === providerName);
    const option = providerOptions.find((opt) => opt.value === providerName);

    // Only allow selection if provider is available
    // Check both providerData availability and option disabled state
    if (!providerData?.available || option?.disabled) {
      // If trying to select unavailable provider, reset to first available
      const firstAvailable = providers.find((p) => p.available);
      if (firstAvailable && firstAvailable.name !== selectedProvider) {
        setSelectedProvider(firstAvailable.name as typeof provider);
        if (firstAvailable.models.length > 0) {
          setModel(firstAvailable.models[0]);
        }
      }
      return;
    }

    setSelectedProvider(providerName);
    // Reset model when provider changes
    if (providerData && providerData.models.length > 0) {
      setModel(providerData.models[0]);
    }
  };

  const handleModelChange = (value: InputSelectOption) => {
    // Prevent model selection if provider is not available
    if (!currentProviderData?.available) {
      return;
    }

    const selectedModel = value.value as string;
    setModel(selectedModel);
    if (selectedProvider && currentProviderData?.available) {
      setProvider(selectedProvider);
    }
    setModelModalOpen(false);
    setChatOpen(true);
  };

  const providerOptions: (InputSelectOption & { disabled?: boolean })[] = [
    { name: 'Groq', value: 'groq' },
    { name: 'OpenAI', value: 'openai' },
    { name: 'Anthropic', value: 'anthropic' },
    { name: 'Llama', value: 'llama' },
  ].map((p) => {
    const providerData = providers.find((pr) => pr.name === p.value);
    const isAvailable = providerData?.available ?? false;
    return {
      name: isAvailable ? p.name : `${p.name} (Not Available)`,
      value: p.value,
      disabled: !isAvailable,
    };
  });

  const modelOptions: InputSelectOption[] =
    currentProviderData?.models.map((m) => ({ name: m, value: m })) || [];

  return (
    <Modal
      isOpen={modelModalOpen}
      setIsOpen={setModelModalOpen}
      onClose={() => {
        setModelModalOpen(false);
        setChatOpen(true);
      }}
      closeable={true}
      hideButtons
      text={{
        title: 'Select Provider & Model',
      }}
    >
      <div className="flex flex-col gap-4 h-[350px]">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Provider
          </label>
          <InputSelect
            options={providerOptions}
            value={
              selectedProvider &&
              currentProviderData?.available &&
              providerOptions.some(
                (opt) => opt.value === selectedProvider && !opt.disabled
              )
                ? selectedProvider
                : (providerOptions.find((opt) => !opt.disabled)?.value as
                    | typeof provider
                    | undefined) || provider
            }
            onChange={handleProviderChange}
          />
          {selectedProvider &&
            currentProviderData &&
            !currentProviderData.available && (
              <p className="text-xs text-red-500 dark:text-red-400">
                This provider is not available. Please configure the API key in
                the backend.
              </p>
            )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Model
          </label>
          <InputSelect
            options={modelOptions}
            value={model}
            onChange={handleModelChange}
            disabled={
              !currentProviderData?.available || modelOptions.length === 0
            }
          />
          {modelOptions.length === 0 && currentProviderData?.available && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No models available for this provider.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
