import express, { response } from 'express'
import jobs from './jobs.json' with { type: 'json' }
import { DEFAULTS } from './config.js'

const PORT = process.env.PORT ?? DEFAULTS.PORT
const app = express()

app.use((request, response, next) =>{
    const timeString = new Date().toLocaleDateString()
    console.log(`[${timeString} ${request.method} ${request.url}]`)
    next()
})

app.get('/', (request, response) =>{
    return response.send('<h1>Hello World</h1>')
})

app.get('/health', (request, response) => {
    return response.json({
        status: 'ok',
        uptime: process.uptime()
    })
})

app.get('/jobs', (req, res) => {
    const { text, title, level, limit = DEFAULTS.LIMIT_PAGINATION, technology, offset = DEFAULTS.LIMIT_OFFSET } = req.query

    let filteredJobs = jobs

    if(text) {
        const searchTerm = text.toLowerCase()
        filteredJobs = filteredJobs.filter(jobs =>
            job.titulo.toLowerCase().includes(searchTerm) || job.descripcion.toLowerCase().includes(searchTerm)
        )
    }

    if(technology){
        filteredJobs = filteredJobs.filter(job =>
            job.tecnologias.includes(technology)
        )
    }

    const limitNumber = Number(limit)
    const offsetNumber = Number(offset)
    
    const paginatedJobs = filteredJobs.slice(offsetNumber, offsetNumber + limitNumber)
    
    return res.json(filteredJobs)
})

app.delete('/jobs/:id', (req, res) =>{
    const { id } = req.params
    const idNumber = Number(id)

    return res.json({
        job: { id: idNumber, tittle: `Job with id ${id}` }
    })
})

app.post('/jobs', (req, res) => {

})

app.put('/jobs/:id', (req, res) =>{

})

app.patch('/jobs/:id', (req, res) => {
    
})

app.get('/jobs/:id', (req, res) =>{
    const { id } = req.params

    const idNumber = Number(id) 

    return res.json({
        job: { id, title: `Job with id ${id}` }
    })
})

app.listen(PORT, () =>{
    console.log(`Servidor levantado en http://localhost:${PORT}`)
})