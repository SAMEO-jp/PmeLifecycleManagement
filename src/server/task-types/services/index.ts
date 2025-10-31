/**
 * タスクタイプServiceをエクスポート
 */

import { TaskTypesService } from './taskTypesService';

// Serviceインスタンスを生成
export const taskTypesService = new TaskTypesService();

// クラスとインスタンスの両方をエクスポート
export { TaskTypesService };

// Validator関数もエクスポート
export { validateCreateTaskType, validateUpdateTaskType } from './taskTypes.validator';
