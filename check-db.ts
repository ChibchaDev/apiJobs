import { db } from "./db/database.ts"

const jobs = db.prepare(`
  SELECT * FROM jobs
`).all()

console.log(jobs)