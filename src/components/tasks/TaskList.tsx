import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
  onAddTask: (text: string) => void;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList = ({
  tasks,
  totalTasks,
  completedTasks,
  progressPercent,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) => {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(newTask);
      setNewTask('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 p-4 pb-2">
        <Card className="stats-gradient text-primary-foreground">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{totalTasks}</p>
            <p className="text-xs opacity-80">Total Tasks</p>
          </CardContent>
        </Card>
        <Card className="stats-gradient text-primary-foreground">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{completedTasks}</p>
            <p className="text-xs opacity-80">Completed</p>
          </CardContent>
        </Card>
        <Card className="stats-gradient text-primary-foreground">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{progressPercent}%</p>
            <p className="text-xs opacity-80">Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-4">
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Add Task Input */}
      <div className="flex items-center gap-2 px-4 pb-4">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          className="flex-1"
        />
        <Button onClick={handleAddTask} size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-auto bg-card px-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mb-3 opacity-50" />
            <p>No tasks yet</p>
            <p className="text-sm">Add a task to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                  task.completed 
                    ? "bg-muted/50 border-muted" 
                    : "bg-card border-border hover:border-accent"
                )}
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <span className={cn(
                  "flex-1 text-sm",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.text}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
