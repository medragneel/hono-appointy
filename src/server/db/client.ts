import { drizzle } from "drizzle-orm/bun-sqlite"
import { Database } from "bun:sqlite"

const client = new Database("sqlite.db", { create: true })
if (!client) {
    console.log("problem creatign the db")
}

export const db = drizzle(client)
if (!db) {
    console.log("problem in db")
}
console.log(db)
