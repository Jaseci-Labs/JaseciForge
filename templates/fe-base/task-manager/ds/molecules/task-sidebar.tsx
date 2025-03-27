"use client";

interface TaskSidebarProps {
  stats: {
    total: number;
    active: number;
    priorities: {
      high: number;
      medium: number;
      low: number;
    };
  };
}

export function TaskSidebar({ stats }: TaskSidebarProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Statistics</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-card rounded-lg border text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="p-3 bg-card rounded-lg border text-center">
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Priorities</h3>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>High</span>
            <span>{stats.priorities.high}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Medium</span>
            <span>{stats.priorities.medium}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Low</span>
            <span>{stats.priorities.low}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
