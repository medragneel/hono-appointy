import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm"


const timestamps = {
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
};

export const appointements = sqliteTable("appointements", {
    id: integer("id").primaryKey({ autoIncrement: true }).unique(),
    name: text("name").default("test"),
    date: text("date").notNull(),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    service: text("servive").notNull(),
    ...timestamps
});
