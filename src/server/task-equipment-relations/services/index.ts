/**
 * タスク設備関連Serviceをエクスポート
 */

import { TaskEquipmentRelationsService } from './taskEquipmentRelationsService';

// Serviceインスタンスを生成
export const taskEquipmentRelationsService = new TaskEquipmentRelationsService();

// クラスとインスタンスの両方をエクスポート
export { TaskEquipmentRelationsService };

// Validator関数もエクスポート
export { validateCreateTaskEquipmentRelation, validateUpdateTaskEquipmentRelation } from './taskEquipmentRelations.validator';
