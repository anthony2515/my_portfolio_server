const express = require('express')
const fs = require('node:fs/promises')
const path = require('path')
const cors = require('cors')
const server = express()
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors())
server.use('/images', express.static(path.join(__dirname,'public','project_images')));

server.get('/api/v1/photo', async (req, res) => {
  try{
    // const response = await fs.readFile('./public/gundam.jpg')
    const response = await fs.readFile(path.join(__dirname,'public','gundam.jpg'))

    res.setHeader('Content-Type', 'image/*')
    res.send(response)
  }catch(e){
    console.log("error fetching image",e)
  }
  
})
server.get('/api/v1/about_me',async(req,res) => {
  try{
    // const response = await fs.readFile('./data/data.json')
    const response = await fs.readFile(path.join(__dirname,'data','data.json'))

    res.setHeader('Content-Type','application/json')
    res.send(JSON.parse(response))
  }catch(e){
    console.log("error fetching JSON data",e)
  }
})
// server.get('/api/v1/project_video',async(req,res)=>{
  
//   const response = await fs.readFile(path.join(__dirname,'data','data.json'))
//   const video = JSON.parse(response).projects.map((data)=>data.video)
//   const directoryPath = path.join(__dirname, 'public', 'videos',video);
//   const listOfVideos = await fs.readFile(directoryPath)
//   res.send(listOfVideos)
// })
const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`)
})