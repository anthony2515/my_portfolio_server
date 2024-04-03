const express = require('express')
const fs = require('node:fs/promises')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const server = express()
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors())
server.use(
  '/images',
  express.static(path.join(__dirname, 'public', 'project_images'))
)

server.get('/api/v1/photo', async (req, res) => {
  try {
    const response = await fs.readFile(
      path.join(__dirname, 'public', 'display_photo.jpg')
    )

    res.setHeader('Content-Type', 'image/*')

    res.send(response)
  } catch (e) {
    console.log('error fetching image', e)
  }
})
server.get('/api/v1/about_me', async (req, res) => {
  try {
    const response = await fs.readFile(
      path.join(__dirname, 'data', 'data.json')
    )

    res.setHeader('Content-Type', 'application/json')

    res.send(JSON.parse(response))
  } catch (e) {
    console.log('error fetching JSON data', e)
  }
})
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public')) // Sets the destination for uploaded files
  },
  filename: function (req, file, cb) {
    // Sets the file name. This example uses the original file name, but it can be customized
    cb(null, 'display_photo.jpg')
  },
})
const uploadDisplayPhoto = multer({ storage: storage })
server.post('/api/v1/file',uploadDisplayPhoto.single('file'),async (req, res) => {
    console.log(req.file)
  }
)

const ProjectImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'project_images')) // Sets the destination for uploaded files
  },
  filename: function (req, file, cb) {
    // Sets the file name. This example uses the original file name, but it can be customized
    cb(null, file.originalname)
  
  },
})
const uploadProjectImage = multer({ storage: ProjectImageStorage })
server.post('/api/v1/projectImage',uploadProjectImage.single('project_image'),async (req, res) => {
    const newProjectImage = req.file.originalname
    console.log("file objects",req.file)
    const {imageToReplace, index} = req.body
    fs.unlink(
      path.join(__dirname, 'public', 'project_images', imageToReplace),(err,data) =>{
        if(err){
          throw err
        }else{
          console.log(`${data} is succesfully deleted`)
        }
      }
    )

    const data  = await fs.readFile(path.join(__dirname,'data','data.json'))
    const jsonData = JSON.parse(data)
    jsonData.projects[index].image = newProjectImage
    const updateJson = JSON.stringify(jsonData)
    console.log("imageStorage",ProjectImageStorage.getFilename)
    await fs.writeFile(path.join(__dirname,'data','data.json'),updateJson)
    //work on data.json projects[index].image get that
  }
)
server.post('/api/v1/data',async(req,res) => {
  const result = JSON.stringify(req.body,null,2)
  await fs.writeFile(path.join(__dirname,'data','data.json'),result)
})
server.post('/api/v1/addProject',uploadProjectImage.single('image'),async(req,res)=>{
  const image = req.file.originalname
  const {project_name,description,github_url}=req.body
  const tech_used = req.body.tech_used.split(",")
  const obj = {
    image,
    project_name,
    description,
    tech_used,
    github_url
  }
  const readData = await fs.readFile(path.join(__dirname,'data','data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.projects.unshift(obj)
  const result = JSON.stringify(parseReadData,null,2)
  await fs.writeFile(path.join(__dirname,'data','data.json'),result)
  res.send("project added successfully")
})
server.delete('/api/v1/deleteProject',async(req,res) =>{
  const {index,image} = req.body
  const readData = await fs.readFile(path.join(__dirname,'data','data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.projects.splice(index,1)
  const result = JSON.stringify(parseReadData,null,2)
  await fs.writeFile(path.join(__dirname,'data','data.json'),result)
  await fs.unlink(path.join(__dirname,'public','project_images',image))
  res.send("Project Deleted")
})
const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`)
})
