import { useState } from 'react';
import { Filter, Download, Package } from 'lucide-react';
import { StockItem, BOX_OPTIONS, DeckOrderItem } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import StockItemRow from './StockItem';
import SendToDeckOrderDialog from './SendToDeckOrderDialog';

interface StockListProps {
  items: StockItem[];
  searchTerm: string;
  selectedBox: string;
  onBoxChange: (value: string) => void;
  onUpdateQuantity: (id: number, change: number) => void;
  onUpdateQuantityDirect: (id: number, value: number) => void;
  onDelete: (id: number) => void;
  totalItems: number;
  totalQuantity: number;
  onSendToDeckOrder?: (item: Omit<DeckOrderItem, 'id'>) => void;
}

const StockList = ({
  items,
  searchTerm,
  selectedBox,
  onBoxChange,
  onUpdateQuantity,
  onUpdateQuantityDirect,
  onDelete,
  totalItems,
  totalQuantity,
  onSendToDeckOrder,
}: StockListProps) => {
  const [selectedItemForOrder, setSelectedItemForOrder] = useState<StockItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExport = () => {
    if (items.length === 0) {
      alert('No items to export');
      return;
    }
    let csv = 'Item Name,Quantity,Box\n';
    items.forEach(item => {
      csv += `"${item.name}",${item.quantity},"${item.box}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OKTO-DECK-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleSelectForOrder = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setSelectedItemForOrder(item);
      setDialogOpen(true);
    }
  };

  const handleConfirmSendToOrder = (orderItem: Omit<DeckOrderItem, 'id'>) => {
    onSendToDeckOrder?.(orderItem);
    setSelectedItemForOrder(null);
  };

  // Group items by box
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.box]) {
      acc[item.box] = [];
    }
    acc[item.box].push(item);
    return acc;
  }, {} as Record<string, StockItem[]>);

  return (
    <div className="flex flex-col h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 p-4 pb-2">
        <Card className="stats-gradient text-primary-foreground">
          <CardContent className="p-4">
            <p className="text-3xl font-bold">{totalItems}</p>
            <p className="text-sm opacity-80">Total Items</p>
          </CardContent>
        </Card>
        <Card className="stats-gradient text-primary-foreground">
          <CardContent className="p-4">
            <p className="text-3xl font-bold">{totalQuantity}</p>
            <p className="text-sm opacity-80">Total Units</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={() => onBoxChange('')}
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        
        <Select value={selectedBox} onValueChange={onBoxChange}>
          <SelectTrigger className="flex-1 h-9">
            <SelectValue placeholder="All Boxes" />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-popover">
            <SelectItem value="all">All Boxes</SelectItem>
            {BOX_OPTIONS.map(box => (
              <SelectItem key={box} value={box}>{box}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 text-sm font-medium text-muted-foreground">
        <div className="w-4 flex-shrink-0" />
        <div className="w-8 flex-shrink-0" />
        <div className="flex-1 min-w-0">Name</div>
        <div className="w-24 text-center flex-shrink-0">Qty</div>
        <div className="w-7 flex-shrink-0" />
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-auto bg-card">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mb-3 opacity-50" />
            <p>No items found</p>
          </div>
        ) : selectedBox || searchTerm ? (
          // Flat list when filtering
          items.map(item => (
            <StockItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onUpdateQuantityDirect={onUpdateQuantityDirect}
              onDelete={onDelete}
              onSelect={handleSelectForOrder}
            />
          ))
        ) : (
          // Grouped by box
          Object.entries(groupedItems).map(([box, boxItems]) => (
            <div key={box}>
              <div className="px-4 py-2 bg-muted/30 text-sm font-semibold text-muted-foreground sticky top-0">
                {box}
              </div>
              {boxItems.map(item => (
                <StockItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onUpdateQuantityDirect={onUpdateQuantityDirect}
                  onDelete={onDelete}
                  onSelect={handleSelectForOrder}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 bg-card border-t">
        <Button variant="outline" size="sm" className="w-full" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </div>

      {/* Send to Deck Order Dialog */}
      <SendToDeckOrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItemForOrder}
        onConfirm={handleConfirmSendToOrder}
      />
    </div>
  );
};

export default StockList;
