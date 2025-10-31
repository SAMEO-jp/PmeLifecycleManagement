/**
 * ユーザーServiceをエクスポート
 */

import { UsersService } from './usersService';

// Serviceインスタンスを生成
export const usersService = new UsersService();

// クラスとインスタンスの両方をエクスポート
export { UsersService };

// Validator関数もエクスポート
export { validateCreateUser, validateUpdateUser } from './users.validator';
