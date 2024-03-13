// iron-session handles sessions with encoded cookies.
// Since browsers cannot access it, it is necessary
// to store admins' sessions manually.
import { Admin } from "../types"

/**
 * It stores the admin data in the browser local storage.
 * @param admin The admin to store.
 */
export function saveAdmin(admin: Admin) {
    localStorage.setItem("admin", JSON.stringify(admin))
}

/**
 * It retrieves the admin data from the browser local storage.
 * @returns The admin data.
 */
export function getAdmin() {
    const admin = localStorage.getItem("admin")

    if (admin) {
        try {
            return JSON.parse(admin)
        } catch (error) {
            console.error("Failed to parse admin data:", error)
        }
    }

    return null
}

/**
 * It deletes the admin data from the browser local storage.
 */
export function deleteAdmin() {
    localStorage.removeItem("admin")
}
