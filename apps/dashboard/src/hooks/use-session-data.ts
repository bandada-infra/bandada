import { useCallback, useEffect, useState } from "react"
import { Admin } from "../types"
import * as session from "../utils/session"
import * as bandadaAPI from "../api/bandadaAPI"

/**
 * Stores and retrieves the admin session data using
 * the browser local storage.
 * @returns Functions to save and delete and admin data.
 */
export default function useSessionData() {
    const [_admin, setAdmin] = useState<Admin | null>(session.getAdmin())

    useEffect(() => {
        ;(async () => {
            if (!(await bandadaAPI.isLoggedIn())) {
                session.deleteAdmin()
                setAdmin(null)
            }
        })()
    }, [])

    const saveAdmin = useCallback((admin: Admin) => {
        session.saveAdmin(admin)
        setAdmin(admin)
    }, [])

    const deleteAdmin = useCallback(() => {
        session.deleteAdmin()
        setAdmin(null)
    }, [])

    return {
        saveAdmin,
        deleteAdmin,
        admin: _admin
    }
}
