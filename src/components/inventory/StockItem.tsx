import { Minus, Plus, Trash2, Package } from 'lucide-react';
import { StockItem as StockItemType } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface StockItemProps {
  item: StockItemType;
  onUpdateQuantity: (id: number, change: number) => void;
  onUpdateQuantityDirect: (id: number, value: number) => void;
  onDelete: (id: number) => void;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

const StockItemRow = ({ 
  item, 
  onUpdateQuantity, 
  onUpdateQuantityDirect, 
  onDelete,
  isSelected,
  onSelect 
}: StockItemProps) => {
  return (
    <div className={cn(
      "inventory-row flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0",
      item.quantity === 0 && "opacity-50"
    )}>
      {/* Checkbox */}
      <Checkbox 
        checked={isSelected}
        onCheckedChange={() => onSelect?.(item.id)}
        className="border-muted-foreground/50"
      />
      
      {/* Icon */}
      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
        <Package className="w-5 h-5 text-muted-foreground" />
      </div>
      
      {/* Name & Box */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.box}</p>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => onUpdateQuantity(item.id, -1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdateQuantityDirect(item.id, parseInt(e.target.value) || 0)}
          className="w-14 h-8 text-center px-1 text-sm"
          min={0}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => onUpdateQuantity(item.id, 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Delete */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default StockItemRow;
