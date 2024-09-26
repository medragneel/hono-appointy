import { eq } from "drizzle-orm";
import { db } from "../client"
import * as schema from "../schema";


const getAll = async () => {
    const bookings = await db.select().from(schema.appointements)
    return bookings

}
const getBookingById = (id: number) => {
    const booking = db.select().from(schema.appointements).where(eq(schema.appointements.id, id)).get()
    console.log("model log:", booking)

    return booking
}

const createNewBooking = async (data: typeof schema.appointements.$inferInsert) => {
    await db.insert(schema.appointements).values(data)
}
const updateBooking = async (data: Partial<typeof schema.appointements.$inferInsert>, id: number) => {

    await db.update(schema.appointements).set(data).where(eq(schema.appointements.id, id))
}

const removeBooking = async (id: number) => {

    await db.delete(schema.appointements).where(eq(schema.appointements.id, id))

}

export { getAll, getBookingById, createNewBooking, updateBooking, removeBooking }
