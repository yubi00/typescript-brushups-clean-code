/**
 * PHASE 1 RECAP: CLI Task Manager
 *
 * Build a simple task manager that uses ALL the concepts from exercises 1-4:
 * - Basic types & function signatures
 * - Arrays, unions, tuples, literal types
 * - Optional, readonly, type aliases, Partial, Record
 * - Generics
 *
 * TODO: Implement all the type definitions and functions below.
 * Run with: npx tsx exercise-05-recap.ts
 */

// ============================================================================
// PART 1: Type Definitions (Exercises 1-3)
// ============================================================================

/**
 * TODO: Define a TaskStatus as a union of literal types:
 * 'todo', 'in-progress', 'done', 'archived'
 */
type TaskStatus = "todo" | "in-progress" | "done" | "archived";

/**
 * TODO: Define a Priority as a union of literal types:
 * 'low', 'medium', 'high'
 */
type Priority = "low" | "medium" | "high";

/**
 * TODO: Define a Task type with:
 * - id: number (readonly)
 * - title: string
 * - description: string (optional)
 * - status: TaskStatus
 * - priority: Priority
 * - tags: array of strings
 * - createdAt: Date (readonly)
 * - completedAt: Date (optional)
 */
interface Task {
  readonly id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  readonly createdAt: Date;
  completedAt?: Date;
}

/**
 * TODO: Define a CreateTaskInput type (uses Partial or custom type)
 * Should have all Task fields EXCEPT id and createdAt (those are auto-generated)
 * status and priority should be optional (have defaults)
 */
type CreateTaskInput = Partial<Omit<Task, "id" | "createdAt">> & {
  status?: TaskStatus; // optional with default
  priority?: Priority; // optional with default
};

/**
 * TODO: Define a UpdateTaskInput type
 * Should allow updating any Task field except id and createdAt (uses Partial)
 */
type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt">>;

/**
 * TODO: Define a CommandType as a union of literal types:
 * 'add', 'list', 'update', 'delete', 'filter', 'stats'
 */
type CommandType = "add" | "list" | "update" | "delete" | "filter" | "stats";

/**
 * TODO: Define a Command type as a tuple:
 * [CommandType, ...args: string[]]
 * This represents a command and its arguments
 */
type Command = [CommandType, ...args: string[]];

/**
 * TODO: Define a TaskStore type using Record
 * Maps task id (number) to Task
 */
type TaskStore = Record<number, Task>;

// ============================================================================
// PART 2: Generic Utilities (Exercise 4)
// ============================================================================

/**
 * TODO: Implement a generic filter function
 * Takes an array of T and a predicate function(returns boolean)
 * Returns filtered array of T
 */
function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

/**
 * TODO: Implement a generic groupBy function
 * Takes an array of T and a key function that returns K
 * Returns a Record<K, T[]> grouping items by the key
 */
function groupBy<T, K extends string | number>(arr: T[], keyFn: (keyItem: T) => K): Record<K, T[]> {
  const groups: Record<K, T[]> = {} as Record<K, T[]>;
  for (const item of arr) {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }
  return groups;
}

/**
 * TODO: Implement a generic findById function
 * Takes a Record<number, T> and an id
 * Returns T or undefined
 */
function findById<T>(store: Record<number, T>, id: number): T | undefined {
  return store[id];
}

// ============================================================================
// PART 3: Task Manager Implementation
// ============================================================================

class TaskManager {
  private tasks: TaskStore = {};
  private nextId: number = 1;

  /**
   * TODO: Implement addTask
   * - Takes CreateTaskInput
   * - Generates id and createdAt
   * - Sets default status ('todo') and priority ('medium') if not provided
   * - Returns the created Task
   */
  addTask(input: CreateTaskInput): Task {
    // Implementation here
    const task: Task = {
       ...input,
       id: this.nextId++,
       createdAt: new Date(),
       status: input.status ?? 'todo',
       priority: input.priority ?? 'medium',
       tags: input.tags ?? [],
       title: input.title ?? 'Untitled Task',
    };
    this.tasks[task.id] = task;
    return task;  
  }

  /**
   * TODO: Implement updateTask
   * - Takes id and UpdateTaskInput
   * - Updates the task with given id
   * - If status changes to 'done', set completedAt to current date
   * - Returns updated Task or undefined if not found
   */
  updateTask(id: number, updates: UpdateTaskInput): Task | undefined {
    // Implementation here
   const updatedTask = this.tasks[id];
   if (!updatedTask) {
     return undefined;
   }
   const updated = { ...updatedTask, ...updates };
   if (updates.status === 'done' && !updated.completedAt) {
     updated.completedAt = new Date();
   }
   this.tasks[id] = updated;
   return updated;
  }

