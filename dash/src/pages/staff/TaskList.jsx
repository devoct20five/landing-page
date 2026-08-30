import { Plus } from "lucide-react";

import { tasks as mockTasks } from "@/data/mockData";
import TaskRow from "@/components/tasks/TaskRow";
import EmptyState from "@/components/shared/EmptyState";

export default function TaskList({ tasks = mockTasks }) {
  const handleAddTask = () => {
    // Open Add Task modal here
    console.log("Add task");
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-surface-fg">Tasks</h1>
            <p className="mt-1 text-sm text-surface-muted">Manage and track project tasks.</p>
          </div>

          <button
            type="button"
            onClick={handleAddTask}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>

        <EmptyState
          title="No Tasks Here"
          description="Tasks matching this view will appear here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-fg">Tasks</h1>

          <p className="mt-1 text-sm text-surface-muted">Manage and track project tasks.</p>
        </div>

        <button
          type="button"
          onClick={handleAddTask}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="brand-card">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
