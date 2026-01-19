import { useEffect, useState } from 'react';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UndoNotificationProps {
  show: boolean;
  onUndo: () => void;
  onDismiss: () => void;
}

const UndoNotification = ({ show, onUndo, onDismiss }: UndoNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-50"
    )}>
      <span className="text-sm">Item removed</span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          onUndo();
          setIsVisible(false);
        }}
        className="gap-1"
      >
        <Undo2 className="h-4 w-4" />
        Undo
      </Button>
    </div>
  );
};

export default UndoNotification;
