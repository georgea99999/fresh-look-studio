import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface SortableBoxHeaderProps {
  id: string;
  boxName: string;
  itemCount: number;
}

const SortableBoxHeader = ({ id, boxName, itemCount }: SortableBoxHeaderProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition ?? 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30",
        isDragging && "shadow-xl ring-2 ring-primary/30 rounded-md bg-card"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none w-6 h-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      <span className="font-semibold text-sm">{boxName}</span>
      <span className="text-xs text-muted-foreground ml-auto">{itemCount} items</span>
    </div>
  );
};

export default SortableBoxHeader;
