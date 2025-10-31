// src/components/app/components/Sidebar/nipponSteelUserButton.tsx
"use client";
import { UserButton } from "@daveyplate/better-auth-ui";

export default function NipponSteelUserButton(
  props: React.ComponentProps<typeof UserButton>
) {
  return (
    <UserButton
      size="lg"
      side="bottom"
      align="end"
      sideOffset={8}
      alignOffset={-2}
      // ボタン本体の外観（濃紺×白×グレー基調）- サイドバー幅に収まるように w-full を使用
      className={[
        "w-full h-13 px-3 rounded-xl border transition inline-flex items-center z-10", // 高さを20%増やして h-11 → h-13 (44px → 52px)
        "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50",
        "dark:bg-zinc-900 dark:text-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3D9]/40"
      ].join(" ")}
      // ← “存在が保証されるキーだけ” を使う
      classNames={{
        base: "",
        trigger: {
          user: {
            subtitle: "hidden", // メールアドレス（サブタイトル）を非表示にする
          },
        },
        content: {
          base: "z-50 w-48", // ドロップダウンメニューをサイドバー内に収める (192px)
        },
      }}
      additionalLinks={[
        { href: "/dashboard", label: "ダッシュボード", signedIn: true },
        { href: "/help", label: "ヘルプ / お問い合わせ", signedIn: true, separator: true },
      ]}
      // localization は型にないキーを渡さない
      localization={{
        SETTINGS: "アカウント設定",
        SIGN_OUT: "ログアウト",
        ACCOUNT: "アカウント",
      }}
      {...props}
    />
  );
}
