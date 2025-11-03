"use client"

import React, { useState } from "react"
import { Bug, Monitor, User, Settings, Database, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDisplaySize } from "@/components/app/providers/display-size-context"
import { useFonts } from "@/components/app/providers/font-provider"
import { useFormattedDate } from "@/components/app/providers/date-context"
import { authClient } from "@/core/better-auth/auth-client"

interface DevagLayoutProps {
  children: React.ReactNode
}

export function DevagLayout({ children }: DevagLayoutProps) {
  const [isDebugOpen, setIsDebugOpen] = useState(false)
  const { displaySize, isLoading: displayLoading } = useDisplaySize()
  const { fonts, fontClasses } = useFonts()
  const formattedDate = useFormattedDate()
  const { data: session, isPending: sessionLoading } = authClient.useSession()

  // 開発環境でのみ表示
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!isDevelopment) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* メインコンテンツ */}
      {children}

      {/* 開発環境専用デバッグメニュー - Next.js 風デザイン */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsDebugOpen(!isDebugOpen)}
          className="h-12 w-12 bg-red-900 hover:bg-red-800 text-white shadow-lg rounded-full border-2 border-red-700 flex items-center justify-center"
          size="sm"
        >
          <Bug className="h-5 w-5" />
        </Button>
      </div>

      {/* デバッグ画面 - Next.js 開発ツール風（リサイズ可能） */}
      {isDebugOpen && (
        <Tabs defaultValue="1" className="fixed top-16 right-4 z-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-96 max-h-[1000px] overflow-hidden resize-y min-h-16 flex flex-col">
          {/* ヘッダー */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-red-500" />
              <h2 className="text-sm font-semibold">開発環境デバッグ</h2>
              <Badge variant="destructive" className="text-xs">
                DEV
              </Badge>
                <TabsList className="grid w-1/3 grid-cols-2 h-6">
              <TabsTrigger value="1" className="text-xs py-0 px-2 h-5">情報</TabsTrigger>
              <TabsTrigger value="2" className="text-xs py-0 px-2 h-5">変数</TabsTrigger>
            </TabsList>
            </div>

            {/* タブメニュー */}

          </div>

          {/* デバッグコンテンツ */}
          <div className="p-3 flex-1 min-h-0 overflow-y-auto">
            {/* タブ1: 従来のデバッグ情報 */}
            <TabsContent value="1" className="space-y-3">
                {/* 画面サイズ情報 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      画面サイズ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {displayLoading ? (
                      <div className="animate-pulse">読み込み中...</div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {displaySize.width} × {displaySize.height}
                          <span className="text-xs text-muted-foreground ml-2">
                            (リアルタイム更新)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={displaySize.isMobile ? "default" : "secondary"}>
                            Mobile: {displaySize.isMobile ? "Yes" : "No"}
                          </Badge>
                          <Badge variant={displaySize.isTablet ? "default" : "secondary"}>
                            Tablet: {displaySize.isTablet ? "Yes" : "No"}
                          </Badge>
                          <Badge variant={displaySize.isDesktop ? "default" : "secondary"}>
                            Desktop: {displaySize.isDesktop ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Breakpoint: {displaySize.breakpoint}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* ユーザー情報 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      認証状態
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {sessionLoading ? (
                      <div className="animate-pulse">読み込み中...</div>
                    ) : session ? (
                      <>
                        <div className="font-medium">{session.user.name || '名前なし'}</div>
                        <div className="text-sm text-muted-foreground">{session.user.email}</div>
                        <Badge variant="default" className="text-xs">
                          ログイン中
                        </Badge>
                      </>
                    ) : (
                      <>
                        <div className="text-muted-foreground">未ログイン</div>
                        <Badge variant="secondary" className="text-xs">
                          未認証
                        </Badge>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* システム情報 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      システム情報
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">環境</div>
                      <Badge variant="outline">{process.env.NODE_ENV}</Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Next.js</div>
                      <div className="text-sm text-muted-foreground">
                        {process.env.NEXT_RUNTIME || '不明'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">User Agent</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {typeof window !== 'undefined' ? navigator.userAgent : 'SSR'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">今日の日付</div>
                      <Badge variant="outline">{formattedDate}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* データベース状態 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      データベース
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Drizzle ORM + PostgreSQL
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      接続状態: 正常
                    </div>
                  </CardContent>
                </Card>

                {/* パフォーマンス情報 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      パフォーマンス
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">メモリ使用量</div>
                      <div className="text-sm text-muted-foreground">
                        {typeof window !== 'undefined' && 'memory' in performance
                          ? `${Math.round((performance as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize / 1024 / 1024)}MB`
                          : 'N/A'
                        }
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">ページロード時間</div>
                      <div className="text-sm text-muted-foreground">
                        {typeof window !== 'undefined'
                          ? `${Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart)}ms`
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* クイックアクション */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">クイックアクション</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.location.reload()}
                    >
                      ページリロード
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => console.clear()}
                    >
                      コンソールクリア
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* タブ2: プロバイダー変数 */}
              <TabsContent value="2" className="space-y-3 h-full overflow-y-auto">
                {/* Display Size Provider */}
    

                {/* Auth Provider */}


                {/* Font Provider */}

            </TabsContent>

            {/* タブ2: プロバイダー変数 */}
            <TabsContent value="2" className="space-y-3">
                {/* Display Size Provider */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Display Size Provider
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">isLoading</div>
                      <Badge variant={displayLoading ? "default" : "secondary"}>
                        {displayLoading ? "true" : "false"}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium">displaySize</div>
                      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded font-mono">
                        {JSON.stringify(displaySize, null, 2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">rightSidebarWidth</div>
                      <Badge variant="secondary">
                        {displaySize.rightSidebarWidth}px (画面幅 ÷ 8)
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium">mainSidebarWidth</div>
                      <Badge variant="secondary">
                        {displaySize.mainSidebarWidth}px (画面幅 ÷ 7)
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium">headerHeight</div>
                      <Badge variant="secondary">
                        {displaySize.headerHeight}px (画面高 ÷ 15)
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium">利用可能なフック</div>
                      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded font-mono">
                        <div>useDisplaySize() → {'{ displaySize, isLoading }'}</div>
                        <div>useDisplayWidth() → number</div>
                        <div>useDisplayHeight() → number</div>
                        <div>useRightSidebarWidth() → number</div>
                        <div>useMainSidebarWidth() → number</div>
                        <div>useHeaderHeight() → number</div>
                        <div>useBreakpoint() → &apos;mobile&apos;|&apos;tablet&apos;|&apos;desktop&apos;</div>
                        <div>useIsMobile() → boolean</div>
                        <div>useIsTablet() → boolean</div>
                        <div>useIsDesktop() → boolean</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Auth Provider */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Auth Provider
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">isPending (sessionLoading)</div>
                      <Badge variant={sessionLoading ? "default" : "secondary"}>
                        {sessionLoading ? "true" : "false"}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium">data (session)</div>
                      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded font-mono">
                        {session ? JSON.stringify(session, null, 2) : "null"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">利用可能なフック</div>
                      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded font-mono">
                        <div>authClient.useSession() → {'{ data: session, isPending: sessionLoading }'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Font Provider */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Font Provider
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">fontClasses</div>
                      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded font-mono break-all">
                        {fontClasses}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">fonts</div>
                      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded font-mono">
                        {JSON.stringify({
                          geistSans: fonts.geistSans ? "Loaded" : "Not loaded",
                          geistMono: fonts.geistMono ? "Loaded" : "Not loaded",
                          allertaStencil: fonts.allertaStencil ? "Loaded" : "Not loaded",
                          interBlack: fonts.interBlack ? "Loaded" : "Not loaded",
                          russoOne: fonts.russoOne ? "Loaded" : "Not loaded"
                        }, null, 2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">利用可能なフック</div>
                      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded font-mono">
                        <div>useFonts() → {'{ fonts, fontClasses }'}</div>
                      </div>
            </div>
                  </CardContent>
                </Card>
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  )
}
