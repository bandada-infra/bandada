import { useCallback, useState } from "react"
import { Admin } from "../types"
import * as session from "../utils/session"

/**
 * Stores and retrieves the admin session data using
 * the browser local storage.
 * @returns Functions to save and delete and admin data.
 */
export default function useSessionData() {
    const [admin, setAdmin] = useState<Admin | null>(session.getAdmin())

    const saveAdmin = useCallback((admin: Admin) => {
        saveAdmin(admin)
        setAdmin(admin)
    }, [])

    const deleteAdmin = useCallback(() => {
        session.deleteAdmin()
        setAdmin(null)
    }, [])

    return {
        saveAdmin,
        deleteAdmin,
        admin
    }
}
