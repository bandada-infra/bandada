// iron-session handles sessions with encoded cookies.
// Since browsers cannot access it, it is necessary
// to store admins' sessions manually.
import { Admin } from "../types"

/**
 * Stores the admin data in the browser local storage.
 * @param admin The admin to store.
 */
export function saveAdmin(admin: Admin) {
    localStorage.setItem("admin", JSON.stringify(admin))
}

/**
 * Retrieve the admin data from the browser local storage.
 * @returns The admin data.
 */
export function getAdmin() {
    const admin = localStorage.getItem("admin")

    if (admin) {
        return JSON.parse(admin)
    }

    return null
}

/**
 * Deletes the admin data from the browser local storage.
 */
export function deleteAdmin() {
    localStorage.removeItem("admin")
}
