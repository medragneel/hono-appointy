import { Hono } from 'hono'
import { booking } from './routes/bookings'
import { cors } from 'hono/cors'


const app = new Hono()
app.use('*', cors({
    origin: 'http://localhost:5173', // Ensure this is correct
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type', 'Access-Control-Allow-Origin'],
    credentials: true
}));

app.get('/', (c) => {
    return c.text('🔥 welcome to Appointy 🔥')
})

app.route("/api", booking)

export type AppType = typeof app


export default app
