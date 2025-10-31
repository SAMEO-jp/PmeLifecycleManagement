"use client"

import { SignedIn, SignedOut } from "@daveyplate/better-auth-ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground mt-2">
            <SignedIn>
              本日もご安全に
            </SignedIn>
          </p>
        </div>

        <SignedIn>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">設備数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">登録設備</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">メンテナンス予定</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">今月の予定</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">未完了タスク</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">保留中</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">完了率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">今月の完了率</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ダッシュボード</CardTitle>
              <CardDescription>
                システムの概要と主要な統計情報を表示します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                左側のサイドバーから各機能にアクセスできます。
              </p>
            </CardContent>
          </Card>
        </SignedIn>

        <SignedOut>
          <Card>
            <CardHeader>
              <CardTitle>サインインが必要です</CardTitle>
              <CardDescription>
                このシステムを使用するには、アカウントにサインインしてください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                右上の「サインイン」ボタンからログインできます。
              </p>
            </CardContent>
          </Card>
        </SignedOut>
      </div>
  )
}
