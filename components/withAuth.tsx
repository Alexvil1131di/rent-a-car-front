"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

export default function withAuth(Component: any) {
    return function WithAuth(props: any) {
        const [token, setToken] = useState<string | null>(null)
        const router = useRouter()
        const authToken = Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57") || null

        useEffect(() => {
            if (!authToken) { router.push('/LogIn'); return }
            setToken(authToken)
        }, [router, token]) // Include router in dependencies

        if (!token) {
            return null // Or a loading spinner
        }

        return <Component {...props} />
    }
}