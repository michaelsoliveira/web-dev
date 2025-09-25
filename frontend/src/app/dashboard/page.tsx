'use client'

import { useSession } from "next-auth/react"

const DashboardPage = () => {
    const { data: session } = useSession()
    return (
        <div>
            <h1>{JSON.stringify(session, null, 2)}</h1>
        </div>
    )
}

export default DashboardPage