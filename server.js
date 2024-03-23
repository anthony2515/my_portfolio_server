const express = require('express')
const fs = require('node:fs/promises')
const cors = require('cors')
const server = express()
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors())

server.get('/api/v1/photo', async (req, res) => {
  const response = await fs.readFile('public/gundam.jpg')
  res.setHeader('Content-Type', 'image/*')
  res.send(response)
})
server.get('/api/v1/about_me',async(req,res) => {
  const response = await fs.readFile('data/data.json')
  res.setHeader('Content-Type','application/json')
  res.send(JSON.parse(response))
})
const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`)
})
