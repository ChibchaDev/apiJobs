import cors from 'cors'


const ACCEPTED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:1234'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
    return cors({
        origin: (origin, callback) => {
            if (ACCEPTED_ORIGINS.includes(origin) || !origin){
                return callback(null, true)
            }

            return callback(new Error('Origen no permitido'))
        }
    })
}

