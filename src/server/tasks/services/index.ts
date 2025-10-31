/**
 * タスクServiceをエクスポート
 */

import { TasksService } from './tasksService';

// Serviceインスタンスを生成
export const tasksService = new TasksService();

// クラスとインスタンスの両方をエクスポート
export { TasksService };

// Validator関数もエクスポート
export { validateCreateTask, validateUpdateTask } from './tasks.validator';
