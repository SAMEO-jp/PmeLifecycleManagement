/**
 * タスクプロジェクト関連Serviceをエクスポート
 */

import { TaskProjectRelationsService } from './taskProjectRelationsService';

// Serviceインスタンスを生成
export const taskProjectRelationsService = new TaskProjectRelationsService();

// クラスとインスタンスの両方をエクスポート
export { TaskProjectRelationsService };

// Validator関数もエクスポート
export { validateCreateTaskProjectRelation, validateUpdateTaskProjectRelation } from './taskProjectRelations.validator';
