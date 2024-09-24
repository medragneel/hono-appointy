import { z } from "zod"

export const bookingSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1),
    date: z.string().date(),
    startTime: z.string().time(),
    endTime: z.string().time(),
    service: z.string().min(1)
})

