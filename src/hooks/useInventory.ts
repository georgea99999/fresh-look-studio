import { useState, useEffect, useCallback } from 'react';
import { StockItem, Task, UsageEntry, Notification } from '@/types/inventory';
import { loadDefaultInventory } from '@/data/defaultInventory';

const STORAGE_KEYS = {
  STOCK: 'oktoDeckStock',
  TASKS: 'oktoDeckTasks',
  USAGE: 'oktoDeckUsage',
  NOTIFICATIONS: 'oktoDeckNotifications',
  CUSTOM_BOXES: 'oktoDeckCustomBoxes',
};

export function useInventory() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [usageHistory, setUsageHistory] = useState<UsageEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [deletedItems, setDeletedItems] = useState<{ item: StockItem; index: number }[]>([]);
  const [customBoxes, setCustomBoxes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBox, setSelectedBox] = useState<string>('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStock = localStorage.getItem(STORAGE_KEYS.STOCK);
    const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    const savedUsage = localStorage.getItem(STORAGE_KEYS.USAGE);
    const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);

    if (savedStock) {
      try {
        setStockItems(JSON.parse(savedStock));
      } catch {
        setStockItems(loadDefaultInventory());
      }
    } else {
      setStockItems(loadDefaultInventory());
    }

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        setTasks([]);
      }
    }

    if (savedUsage) {
      try {
        setUsageHistory(JSON.parse(savedUsage));
      } catch {
        setUsageHistory([]);
      }
    }

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch {
        setNotifications([]);
      }
    }

    const savedCustomBoxes = localStorage.getItem(STORAGE_KEYS.CUSTOM_BOXES);
    if (savedCustomBoxes) {
      try {
        setCustomBoxes(JSON.parse(savedCustomBoxes));
      } catch {
        setCustomBoxes([]);
      }
    }
  }, []);

  // Save stock data
  const saveStockData = useCallback((items: StockItem[]) => {
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(items));
  }, []);

  // Save task data
  const saveTaskData = useCallback((taskList: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(taskList));
  }, []);

  // Save usage data
  const saveUsageData = useCallback((usage: UsageEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usage));
  }, []);

  // Save notifications
  const saveNotifications = useCallback((notifs: Notification[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }, []);

  // Save custom boxes
  const saveCustomBoxes = useCallback((boxes: string[]) => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_BOXES, JSON.stringify(boxes));
  }, []);

  // Add custom box
  const addCustomBox = useCallback((boxName: string) => {
    setCustomBoxes(prev => {
      if (prev.includes(boxName)) return prev;
      const updated = [...prev, boxName];
      saveCustomBoxes(updated);
      return updated;
    });
  }, [saveCustomBoxes]);

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
      const updated = [newNotification, ...prev].slice(0, 50); // Keep last 50
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  }, []);

  // Add stock item
  const addStockItem = useCallback((name: string, quantity: number, box: string) => {
    if (!name.trim()) return;
    
    const newItem: StockItem = {
      id: Date.now(),
      name: name.trim(),
      quantity,
      box
    };

    setStockItems(prev => {
      let insertIndex = prev.length;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].box === box) {
          insertIndex = i + 1;
          break;
        }
      }
      const updated = [...prev];
      updated.splice(insertIndex, 0, newItem);
      saveStockData(updated);
      return updated;
    });
    setDeletedItems([]);
    addNotification('added', name.trim(), `Added "${name.trim()}" (${quantity}) to ${box}`);
  }, [saveStockData, addNotification]);

  // Update stock quantity
  const updateStockQuantity = useCallback((id: number, change: number) => {
    setStockItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const oldQty = item.quantity;
          const newQty = Math.max(0, item.quantity + change);
          const diff = oldQty - newQty;

          if (diff > 0) {
            const usageEntry: UsageEntry = {
              date: new Date().toISOString(),
              itemName: item.name,
              box: item.box,
              quantity: diff
            };
            setUsageHistory(prevUsage => {
              const newUsage = [...prevUsage, usageEntry];
              saveUsageData(newUsage);
              return newUsage;
            });
          }

          return { ...item, quantity: newQty };
        }
        return item;
      });
      saveStockData(updated);
      return updated;
    });
  }, [saveStockData, saveUsageData]);

  // Update stock quantity directly
  const updateStockQuantityDirect = useCallback((id: number, value: number) => {
    setStockItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const oldQty = item.quantity;
          const newQty = Math.max(0, value);
          const diff = oldQty - newQty;

          if (diff > 0) {
            const usageEntry: UsageEntry = {
              date: new Date().toISOString(),
              itemName: item.name,
              box: item.box,
              quantity: diff
            };
            setUsageHistory(prevUsage => {
              const newUsage = [...prevUsage, usageEntry];
              saveUsageData(newUsage);
              return newUsage;
            });
          }

          return { ...item, quantity: newQty };
        }
        return item;
      });
      saveStockData(updated);
      return updated;
    });
  }, [saveStockData, saveUsageData]);

  // Delete stock item
  const deleteStockItem = useCallback((id: number) => {
    setStockItems(prev => {
      const itemIndex = prev.findIndex(i => i.id === id);
      if (itemIndex !== -1) {
        const deletedItem = prev[itemIndex];
        setDeletedItems([{ item: deletedItem, index: itemIndex }]);
        addNotification('deleted', deletedItem.name, `Removed "${deletedItem.name}" from ${deletedItem.box}`);
        const updated = prev.filter(i => i.id !== id);
        saveStockData(updated);
        return updated;
      }
      return prev;
    });
  }, [saveStockData, addNotification]);

  // Undo delete - restore item to original position
  const undoDelete = useCallback(() => {
    if (deletedItems.length > 0) {
      const restored = deletedItems[0];
      setStockItems(prev => {
        const updated = [...prev];
        // Insert at original index, clamped to array bounds
        const insertIndex = Math.min(restored.index, updated.length);
        updated.splice(insertIndex, 0, restored.item);
        saveStockData(updated);
        return updated;
      });
      setDeletedItems([]);
    }
  }, [deletedItems, saveStockData]);

  // Task functions
  const addTask = useCallback((text: string) => {
    if (!text.trim()) return;
    setTasks(prev => {
      const updated = [...prev, { id: Date.now(), text: text.trim(), completed: false }];
      saveTaskData(updated);
      return updated;
    });
  }, [saveTaskData]);

  const toggleTask = useCallback((id: number) => {
    setTasks(prev => {
      const updated = prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      saveTaskData(updated);
      return updated;
    });
  }, [saveTaskData]);

  const deleteTask = useCallback((id: number) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveTaskData(updated);
      return updated;
    });
  }, [saveTaskData]);

  // Reset app
  const resetApp = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.STOCK);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.USAGE);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    setStockItems(loadDefaultInventory());
    setTasks([]);
    setUsageHistory([]);
    setNotifications([]);
    setDeletedItems([]);
  }, []);

  // Filter items - exact word matching
  const filteredItems = stockItems.filter(item => {
    const matchesBox = !selectedBox || selectedBox === 'all' || item.box === selectedBox;
    
    if (!searchTerm.trim()) {
      return matchesBox;
    }
    
    // Split search term into words and check if item name contains all words
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    const itemNameLower = item.name.toLowerCase();
    const matchesSearch = searchWords.every(word => itemNameLower.includes(word));
    
    return matchesSearch && matchesBox;
  });

  // Stats
  const totalItems = stockItems.length;
  const totalQuantity = stockItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

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
    tasks,
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
    totalTasks,
    completedTasks,
    progressPercent,
    availableMonths,
    addStockItem,
    updateStockQuantity,
    updateStockQuantityDirect,
    deleteStockItem,
    undoDelete,
    addTask,
    toggleTask,
    deleteTask,
    resetApp,
    getMonthlyUsage,
    clearNotifications,
    addCustomBox,
  };
}
