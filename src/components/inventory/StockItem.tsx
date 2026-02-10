import { useState } from 'react';
import { Minus, Plus, Trash2, Package, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { StockItem as StockItemType, BOX_OPTIONS } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface StockItemProps {
  item: StockItemType;
  onUpdateQuantity: (id: string, change: number) => void;
  onUpdateQuantityDirect: (id: string, value: number) => void;
  onDelete: (id: string) => void;
  onEditItem?: (id: string, updates: { name: string; box: string }) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const StockItemRow = ({ 
  item, 
  onUpdateQuantity, 
  onUpdateQuantityDirect, 
  onDelete,
  onEditItem,
  isSelected,
  onSelect 
}: StockItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editBox, setEditBox] = useState(item.box);
  const isLongName = item.name.length > 20;

  const handleStartEdit = () => {
    setEditName(item.name);
    setEditBox(item.box);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && onEditItem) {
      onEditItem(item.id, { name: editName.trim(), box: editBox });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(item.name);
    setEditBox(item.box);
  };

  if (isEditing) {
    return (
      <div className="border-b border-border p-3 bg-accent/20 space-y-2">
        <div className="space-y-2">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Product name"
            autoFocus
          />
          <Select value={editBox} onValueChange={setEditBox}>
            <SelectTrigger className="w-full h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-popover">
              {BOX_OPTIONS.map(box => (
                <SelectItem key={box} value={box}>{box}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSaveEdit} disabled={!editName.trim()}>
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }

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
        
        {/* Edit Icon */}
        <button
          onClick={handleStartEdit}
          className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-muted-foreground/20 transition-colors"
          title="Edit item"
        >
          <Package className="w-4 h-4 text-muted-foreground" />
        </button>
        
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
