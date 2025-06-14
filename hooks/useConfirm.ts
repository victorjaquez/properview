import { useState } from 'react';

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    (() => Promise<void>) | null
  >(null);

  const confirm = (action: () => Promise<void>) => {
    setPendingAction(() => action);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;

    setIsLoading(true);
    try {
      await pendingAction();
      setIsOpen(false);
      setPendingAction(null);
    } catch (error) {
      console.error('Action failed:', error);
      // Re-throw so caller can handle the error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setPendingAction(null);
  };

  return {
    isOpen,
    isLoading,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
