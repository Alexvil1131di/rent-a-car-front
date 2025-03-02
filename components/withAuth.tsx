"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"
import cookie from "js-cookie"

export default function withAuth(Component: any) {
    return function WithAuth(props: any) {
        let token = cookie.get("1da78cf6-d3af-4aa2-a834-611a14bcf80b")
        token = true

        useEffect(() => {
            if (!token) { redirect('/login') }
        }, [])

        if (!token) {
            return null
        }

        return <Component {...props} />
    }
}