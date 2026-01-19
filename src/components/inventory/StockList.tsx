import { useState } from 'react';
import { Plus, Filter, Download, RotateCcw, Package } from 'lucide-react';
import { StockItem, BOX_OPTIONS } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import StockItemRow from './StockItem';
import { cn } from '@/lib/utils';

interface StockListProps {
  items: StockItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedBox: string;
  onBoxChange: (value: string) => void;
  onAddItem: (name: string, quantity: number, box: string) => void;
  onUpdateQuantity: (id: number, change: number) => void;
  onUpdateQuantityDirect: (id: number, value: number) => void;
  onDelete: (id: number) => void;
  onReset: () => void;
  totalItems: number;
  totalQuantity: number;
}

const StockList = ({
  items,
  searchTerm,
  onSearchChange,
  selectedBox,
  onBoxChange,
  onAddItem,
  onUpdateQuantity,
  onUpdateQuantityDirect,
  onDelete,
  onReset,
  totalItems,
  totalQuantity,
}: StockListProps) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemBox, setNewItemBox] = useState(BOX_OPTIONS[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddItem(newItemName, newItemQty, newItemBox);
      setNewItemName('');
      setNewItemQty(1);
      setShowAddForm(false);
    }
  };

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

      {/* Mobile Search */}
      <div className="px-4 py-2 md:hidden">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-muted"
        />
      </div>

      {/* Table Header */}
      <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 text-sm font-medium text-muted-foreground">
        <div className="w-5" />
        <div className="w-10" />
        <div className="flex-1">Name</div>
        <div className="w-32 text-center">Quantity</div>
        <div className="w-8 text-center">Actions</div>
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
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="p-4 bg-muted/50 border-t animate-fade-in">
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Item name..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              autoFocus
            />
            <div className="flex gap-2">
              <Input
                type="number"
                value={newItemQty}
                onChange={(e) => setNewItemQty(parseInt(e.target.value) || 1)}
                min={1}
                className="w-20"
              />
              <Select value={newItemBox} onValueChange={setNewItemBox}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-popover">
                  {BOX_OPTIONS.map(box => (
                    <SelectItem key={box} value={box}>{box}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddItem} className="flex-1">Add Item</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="p-4 bg-card border-t space-y-2">
        <Button 
          className="w-full btn-add"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              if (confirm('Reset all data to factory defaults?')) {
                onReset();
              }
            }}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockList;
