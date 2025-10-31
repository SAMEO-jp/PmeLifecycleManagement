/**
 * ユーザーRepositoryをエクスポート
 */

import { UsersRepository } from './usersRepository';

// Repositoryインスタンスを生成
export const usersRepository = new UsersRepository();

// クラスとインスタンスの両方をエクスポート
export { UsersRepository };
