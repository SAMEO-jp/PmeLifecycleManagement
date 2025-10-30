"use client"

/**
 * Better Authエラーハンドリングの使用例コンポーネント
 * 
 * このファイルは、Better Authのエラーハンドリング機能の使用方法を示す例です。
 */

import { useState } from "react";
import { authClient } from "@/core/better-auth/auth-client";
import { getErrorMessage, getErrorDetails } from "@/core/better-auth/auth-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AuthErrorExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ code?: string; message?: string; status?: number } | null>(null);
  const [loading, setLoading] = useState(false);

  // 方法1: 基本的なエラーハンドリング
  const handleSignInBasic = async () => {
    setError(null);
    setLoading(true);

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      // エラーオブジェクトには以下のプロパティが含まれます：
      // - message: エラーメッセージ
      // - status: HTTPステータスコード
      // - statusText: HTTPステータステキスト
      // - code: エラーコード（存在する場合）
      setError(authError);
      console.error("認証エラー:", {
        message: authError.message,
        status: authError.status,
        statusText: authError.statusText,
        code: authError.code,
      });
    } else {
      console.log("サインイン成功:", data);
    }

    setLoading(false);
  };

  // 方法2: onErrorコールバックを使用
  const handleSignInWithCallback = async () => {
    setError(null);
    setLoading(true);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (ctx) => {
          // ctx.errorにエラー情報が含まれます
          setError(ctx.error);
          console.error("エラーの詳細:", getErrorDetails(ctx.error));
        },
        onSuccess: (ctx) => {
          console.log("サインイン成功:", ctx.data);
        },
      }
    );

    setLoading(false);
  };

  // 方法3: onErrorコールバックを使用した高度なエラーハンドリング
  const handleSignInAdvanced = async () => {
    setError(null);
    setLoading(true);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: async (ctx) => {
          const { error: authError } = ctx;
          setError(authError);

          // レート制限エラーの場合の処理
          if (authError?.status === 429) {
            console.log("レート制限に達しました。しばらく待ってから再試行してください");
          }

          console.error("高度なエラーハンドリング:", getErrorDetails(authError));
        },
        onSuccess: (ctx) => {
          console.log("高度なサインイン成功:", ctx.data);
        },
      }
    );

    setLoading(false);
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">エラーハンドリングの例</h2>

      <div className="space-y-2">
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold">エラーが発生しました:</p>
              <p>{getErrorMessage(error)}</p>
              {error.code && (
                <p className="text-xs opacity-70">エラーコード: {error.code}</p>
              )}
              {error.status && (
                <p className="text-xs opacity-70">HTTPステータス: {error.status}</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={handleSignInBasic} disabled={loading}>
          方法1: 基本的なエラーハンドリング
        </Button>
        <Button onClick={handleSignInWithCallback} disabled={loading}>
          方法2: コールバック使用
        </Button>
        <Button onClick={handleSignInAdvanced} disabled={loading}>
          方法3: 高度なエラーハンドリング
        </Button>
      </div>
    </div>
  );
}

