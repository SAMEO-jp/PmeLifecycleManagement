import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Award, Target } from "lucide-react"

export default function AchievementPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">実績・成果</h1>
        <p className="text-muted-foreground">
          PMEシステムの主要な実績と成果を紹介します
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 主要実績 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <CardTitle>システム開発完了</CardTitle>
            </div>
            <CardDescription>PME設備管理システムの開発が完了</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="default">完了</Badge>
              <p className="text-sm text-muted-foreground">
                Next.js, TypeScript, Tailwind CSSを使用したモダンなWebアプリケーション
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 技術スタック */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              <CardTitle>技術スタック</CardTitle>
            </div>
            <CardDescription>使用した主要技術</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Next.js 16</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Tailwind CSS</Badge>
              <Badge variant="secondary">shadcn/ui</Badge>
              <Badge variant="secondary">Better Auth</Badge>
              <Badge variant="secondary">Drizzle ORM</Badge>
            </div>
          </CardContent>
        </Card>

        {/* 機能実装 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              <CardTitle>実装機能</CardTitle>
            </div>
            <CardDescription>システムに実装された主要機能</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                <span className="text-sm">レスポンシブUI</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                <span className="text-sm">認証システム</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                <span className="text-sm">開発者ツール</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                <span className="text-sm">動的サイズ調整</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* パフォーマンス */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              <CardTitle>パフォーマンス</CardTitle>
            </div>
            <CardDescription>システムの性能指標</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">読み込み速度</span>
                <Badge variant="default">高速</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">レスポンシブ</span>
                <Badge variant="default">最適化</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">アクセシビリティ</span>
                <Badge variant="default">対応</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 今後の展望 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-500" />
              <CardTitle>今後の展望</CardTitle>
            </div>
            <CardDescription>将来の開発予定</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">計画中</Badge>
                <span className="text-sm">データベース統合</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">計画中</Badge>
                <span className="text-sm">API拡張</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">計画中</Badge>
                <span className="text-sm">モバイルアプリ</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* チーム情報 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              <CardTitle>開発チーム</CardTitle>
            </div>
            <CardDescription>プロジェクトに関わったメンバー</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <div className="font-medium">開発者</div>
                <div className="text-muted-foreground">AI Assistant & Developer</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">技術支援</div>
                <div className="text-muted-foreground">Next.js, TypeScript, UI/UX</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フッター情報 */}
      <div className="mt-12 pt-8 border-t text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 PME System. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          設備管理システム - 効率的な業務運用をサポート
        </p>
      </div>
    </div>
  )
}
