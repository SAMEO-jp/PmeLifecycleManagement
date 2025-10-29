import { AuthView } from "@daveyplate/better-auth-ui"
import { authViewPaths } from "@daveyplate/better-auth-ui/server"

type AuthPageProps = {
    params: Promise<{
        authView: string
    }>
}

export default async function AuthPage({ params }: AuthPageProps) {
    const { authView } = await params

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="w-full max-w-md p-6">
                <AuthView authView={authView} />
            </div>
        </div>
    )
}

export async function generateStaticParams() {
    return authViewPaths.map((authView) => ({
        authView,
    }))
}
