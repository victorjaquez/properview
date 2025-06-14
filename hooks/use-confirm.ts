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
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setPendingAction(null);
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
