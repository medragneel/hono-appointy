/** @type { import("drizzle-kit").Config } */
export default {
    dialect: 'sqlite',
    driver: "better-sqlite",
    schema: './src/server/db/schema.ts',
    out: './drizzle',
    dbCredentials: {
        url: 'file:./sqlite.db'
    }
};

