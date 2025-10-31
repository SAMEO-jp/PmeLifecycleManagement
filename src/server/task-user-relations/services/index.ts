/**
 * タスクユーザー関連Serviceをエクスポート
 */

import { TaskUserRelationsService } from './taskUserRelationsService';

// Serviceインスタンスを生成
export const taskUserRelationsService = new TaskUserRelationsService();

// クラスとインスタンスの両方をエクスポート
export { TaskUserRelationsService };

// Validator関数もエクスポート
export { validateCreateTaskUserRelation, validateUpdateTaskUserRelation } from './taskUserRelations.validator';
