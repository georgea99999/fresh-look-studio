import { useState, useEffect, useCallback } from 'react';
import { StockItem, UsageEntry, Notification } from '@/types/inventory';
import { supabase } from '@/integrations/supabase/client';
import { loadDefaultInventory } from '@/data/defaultInventory';
import { useAuth } from './useAuth';

export function useInventory() {
  const { user } = useAuth();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [usageHistory, setUsageHistory] = useState<UsageEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [deletedItems, setDeletedItems] = useState<{ item: StockItem; index: number }[]>([]);
  const [customBoxes, setCustomBoxes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBox, setSelectedBox] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on mount or when user changes
  useEffect(() => {
    if (!user) {
      setStockItems([]);
      setUsageHistory([]);
      setCustomBoxes([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      
      // Load stock items for this user
      const { data: stockData, error: stockError } = await supabase
        .from('stock_items')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true });

      if (stockError) {
        console.error('Error loading stock items:', stockError);
        setStockItems([]);
      } else if (stockData && stockData.length > 0) {
        setStockItems(stockData.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          box: item.box,
        })));
      } else {
        // No data for this user, seed with default inventory
        await seedDefaultInventory();
      }

      // Load usage history for this user
      const { data: usageData, error: usageError } = await supabase
        .from('usage_history')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (!usageError && usageData) {
        setUsageHistory(usageData.map(entry => ({
          date: entry.recorded_at,
          itemName: entry.item_name,
          box: entry.box,
          quantity: entry.quantity,
        })));
      }

      // Load custom boxes for this user
      const { data: boxesData, error: boxesError } = await supabase
        .from('custom_boxes')
        .select('name')
        .eq('user_id', user.id);

      if (!boxesError && boxesData) {
        setCustomBoxes(boxesData.map(b => b.name));
      }

      // Load notifications from localStorage (user-scoped)
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications));
        } catch {
          setNotifications([]);
        }
      }

      setIsLoading(false);
    };

    loadData();

    // Subscribe to realtime updates for this user
    const channel = supabase
      .channel('stock-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_items',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          // Reload stock items on any change
          const { data } = await supabase
            .from('stock_items')
            .select('*')
            .eq('user_id', user.id)
            .order('sort_order', { ascending: true });
          
          if (data) {
            setStockItems(data.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              box: item.box,
            })));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Seed default inventory to database
  const seedDefaultInventory = async () => {
    if (!user) return;
    
    const defaultItems = loadDefaultInventory();
    const itemsToInsert = defaultItems.map((item, index) => ({
      name: item.name,
      quantity: item.quantity,
      box: item.box,
      sort_order: index,
      user_id: user.id,
    }));

    const { data, error } = await supabase
      .from('stock_items')
      .insert(itemsToInsert)
      .select();

    if (error) {
      console.error('Error seeding inventory:', error);
      setStockItems([]);
    } else if (data) {
      setStockItems(data.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        box: item.box,
      })));
    }
  };

  // Save notifications to localStorage (user-scoped)
  const saveNotifications = useCallback((notifs: Notification[]) => {
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifs));
    }
  }, [user]);

  // Add custom box
  const addCustomBox = useCallback(async (boxName: string) => {
    if (!user || customBoxes.includes(boxName)) return;
    
    const { error } = await supabase
      .from('custom_boxes')
      .insert({ name: boxName, user_id: user.id });

    if (!error) {
      setCustomBoxes(prev => [...prev, boxName]);
    }
  }, [user, customBoxes]);

  // Add notification
  const addNotification = useCallback((type: Notification['type'], itemName: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      type,
      itemName,
      message,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50);
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`notifications_${user.id}`);
    }
  }, [user]);

  // Add stock item
  const addStockItem = useCallback(async (name: string, quantity: number, box: string) => {
    if (!user || !name.trim()) return;

    // Find the max sort_order for items in the same box
    const boxItems = stockItems.filter(i => i.box === box);
    const maxSortOrder = boxItems.length > 0 
      ? Math.max(...stockItems.map((_, idx) => idx)) + 1 
      : stockItems.length;

    const { data, error } = await supabase
      .from('stock_items')
      .insert({
        name: name.trim(),
        quantity,
        box,
        sort_order: maxSortOrder,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding stock item:', error);
      return;
    }

    if (data) {
      setStockItems(prev => {
        let insertIndex = prev.length;
        for (let i = prev.length - 1; i >= 0; i--) {
          if (prev[i].box === box) {
            insertIndex = i + 1;
            break;
          }
        }
        const updated = [...prev];
        updated.splice(insertIndex, 0, {
          id: data.id,
          name: data.name,
          quantity: data.quantity,
          box: data.box,
        });
        return updated;
      });
      setDeletedItems([]);
      addNotification('added', name.trim(), `Added "${name.trim()}" (${quantity}) to ${box}`);
    }
  }, [user, stockItems, addNotification]);

  // Update stock quantity
  const updateStockQuantity = useCallback(async (id: string, change: number) => {
    const item = stockItems.find(i => i.id === id);
    if (!item) return;

    const newQty = Math.max(0, item.quantity + change);
    const diff = item.quantity - newQty;

    const { error } = await supabase
      .from('stock_items')
      .update({ quantity: newQty })
      .eq('id', id);

    if (error) {
      console.error('Error updating quantity:', error);
      return;
    }

    // Record usage if quantity decreased
    if (diff > 0 && user) {
      await supabase.from('usage_history').insert({
        item_name: item.name,
        box: item.box,
        quantity: diff,
        user_id: user.id,
      });

      setUsageHistory(prev => [{
        date: new Date().toISOString(),
        itemName: item.name,
        box: item.box,
        quantity: diff,
      }, ...prev]);
    }

    setStockItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: newQty } : i))
    );
  }, [stockItems]);

  // Update stock quantity directly
  const updateStockQuantityDirect = useCallback(async (id: string, value: number) => {
    const item = stockItems.find(i => i.id === id);
    if (!item) return;

    const newQty = Math.max(0, value);
    const diff = item.quantity - newQty;

    const { error } = await supabase
      .from('stock_items')
      .update({ quantity: newQty })
      .eq('id', id);

    if (error) {
      console.error('Error updating quantity:', error);
      return;
    }

    // Record usage if quantity decreased
    if (diff > 0 && user) {
      await supabase.from('usage_history').insert({
        item_name: item.name,
        box: item.box,
        quantity: diff,
        user_id: user.id,
      });

      setUsageHistory(prev => [{
        date: new Date().toISOString(),
        itemName: item.name,
        box: item.box,
        quantity: diff,
      }, ...prev]);
    }

    setStockItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: newQty } : i))
    );
  }, [stockItems]);

  // Delete stock item
  const deleteStockItem = useCallback(async (id: string) => {
    const itemIndex = stockItems.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    const deletedItem = stockItems[itemIndex];

    const { error } = await supabase
      .from('stock_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting stock item:', error);
      return;
    }

    setDeletedItems([{ item: deletedItem, index: itemIndex }]);
    addNotification('deleted', deletedItem.name, `Removed "${deletedItem.name}" from ${deletedItem.box}`);
    setStockItems(prev => prev.filter(i => i.id !== id));
  }, [stockItems, addNotification]);

  // Undo delete - restore item
  const undoDelete = useCallback(async () => {
    if (deletedItems.length === 0) return;

    const restored = deletedItems[0];

    const { data, error } = await supabase
      .from('stock_items')
      .insert({
        name: restored.item.name,
        quantity: restored.item.quantity,
        box: restored.item.box,
        sort_order: restored.index,
        user_id: user?.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error restoring item:', error);
      return;
    }

    if (data) {
      setStockItems(prev => {
        const updated = [...prev];
        const insertIndex = Math.min(restored.index, updated.length);
        updated.splice(insertIndex, 0, {
          id: data.id,
          name: data.name,
          quantity: data.quantity,
          box: data.box,
        });
        return updated;
      });
      setDeletedItems([]);
    }
  }, [deletedItems]);

  // Filter items - exact word matching
  const filteredItems = stockItems.filter(item => {
    const matchesBox = !selectedBox || selectedBox === 'all' || item.box === selectedBox;

    if (!searchTerm.trim()) {
      return matchesBox;
    }

    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    const itemNameLower = item.name.toLowerCase();
    const matchesSearch = searchWords.every(word => itemNameLower.includes(word));

    return matchesSearch && matchesBox;
  });

  // Stats
  const totalItems = stockItems.length;
  const totalQuantity = stockItems.reduce((sum, item) => sum + item.quantity, 0);

  // Get unique months from usage history
  const availableMonths = Array.from(
    new Set(
      usageHistory.map(entry => {
        const d = new Date(entry.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      })
    )
  ).sort().reverse();

  // Get usage for a specific month
  const getMonthlyUsage = useCallback((monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const monthNum = parseInt(month) - 1;

    const monthly = usageHistory.filter(entry => {
      const d = new Date(entry.date);
      return d.getFullYear() === parseInt(year) && d.getMonth() === monthNum;
    });

    const aggregated: Record<string, { itemName: string; box: string; quantity: number }> = {};
    monthly.forEach(entry => {
      const key = `${entry.itemName}|${entry.box}`;
      if (!aggregated[key]) {
        aggregated[key] = { itemName: entry.itemName, box: entry.box, quantity: 0 };
      }
      aggregated[key].quantity += entry.quantity;
    });

    return Object.values(aggregated).sort((a, b) => b.quantity - a.quantity);
  }, [usageHistory]);

  return {
    stockItems,
    filteredItems,
    usageHistory,
    notifications,
    deletedItems,
    customBoxes,
    searchTerm,
    setSearchTerm,
    selectedBox,
    setSelectedBox,
    totalItems,
    totalQuantity,
    availableMonths,
    addStockItem,
    updateStockQuantity,
    updateStockQuantityDirect,
    deleteStockItem,
    undoDelete,
    getMonthlyUsage,
    clearNotifications,
    addCustomBox,
    isLoading,
  };
}
