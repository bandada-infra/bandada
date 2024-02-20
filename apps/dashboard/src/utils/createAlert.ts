export default function createAlert(message: string) {
    if (message) {
        alert(message)
    } else {
        alert("Some error occurred!")
    }
}
