import { Context, Next } from "hono"
import { isOverlapping } from "./timeUtils"
import { getAll } from "../server/db/models/appointement"

export const checkBookingConflict = async (c: Context, next: Next) => {
    const bookings = await getAll()
    console.log(await c.req.json())
    const { date, startTime, endTime } = await c.req.json()
    const bookingId = Number.parseInt(c.req.param().id)
    const startDateTime = new Date(`${date}T${startTime}`)
    const endDateTime = new Date(`${date}T${endTime}`)
    const conflict = bookings.some((booking) => booking.id !== bookingId && booking.date === date && isOverlapping(
        new Date(`${booking.date}T${booking.startTime}`),
        new Date(`${booking.date}T${booking.endTime}`),
        startDateTime,
        endDateTime
    ))
    if (conflict) {
        return c.json({ error: 'this timeslot  conflicts with an existing booking' }, 409)

    }
    await next()

}
