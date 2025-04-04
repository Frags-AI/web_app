import { handle } from 'hono/aws-lambda'
import app from '@/app'

app.get('/', (c) => c.text('Hello Hono!'))

export const handler = handle(app)