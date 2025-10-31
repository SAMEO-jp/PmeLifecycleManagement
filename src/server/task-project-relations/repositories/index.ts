/**
 * タスクプロジェクト関連Repositoryをエクスポート
 */

import { TaskProjectRelationsRepository } from './taskProjectRelationsRepository';

// Repositoryインスタンスを生成
export const taskProjectRelationsRepository = new TaskProjectRelationsRepository();

// クラスとインスタンスの両方をエクスポート
export { TaskProjectRelationsRepository };
