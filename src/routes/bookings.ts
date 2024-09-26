import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { bookingSchema } from "../utils/zodSchema";
import { checkBookingConflict } from "../utils/middlewares";
import { createNewBooking, getAll, getBookingById, removeBooking, updateBooking } from "../server/db/models/appointement";


export const booking = new Hono().basePath("/booking")




booking.get("/", async (c) => c.json(await getAll()))
booking.get("/:id", async (c) => {
    const id = Number.parseInt(c.req.param().id)
    const booking = getBookingById(id)
    if (!booking) {
        return c.json({ error: 'booking not found' }, 404)
    }
    return c.json({ "booking": booking })
})
booking.post("/", checkBookingConflict, zValidator('json', bookingSchema, (result, c) => {
    if (!result.success) {
        return c.json({ message: "Invalid Data" }, 400)
    }
}),
    async (c) => {
        try {
            const { name, date, startTime, endTime, service } = c.req.valid('json')
            const bookings = await getAll()
            const booking = {
                id: bookings.length + 1,
                name,
                date,
                startTime,
                endTime,
                service

            }

            if (!name || !date || !startTime || !endTime || !service) {
                return c.json({ error: 'Missing required fields' }, 400)
            }
            await createNewBooking(booking)
            return c.json({ message: "success" }, 201)

        } catch (error) {
            console.error('Error parsing request body:', error);
            return c.json({ error: 'Invalid request' }, 400);
        }
    })
booking.put("/:id", checkBookingConflict, zValidator('json', bookingSchema, (result, c) => {
    if (!result.success) {
        return c.json({ message: "Invalid Data" }, 400)
    }
}),
    async (c) => {
        const bookingId = Number.parseInt(c.req.param().id)
        const bookings = await getAll()
        const existingBooking = getBookingById(bookingId)

        if (!existingBooking) return c.json({ error: "booking not found" }, 404)
        const { name, date, startTime, endTime, service } = c.req.valid('json')

        const bookingdata = {
            ...bookings,
            name,
            date,
            startTime,
            endTime,
            service
        }
        updateBooking(bookingdata, bookingId)
        console.log('New appointment:', c.req.valid('json'))


        return c.json({ message: `booking ${bookingId} updated successfully` })

    })



booking.delete("/:id", (c) => {
    const bookingId = Number.parseInt(c.req.param().id)
    const booking = getBookingById(bookingId)
    if (!booking) return c.json({ error: "booking not found" }, 404)

    removeBooking(bookingId)


    return c.json({ message: `booking ${bookingId} deleted` })
})
