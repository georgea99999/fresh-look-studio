import { useState } from 'react';
import { Minus, Plus, Trash2, Package, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongName = item.name.length > 20;

  return (
    <div className={cn(
      "inventory-row border-b border-border last:border-b-0",
      item.quantity === 0 && "opacity-50"
    )}>
      <div className="flex items-center gap-2 px-3 py-3">
        {/* Checkbox */}
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelect?.(item.id)}
          className="border-muted-foreground/50 flex-shrink-0"
        />
        
        {/* Icon */}
        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="w-4 h-4 text-muted-foreground" />
        </div>
        
        {/* Name & Box */}
        <div 
          className={cn(
            "flex-1 min-w-0 cursor-pointer",
            isLongName && "hover:bg-muted/50 rounded px-1 -mx-1"
          )}
          onClick={() => isLongName && setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-1">
            <p className={cn(
              "font-medium text-sm",
              !isExpanded && "truncate"
            )}>
              {item.name}
            </p>
            {isLongName && (
              <Button variant="ghost" size="icon" className="h-4 w-4 flex-shrink-0 p-0">
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{item.box}</p>
        </div>
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => onUpdateQuantity(item.id, -1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdateQuantityDirect(item.id, parseInt(e.target.value) || 0)}
            className="w-12 h-7 text-center px-1 text-sm"
            min={0}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => onUpdateQuantity(item.id, 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Delete */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Expanded name display */}
      {isExpanded && isLongName && (
        <div className="px-3 pb-3 pt-0">
          <div className="bg-muted/50 rounded-md p-2 text-sm">
            <span className="text-muted-foreground text-xs">Full name: </span>
            {item.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockItemRow;
