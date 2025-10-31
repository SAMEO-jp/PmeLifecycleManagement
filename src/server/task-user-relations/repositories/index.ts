/**
 * タスクユーザー関連Repositoryをエクスポート
 */

import { TaskUserRelationsRepository } from './taskUserRelationsRepository';

// Repositoryインスタンスを生成
export const taskUserRelationsRepository = new TaskUserRelationsRepository();

// クラスとインスタンスの両方をエクスポート
export { TaskUserRelationsRepository };
