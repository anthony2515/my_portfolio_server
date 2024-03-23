const express = require('express')
const fs = require('node:fs/promises')
const path = require('path')
const cors = require('cors')
const server = express()
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors())

server.get('/api/v1/photo', async (req, res) => {
  try{
    // const response = await fs.readFile('./public/gundam.jpg')
  const response = await fs.readFile(path.join(__dirname,'public',gundam.jpg))

  res.setHeader('Content-Type', 'image/*')
  res.send(response)
  }catch(e){
    console.log("error fetching image",e)
  }
  
})
server.get('/api/v1/about_me',async(req,res) => {
  try{
// const response = await fs.readFile('./data/data.json')
const response = await fs.readFile(__dirname,'data','data.json',{ encoding: 'utf8' })

res.setHeader('Content-Type','application/json')
res.send(JSON.parse(response))
  }catch(e){
    console.log("error fetching data",e)
  }
  
})
const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`)
})
