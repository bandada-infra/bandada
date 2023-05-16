// iron-session handles sessions with encoded cookies.
// Since browsers cannot access it, it is necessary
// to store admins' sessions manually.
// TODO: explore other solutions.

export function saveAdmin(admin: { address: string; id: string }) {
    localStorage.setItem("admin", JSON.stringify(admin))
}

export function getAdmin() {
    const admin = localStorage.getItem("admin")
    if (admin) {
        return JSON.parse(admin)
    }
    return null
}

export function deleteAdmin() {
    localStorage.removeItem("admin")
}
