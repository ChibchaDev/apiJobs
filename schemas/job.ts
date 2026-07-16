// ================================
// VALIDACIÓN CON ZOD + TYPESCRIPT
// ================================

import { z } from "zod"

// Zod infiere los tipos automáticamente
// Esto evita duplicar la definición de tipos

// ================================
// SCHEMA DE JOB
// ================================

export const jobDataSchema = z.object({
  technology: z.array(z.string()),
  modality: z.enum(["remote", "onsite", "hybrid"]),
  level: z.enum(["junior", "mid", "senior"])
})

export const jobContentSchema = z.object({
  description: z.string(),
  responsibilities: z.string(),
  requirements: z.string(),
  about: z.string()
})

export const jobSchema = z.object({
  title: z.string({ error: "Title is required" }).min(3, "Title must be at least 3 characters"),
  company: z.string({ error: "Company is required" }),
  location: z.string({ error: "Location is required" }),
  description: z.string({ error: "Description is required" }),
  
  data: jobDataSchema,
  
  content: jobContentSchema.optional()
})

// ================================
// TIPOS INFERIDOS DE ZOD
// ================================

// Zod puede inferir tipos de TypeScript automáticamente
// Esto mantiene los tipos sincronizados con la validación

export type JobInput = z.infer<typeof jobSchema>
export type JobDataInput = z.infer<typeof jobDataSchema>
export type JobContentInput = z.infer<typeof jobContentSchema>

// ================================
// FUNCIONES DE VALIDACIÓN
// ================================

export function validateJob(input: unknown) {
  return jobSchema.safeParse(input)
}

export function validatePartialJob(input: unknown) {
  return jobSchema.partial().safeParse(input)
}

// ================================
// TIPO DEL RESULTADO DE VALIDACIÓN
// ================================

// SafeParseReturnType tiene dos formas:
// { success: true, data: T }
// { success: false, error: ZodError }

export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: z.ZodError }