  /**
   * TODO: Implement deleteTask
   * - Takes id
   * - Removes task from store
   * - Returns true if deleted, false if not found
   */
  deleteTask(id: number): boolean {
    // Implementation here
    const task = this.tasks[id];
    if (!task) {
      return false;
    }
    delete this.tasks[id];
    return true;
  }

  /**
   * TODO: Implement getAllTasks
   * - Returns array of all tasks
   * - Use Object.values()
   */
  getAllTasks(): Task[] {
    // Implementation here
    return Object.values(this.tasks);
  }

  /**
   * TODO: Implement getTasksByStatus
   * - Takes TaskStatus
   * - Returns filtered array of tasks
   * - Use your generic filterArray function
   */
  getTasksByStatus(status: TaskStatus): Task[] {
    // Implementation here
    return filterArray(this.getAllTasks(), (task) => task.status === status);
  }

  /**
   * TODO: Implement getTasksByPriority
   * - Takes Priority
   * - Returns filtered array of tasks
   */
  getTasksByPriority(priority: Priority): Task[] {
    // Implementation here
    return filterArray(this.getAllTasks(), (task) => task.priority === priority);
  }

  /**
   * TODO: Implement getTasksByTag
   * - Takes a tag string
   * - Returns tasks that include that tag
   */
  getTasksByTag(tag: string): Task[] {
    // Implementation here
    return filterArray(this.getAllTasks(), (task) => task.tags.includes(tag));
  }

  /**
   * TODO: Implement getStats
   * - Returns an object with:
   *   - total: total number of tasks
   *   - byStatus: Record<TaskStatus, number> (count per status)
   *   - byPriority: Record<Priority, number> (count per priority)
   * - Use your groupBy generic function
   */
  getStats(): {
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<Priority, number>;
  } {
    // Implementation here
    const allTasks = this.getAllTasks();
    const tasksByStatus = groupBy(allTasks, (task) => task.status);
    const tasksByPriority = groupBy(allTasks, (task) => task.priority);

    const totalTasks = allTasks.length;
    const tasksCountByStatus: Record<TaskStatus, number> = Object.entries(tasksByStatus).reduce((acc: Record<TaskStatus, number>, [status, tasks]) => {
      acc[status as TaskStatus] = tasks.length;
      return acc;
    }, {} as Record<TaskStatus, number>);
    const tasksCountByPriority: Record<Priority, number> = Object.entries(tasksByPriority).reduce((acc: Record<Priority, number>, [priority, tasks]) => {
      acc[priority as Priority] = tasks.length;
      return acc;
    }, {} as Record<Priority, number>);

    return {
      total: totalTasks,
      byStatus: tasksCountByStatus,
      byPriority: tasksCountByPriority,
    };
  }
}

// ============================================================================
// PART 4: CLI Interface (Bonus - if you want the challenge!)
// ============================================================================

function parseCommand(input: string): Command {
  const parts = input.trim().split(' ');
  return [parts[0] as CommandType, ...parts.slice(1)];
}

function runCLI() {
  const manager = new TaskManager();

  // Add some sample tasks for testing
  manager.addTask({
    title: 'Learn TypeScript basics',
    description: 'Complete exercises 1-3',
    status: 'done',
    priority: 'high',
    tags: ['learning', 'typescript'],
  });

  manager.addTask({
    title: 'Learn Generics',
    description: 'Complete exercise 4',
    status: 'in-progress',
    priority: 'high',
    tags: ['learning', 'typescript'],
  });

  manager.addTask({
    title: 'Build CLI app',
    status: 'todo',
    priority: 'medium',
    tags: ['project', 'typescript'],
  });

  console.log('📝 Task Manager CLI');
  console.log('===================\n');

  // Test commands
  console.log('All tasks:');
  console.log(manager.getAllTasks());

  console.log('\n📊 Stats:');
  console.log(manager.getStats());

  console.log('\n✅ Done tasks:');
  console.log(manager.getTasksByStatus('done'));

  console.log('\n🔥 High priority tasks:');
  console.log(manager.getTasksByPriority('high'));

  console.log('\n🏷️  Tasks tagged "learning":');
  console.log(manager.getTasksByTag('learning'));
}

// Run the CLI
runCLI();
