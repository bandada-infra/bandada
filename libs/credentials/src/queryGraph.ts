import { request } from "@bandada/utils"

/**
 * It returns a function that can be used to query graphs
 * data using GraphQL style queries for the EAS provider supported by Bandada.
 * @param endpoint The endpoint of the graph.
 * @param query The query to execute to fetch the data.
 * @returns The function to query the graph.
 */
export default function queryGraph(endpoint: string, query: string) {
    request(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
            query
        })
    })
}
