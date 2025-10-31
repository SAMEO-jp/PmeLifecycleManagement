"use client";
import { UserButton } from "@daveyplate/better-auth-ui";

export default function NipponSteelUserButton(
  props: React.ComponentProps<typeof UserButton>
) {
  return (
    <UserButton
      // ▼ メニューの出方
      side="bottom"
      align="end"
      sideOffset={8}
      alignOffset={-2}

      // ▼ ボタン本体（外枠）
      className={[
        "w-64 h-11 px-3 rounded-xl border transition inline-flex items-center gap-3",
        "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50",
        "dark:bg-zinc-900 dark:text-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3D9]/40",
      ].join(" ")}

      // ▼ この型にあるキーだけを使用
      classNames={{
        base: "",               // 追加があれば
        skeleton: "",           // ローディング時をカスタムしたければ

        // トリガーボタン内の見た目（アバター・表示名など）
        trigger: {
          base: "gap-3",        // トリガー内部のレイアウト微調整
          avatar: {
            fallback: "bg-[#1F4E79] text-white dark:bg-[#0A2A43] dark:text-white", // 濃紺
          },
          user: {
            base: "flex flex-col text-left leading-tight",
          },
          skeleton: "",         // 必要なら
        },

        // ドロップダウン「内容」側の見た目
        content: {
          base: [
            // “枠そのもの” をここで整える
            "rounded-xl border shadow-lg",
            "bg-white border-zinc-200",
            "dark:bg-zinc-900 dark:border-zinc-800",
          ].join(" "),
          user: {
            base: "px-3 py-2",
          },
          avatar: {
            fallback: "bg-[#1F4E79] text-white dark:bg-[#0A2A43] dark:text-white",
          },
          menuItem: "px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800",
          separator: "my-1 h-px bg-zinc-200 dark:bg-zinc-800",
        },
      }}

      // ▼ 追加リンク（separatorは“この項目の前に線”）
      additionalLinks={[
        { href: "/dashboard", label: "ダッシュボード", signedIn: true },
        { href: "/help", label: "ヘルプ / お問い合わせ", signedIn: true, separator: true },
      ]}

      // ※ この型の props に localization は無いので渡さない
      {...props}
    />
  );
}
