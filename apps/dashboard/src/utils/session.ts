// iron-session handles sessions with encoded cookies.
// Since browsers cannot access it, it is necessary
// to store admins' sessions manually.
// TODO: explore other solutions.

export function saveAdmin(address: string) {
    localStorage.setItem("admin", address)
}

export function getAdmin() {
    return localStorage.getItem("admin")
}

export function deleteAdmin() {
    localStorage.removeItem("admin")
}
