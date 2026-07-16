// ================================
// MODELO DE JOB
// ================================

import crypto from "node:crypto"
import { db } from '../db/database.ts'
import type { Job, CreateJobDTO, UpdateJobDTO, JobFilters } from "../types.ts"

// Base de datos en memoria (en producción sería una BD real)
const jobs: Job[] = [
  
]

// ================================
// CLASE DEL MODELO
// ================================

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {

    let query = `
      SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies
      FROM jobs j
      JOIN job_technologies jt ON j.id = jt.job_id
    `

    const conditions: string[] = []
    const params: unknown[] = []

    if (filters?.tech) {
      conditions.push(`jt.technology = ?`)
      params.push(filters.tech)
    }

    if (filters?.modality) {
      conditions.push(`j.modality = ?`)
      params.push(filters.modality)
    }

    if (filters?.level) {
      conditions.push(`j.level = ?`)
      params.push(filters.level)
    }

    if (conditions.length > 0) {
      query += 'WHERE ' + conditions.join(' AND ')
    }

    query += ' GROUP BY j.id'

    type JobRow = {
        id: string
        title: string
        company: string
        location: string
        description: string
        modality: "remote" | "onsite" | "hybrid"
        level: "junior" | "mid" | "senior"
        technologies: string
    }

const rows = db.prepare(query).all(...params) as JobRow[]

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      description: row.description,
      data: {
        technology: row.technologies.split(','),
        modality: row.modality,
        level: row.level
      }
    }))
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
  type JobRow = {
    id: string
    title: string
    company: string
    location: string
    description: string
    modality: "remote" | "onsite" | "hybrid"
    level: "junior" | "mid" | "senior"
    technologies: string | null
  }

  const row = db.prepare(`
    SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies
    FROM jobs j
    LEFT JOIN job_technologies jt ON j.id = jt.job_id
    WHERE j.id = ?
    GROUP BY j.id
  `).get(id) as JobRow | undefined

  if (!row) return undefined

  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    data: {
      technology: row.technologies ? row.technologies.split(',') : [],
      modality: row.modality,
      level: row.level
    }
  }
}

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
  const newJob: Job = {
    id: crypto.randomUUID(),
    ...input
  }

  const insertJob = db.prepare(`
    INSERT INTO jobs (
      id, title, company, location, description, modality, level
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const insertTech = db.prepare(`
    INSERT INTO job_technologies (job_id, technology)
    VALUES (?, ?)
  `)

  const insertTransaction = db.transaction((job: Job) => {
    insertJob.run(
      job.id,
      job.title,
      job.company,
      job.location,
      job.description,
      job.data.modality,
      job.data.level
    )

    for (const tech of job.data.technology) {
      insertTech.run(job.id, tech)
    }
  })

  insertTransaction(newJob)

  return newJob
}

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
  const stmt = db.prepare(`
    DELETE FROM jobs
    WHERE id = ?
  `)

  const result = stmt.run(id)
  return result.changes > 0
}

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    const existing = db.prepare(`
        SELECT *
        FROM jobs
        WHERE id = ?
    `).get(id)

    if (!existing) return null

    const updates: string[] = []
    const params: unknown[] = []

    if (input.title) {
        updates.push("title = ?")
        params.push(input.title)
    }

    if (input.company) {
        updates.push("company = ?")
        params.push(input.company)
    }

    if (input.location) {
        updates.push("location = ?")
        params.push(input.location)
    }

    if (input.description) {
        updates.push("description = ?")
        params.push(input.description)
    }

    if (input.data?.modality) {
        updates.push("modality = ?")
        params.push(input.data.modality)
    }

    if (input.data?.level) {
        updates.push("level = ?")
        params.push(input.data.level)
    }

    const updateJob = db.prepare(`
        UPDATE jobs
        SET ${updates.join(", ")}
        WHERE id = ?
    `)

    const updateTech = db.prepare(`
        DELETE FROM job_technologies
        WHERE job_id = ?
    `)

    const insertTech = db.prepare(`
        INSERT INTO job_technologies (job_id, technology)
        VALUES (?, ?)
    `)

    const transaction = db.transaction(() => {
        if (updates.length > 0) {
        params.push(id)
        updateJob.run(...params)
        }

        if (input.data?.technology) {
        updateTech.run(id)
        for (const tech of input.data.technology) {
            insertTech.run(id, tech)
        }
        }
    })

    transaction()

    const updatedJob = await JobModel.getById(id)
    return updatedJob ?? null
    }
}