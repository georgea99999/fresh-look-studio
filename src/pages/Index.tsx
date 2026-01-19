import { useState } from 'react';
import { TabType } from '@/types/inventory';
import { useInventory } from '@/hooks/useInventory';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import StockList from '@/components/inventory/StockList';
import TaskList from '@/components/tasks/TaskList';
import MonthlyReport from '@/components/reports/MonthlyReport';
import UndoNotification from '@/components/UndoNotification';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stock');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const {
    filteredItems,
    tasks,
    deletedItems,
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
  } = useInventory();

  const handleBoxChange = (value: string) => {
    setSelectedBox(value === 'all' ? '' : value);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header
        totalItems={totalItems}
        totalQuantity={totalQuantity}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 md:ml-16 flex flex-col overflow-hidden">
          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'stock' && (
              <StockList
                items={filteredItems}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedBox={selectedBox}
                onBoxChange={handleBoxChange}
                onAddItem={addStockItem}
                onUpdateQuantity={updateStockQuantity}
                onUpdateQuantityDirect={updateStockQuantityDirect}
                onDelete={deleteStockItem}
                onReset={resetApp}
                totalItems={totalItems}
                totalQuantity={totalQuantity}
              />
            )}

            {activeTab === 'tasks' && (
              <TaskList
                tasks={tasks}
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                progressPercent={progressPercent}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
              />
            )}

            {activeTab === 'reports' && (
              <MonthlyReport
                availableMonths={availableMonths}
                getMonthlyUsage={getMonthlyUsage}
              />
            )}
          </div>
        </main>
      </div>

      {/* Undo Notification */}
      <UndoNotification
        show={deletedItems.length > 0}
        onUndo={undoDelete}
        onDismiss={() => {}}
      />
    </div>
  );
};

export default Index;
