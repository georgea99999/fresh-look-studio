import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BOX_OPTIONS } from '@/types/inventory';

interface FloatingAddButtonProps {
  onAddItem: (name: string, quantity: number, box: string) => void;
}

const FloatingAddButton = ({ onAddItem }: FloatingAddButtonProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemBox, setNewItemBox] = useState(BOX_OPTIONS[0]);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddItem(newItemName, newItemQty, newItemBox);
      setNewItemName('');
      setNewItemQty(1);
      setShowForm(false);
    }
  };

  return (
    <>
      {/* Overlay when form is open */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowForm(false)}
        />
      )}

      {/* Floating button or form */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showForm ? (
          <Button 
            onClick={() => setShowForm(true)}
            className="w-14 h-14 rounded-full shadow-lg btn-add"
          >
            <Plus className="h-6 w-6" />
          </Button>
        ) : (
          <div className="bg-card rounded-lg shadow-xl p-4 w-80 animate-fade-in border">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Add New Item</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setShowForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-3">
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
              <Button onClick={handleAddItem} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Add Item
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingAddButton;