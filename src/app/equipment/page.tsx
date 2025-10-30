"use client"

import { AuthGuard } from "../../components/app/components/AuthGuard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function EquipmentPage() {
  return (
    <AuthGuard>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">設備管理</h1>
              <p className="text-muted-foreground mt-2">
                設備の登録・管理を行います
              </p>
            </div>
            <Button>
              <Plus className="mr-2 size-4" />
              新規登録
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>設備一覧</CardTitle>
              <CardDescription>
                登録されている設備の一覧を表示します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                このページは認証が必要です。ログインしていないユーザーはアクセスできません。
              </p>
            </CardContent>
          </Card>
        </div>
    </AuthGuard>
  )
}

