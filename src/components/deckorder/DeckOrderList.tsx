import { useState } from 'react';
import { Plus, Download, Trash2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DeckOrderItem } from '@/types/inventory';

interface DeckOrderListProps {
  items: DeckOrderItem[];
  onAddItem: (item: Omit<DeckOrderItem, 'id'>) => void;
  onDeleteItem: (id: number) => void;
}

const DeckOrderList = ({ items, onAddItem, onDeleteItem }: DeckOrderListProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({
    productName: '',
    quantity: '',
    colour: '',
    size: '',
    link: '',
  });

  const handleAddItem = () => {
    if (newItem.productName.trim()) {
      onAddItem({
        productName: newItem.productName.trim(),
        quantity: newItem.quantity.trim() || '1',
        colour: newItem.colour.trim(),
        size: newItem.size.trim(),
        link: newItem.link.trim(),
      });
      setNewItem({ productName: '', quantity: '', colour: '', size: '', link: '' });
      setIsAdding(false);
    }
  };

  const handleDownloadPDF = () => {
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Deck Order - ${currentDate}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #1a365d; margin-bottom: 5px; }
          .date { color: #666; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #5f8b9a; color: white; padding: 12px 8px; text-align: left; }
          td { padding: 10px 8px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          a { color: #5f8b9a; }
        </style>
      </head>
      <body>
        <h1>YachtCount - Deck Order</h1>
        <p class="date">Generated: ${currentDate}</p>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Colour</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.productName}</td>
                <td>${item.colour || '-'}</td>
                <td>${item.size || '-'}</td>
                <td>${item.quantity}</td>
                <td>${item.link ? `<a href="${item.link}" target="_blank">${item.link}</a>` : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Total Items: ${items.length}</p>
          <p>Professional Inventory Systems for Maritime Excellence.</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const isLongName = (name: string) => name.length > 20;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Deck Order</h2>
            <p className="text-sm text-muted-foreground">
              {items.length} items in order
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>
      </div>

      {/* Add Item Form */}
      {isAdding && (
        <div className="p-4 border-b bg-accent/20">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <Input
              placeholder="Product Name *"
              value={newItem.productName}
              onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
              autoFocus
            />
            <Input
              placeholder="Colour"
              value={newItem.colour}
              onChange={(e) => setNewItem({ ...newItem, colour: e.target.value })}
            />
            <Input
              placeholder="Size"
              value={newItem.size}
              onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
            />
            <Input
              placeholder="Quantity (e.g. 10 packs)"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            />
            <Input
              placeholder="Link (optional)"
              value={newItem.link}
              onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
              className="md:col-span-2"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddItem} disabled={!newItem.productName.trim()}>
              Add to Order
            </Button>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-primary text-primary-foreground text-sm font-medium">
        <div className="col-span-4">Product</div>
        <div className="col-span-2">Colour</div>
        <div className="col-span-1">Size</div>
        <div className="col-span-2">Qty</div>
        <div className="col-span-2">Link</div>
        <div className="col-span-1 text-center flex-shrink-0">Action</div>
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1">
        {items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No items in deck order yet.</p>
            <p className="text-sm mt-1">Click "Add Item" to start your order.</p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) => {
              const hasLongName = isLongName(item.productName);
              const isExpanded = expandedId === item.id;
              
              return (
                <div key={item.id}>
                  <div className="grid grid-cols-12 gap-1 px-3 py-3 items-center hover:bg-muted/50">
                    <div className="col-span-4 font-medium min-w-0">
                      {hasLongName ? (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="flex items-center gap-1 text-left w-full"
                        >
                          <span className="truncate flex-1">{item.productName}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          )}
                        </button>
                      ) : (
                        <span className="truncate block">{item.productName}</span>
                      )}
                    </div>
                    <div className="col-span-2 text-muted-foreground truncate">{item.colour || '-'}</div>
                    <div className="col-span-1 text-muted-foreground truncate">{item.size || '-'}</div>
                    <div className="col-span-2 font-medium">{item.quantity}</div>
                    <div className="col-span-2 min-w-0">
                      {item.link ? (
                        <a
                          href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline truncate"
                        >
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">Link</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                    <div className="col-span-1 flex justify-center flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {/* Expanded name panel */}
                  {hasLongName && isExpanded && (
                    <div className="px-3 py-2 bg-muted/30 border-t">
                      <p className="text-sm font-medium break-words">{item.productName}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Download Button */}
      {items.length > 0 && (
        <div className="p-4 border-t bg-muted/30">
          <Button
            onClick={handleDownloadPDF}
            className="w-full gap-2"
            variant="default"
          >
            <Download className="h-4 w-4" />
            Download as PDF
          </Button>
        </div>
      )}
    </div>
  );
};

export default DeckOrderList;
