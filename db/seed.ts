import { db } from "./database.js";

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    modality TEXT NOT NULL CHECK(modality IN ('remote', 'onsite', 'hybrid')),
    level TEXT NOT NULL CHECK(level IN ('junior', 'mid', 'senior'))
  );

  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id TEXT NOT NULL,
    technology TEXT NOT NULL,
    PRIMARY KEY (job_id, technology),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    job_id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    about TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`)

const insertJob = db.prepare(`
  INSERT OR IGNORE INTO jobs (id, title, company, location, description, modality, level)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertTech = db.prepare(`
  INSERT OR IGNORE INTO job_technologies (job_id, technology) VALUES (?, ?)
`)

const seed = db.transaction(() => {
  insertJob.run('1', 'Senior Frontend Developer', 'Tech Corp', 'Madrid, Spain',
    'Looking for a senior frontend developer', 'hybrid', 'senior')
  insertTech.run('1', 'React')
  insertTech.run('1', 'TypeScript')
  insertTech.run('1', 'CSS')

  insertJob.run('2', 'Full Stack Developer', 'StartupX', 'Remote',
    'Join our team as a full stack developer', 'remote', 'mid')
  insertTech.run('2', 'Node.js')
  insertTech.run('2', 'React')
  insertTech.run('2', 'PostgreSQL')

  insertJob.run('3', 'Junior Backend Developer', 'FinTech Solutions', 'Barcelona, Spain',
    'Great opportunity for junior developers', 'onsite', 'junior')
  insertTech.run('3', 'Node.js')
  insertTech.run('3', 'TypeScript')
  insertTech.run('3', 'MongoDB')
})

seed()

console.log('Base de datos inicializada')