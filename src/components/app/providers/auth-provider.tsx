"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { authClient } from "@/core/better-auth/auth-client"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthUIProvider authClient={authClient}>
            {children}
        </AuthUIProvider>
    )
}
