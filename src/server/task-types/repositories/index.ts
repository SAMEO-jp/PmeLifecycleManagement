/**
 * タスクタイプRepositoryをエクスポート
 */

import { TaskTypesRepository } from './taskTypesRepository';

// Repositoryインスタンスを生成
export const taskTypesRepository = new TaskTypesRepository();

// クラスとインスタンスの両方をエクスポート
export { TaskTypesRepository };
