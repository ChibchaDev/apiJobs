import { db } from "./db/database.js"

const jobs = db.prepare(`
  SELECT * FROM jobs
`).all()

console.log(jobs)