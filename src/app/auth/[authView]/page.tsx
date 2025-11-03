"use client"

import { AuthView } from "@daveyplate/better-auth-ui"
import { use } from "react"
import { usePathname } from "next/navigation"

type AuthPageProps = {
    params: Promise<{
        authView: string
    }>
}

export default function AuthPage({ params }: AuthPageProps) {
    const { authView } = use(params)
    const pathname = usePathname()

    // URLパラメータをAuthViewのviewプロパティに変換
    const viewMap: Record<string, string> = {
        "sign-in": "SIGN_IN",
        "sign-up": "SIGN_UP",
        "sign-out": "SIGN_OUT",
        "forgot-password": "FORGOT_PASSWORD",
        "reset-password": "RESET_PASSWORD",
        "magic-link": "MAGIC_LINK",
        "logout": "SIGN_OUT",
        "email-otp": "EMAIL_OTP",
        "two-factor": "TWO_FACTOR",
    }

    const view = viewMap[authView] || authView.toUpperCase().replace(/-/g, "_")

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="w-full max-w-md p-6">
                <AuthView
                    view={view as "SIGN_IN" | "SIGN_UP" | "SIGN_OUT" | "FORGOT_PASSWORD" | "RESET_PASSWORD" | "MAGIC_LINK" | "EMAIL_OTP" | "TWO_FACTOR"}
                    pathname={pathname}
                />
            </div>
        </div>
    )
}
