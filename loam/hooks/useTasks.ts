import { useMemo } from 'react';
import { Plant, Task } from '../types';
import { deriveTasks } from '../utils/tasks';

interface UseTasksReturn {
  tasks: Task[];
  overdueTasks: Task[];
  todayTasks: Task[];
  upcomingTasks: Task[];
}

export function useTasks(plants: Plant[], lastFrostDate: string): UseTasksReturn {
  const tasks = useMemo(() => {
    return deriveTasks(plants, lastFrostDate);
  }, [plants, lastFrostDate]);

  const overdueTasks = useMemo(() => {
    return tasks.filter(t => t.isOverdue);
  }, [tasks]);

  const todayTasks = useMemo(() => {
    return tasks.filter(t => !t.isOverdue && t.daysDiff === 0);
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks.filter(t => !t.isOverdue && t.daysDiff > 0);
  }, [tasks]);

  return {
    tasks,
    overdueTasks,
    todayTasks,
    upcomingTasks,
  };
}
