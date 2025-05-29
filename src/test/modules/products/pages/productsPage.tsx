"use client";

import { ProtectedRoute } from "@/ds/wrappers/prtoected-auth";
import { Card } from '@/ds/atoms/card';
import { Button } from '@/ds/atoms/button';
import { useproductss } from '../hooks';

/**
 * ⚠️ WARNING: This is a basic template page.
 * 
 * You should replace these basic components with proper templates and design system components:
 * - Replace the basic div structure with a proper Template (e.g., DashboardTemplate)
 * - Replace Card with proper Organisms (e.g., productsCard, productsList)
 * - Replace Button with proper Molecules (e.g., ActionButton, RefreshButton)
 * - Add proper loading and error states using design system components
 * 
 * Example structure:
 * <DashboardTemplate
 *       header={<TaskHeader />}
 *       sidebar={<TaskSidebar stats={stats} />}
 *     >
 *       <TaskList
 *        tasks={tasks}
 *         onAddTask={actions.addTask}
 *         onUpdateTask={actions.updateTask}
 *         onDeleteTask={actions.deleteTask}
 *         onToggleComplete={actions.toggleComplete}
 *       />
      </DashboardTemplate>
 */

export default function productsPage() {
  const { items, isLoading, error, refresh } = useproductss();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <ProtectedRoute>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">productss</h1>
            <Button onClick={refresh}>Refresh</Button>
          </div>
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id}>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Status: {item.status}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ProtectedRoute>;
}