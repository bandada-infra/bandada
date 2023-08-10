export const config = {
    headers: {
        "Content-Type": "application/json"
    },
    baseURL:
        process.env.NODE_ENV === "test"
            ? "http://localhost:3000"
            : /* istanbul ignore next */
              "https://api.bandada.pse.dev/"
}
