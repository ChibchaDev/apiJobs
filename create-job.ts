async function createJob() {
  const response = await fetch("http://localhost:3000/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "Senior Backend Engineer",
      company: "Cloud Systems",
      location: "Madrid, Spain",
      description: "Buscamos un desarrollador backend con experiencia creando APIs escalables.",
      data: {
        technology: [
          "Node.js",
          "TypeScript",
          "PostgreSQL"
        ],
        modality: "hybrid",
        level: "senior"
      }
    })
  })

  const data = await response.json()

  console.log(data)
}

createJob()