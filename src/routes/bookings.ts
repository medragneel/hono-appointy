import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { bookingSchema } from "../utils/zodSchema";
import { checkBookingConflict } from "../utils/middlewares";


export const booking = new Hono().basePath("/booking")


export const bookings = [
    {
        "id": 1,
        "name": "John Doe",
        "date": "2024-09-24",
        "startTime": "09:00:00",
        "endTime": "10:00:00",
        "service": "Haircut"
    }
]


booking.get("/", (c) => c.json(bookings))
booking.get("/:id", (c) => {
    const id = Number.parseInt(c.req.param().id)
    const booking = bookings.find((b) => b.id === id)
    console.log(booking)
    if (booking === undefined) {
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
        const { name, date, startTime, endTime, service } = c.req.valid('json')
        const booking = {
            id: bookings.length + 1,
            name,
            date,
            startTime,
            endTime,
            service

        }
        bookings.push(booking)
        return c.json({ message: "success" }, 201)
    })
booking.put("/:id", checkBookingConflict, zValidator('json', bookingSchema, (result, c) => {
    if (!result.success) {
        return c.json({ message: "Invalid Data" }, 400)
    }
}),
    async (c) => {
        const bookingId = Number.parseInt(c.req.param().id)
        const bookingIndex = bookings.findIndex((b) => b.id === bookingId)
        console.log(bookingIndex)
        if (bookingIndex === -1) return c.json({ error: "booking not found" }, 404)
        const { name, date, startTime, endTime, service } = c.req.valid('json')

        bookings[bookingIndex] = {
            ...bookings[bookingIndex],
            name,
            date,
            startTime,
            endTime,
            service
        }


        return c.json({ message: `booking ${bookingId} updated successfully` })

    })



booking.delete("/:id", (c) => {
    const bookingId = Number.parseInt(c.req.param().id)
    const bookingIndex = bookings.findIndex((b) => b.id === bookingId)
    if (bookingIndex === -1) return c.json({ error: "booking not found" }, 404)

    bookings.splice(bookingIndex, 1)

    return c.json({ message: `booking ${bookingId} deleted` })
})
