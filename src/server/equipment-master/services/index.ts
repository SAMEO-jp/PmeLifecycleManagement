/**
 * 設備マスタServiceをエクスポート
 */

import { EquipmentMasterService } from './equipmentMasterService';

// Serviceインスタンスを生成
export const equipmentMasterService = new EquipmentMasterService();

// クラスとインスタンスの両方をエクスポート
export { EquipmentMasterService };

// Validator関数もエクスポート
export { validateCreateEquipmentMaster, validateUpdateEquipmentMaster } from './equipmentMaster.validator';
