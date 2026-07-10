import express, { response } from 'express'
import { jobsRouter } from './routes/jobs.js'
import { corsMiddleware } from './middlewares/cors.js'
import { DEFAULTS } from './config.js'

const PORT = process.env.PORT ?? DEFAULTS.PORT
const app = express()

app.use(corsMiddleware())
app.use(express.json())

app.use('/jobs', jobsRouter)

if(process.env.NODE_ENV !== 'production'){
    app.listen(PORT, () =>{
        console.log(`Servidor levantado en http://localhost:${PORT}`)
    })
}


export default app