/**
 * タスクRepositoryをエクスポート
 */

import { TasksRepository } from './tasksRepository';

// Repositoryインスタンスを生成
export const tasksRepository = new TasksRepository();

// クラスとインスタンスの両方をエクスポート
export { TasksRepository };
