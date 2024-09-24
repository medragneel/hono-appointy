import { Hono } from 'hono'
import { booking } from './routes/bookings'

const app = new Hono()

app.get('/', (c) => {
    return c.text('🔥 welcome to Appointy 🔥')
})

app.route("/", booking)
export default app
