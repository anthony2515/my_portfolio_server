const express = require('express')
const fs = require('node:fs/promises')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const server = express()
require('dotenv').config()
server.use(express.urlencoded({ extended: true }))
server.use(express.json())

const corsOptions = {
  origin: 'https://my-portfolio-one-xi-33.vercel.app/' 
}

server.use(cors(corsOptions))
server.use('/images',express.static(path.join(__dirname, 'public', 'project_images')))


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


server.get('/api/v1/data', async (req, res) => {
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
server.post(
  '/api/v1/file',
  uploadDisplayPhoto.single('file'),
  async (req, res) => {
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


server.post(
  '/api/v1/projectImage',
  uploadProjectImage.single('project_image'),
  async (req, res) => {
    const newProjectImage = req.file.originalname
    console.log('file objects', req.file)
    const { imageToReplace, index } = req.body
    fs.unlink(
      path.join(__dirname, 'public', 'project_images', imageToReplace),
      (err, data) => {
        if (err) {
          throw err
        } else {
          console.log(`${data} is succesfully deleted`)
        }
      }
    )

    const data = await fs.readFile(path.join(__dirname, 'data', 'data.json'))
    const jsonData = JSON.parse(data)
    jsonData.projects[index].image = newProjectImage
    const updateJson = JSON.stringify(jsonData)
    console.log('imageStorage', ProjectImageStorage.getFilename)
    await fs.writeFile(path.join(__dirname, 'data', 'data.json'), updateJson)
    //work on data.json projects[index].image get that
  }
)


server.post('/api/v1/data', async (req, res) => {
  
  if(req.body.password == process.env.X_API_KEY){
    delete req.body.password
    const result = JSON.stringify(req.body, null, 2)
    
    await fs.writeFile(path.join(__dirname, 'data', 'data.json'), result)
  
    res.json({ message: "Data added successfully" })
  }else{
    res.status(401).json({error:"missing api key/incorrect key"})
  }
  
  
})


server.post('/api/proxy/data', async (req, res) => {
  const apiUrl = 'http://localhost:3000/api/v1/data'; // The final API URL
  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body), // Forward the client request body to the API
    });
    const data = await apiResponse.json();
    res.json(data); // Send the API response back to the client
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});


server.post(
  '/api/v1/addProject',
  uploadProjectImage.single('image'),
  async (req, res) => {
    const image = req.file.originalname
    const { project_name, description, github_url } = req.body
    const tech_used = req.body.tech_used.split(',')
    const obj = {
      image,
      project_name,
      description,
      tech_used,
      github_url,
    }
    const readData = await fs.readFile(
      path.join(__dirname, 'data', 'data.json')
    )
    const parseReadData = JSON.parse(readData)
    parseReadData.projects.unshift(obj)
    const result = JSON.stringify(parseReadData, null, 2)
    await fs.writeFile(path.join(__dirname, 'data', 'data.json'), result)
    res.send('project added successfully')
  }
)


server.delete('/api/v1/deleteProject', async (req, res) => {
  const { index, image } = req.body
  const readData = await fs.readFile(path.join(__dirname, 'data', 'data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.projects.splice(index, 1)
  const result = JSON.stringify(parseReadData, null, 2)
  await fs.writeFile(path.join(__dirname, 'data', 'data.json'), result)
  await fs.unlink(path.join(__dirname, 'public', 'project_images', image))
  res.send('Project Deleted')
})

server.post('/api/v1/techSkill', async (req, res) => {
  const readData = await fs.readFile(path.join(__dirname, 'data', 'data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.skills[0].technical_skills.unshift(req.body)
  const result = JSON.stringify(parseReadData, null, 2)
  await fs.writeFile(path.join(__dirname, 'data', 'data.json'), result)
  res.send('Tech Skill has been added')
})


server.delete('/api/v1/techSkill', async (req, res) => {
  const { index } = req.body
  const readData = await fs.readFile(path.join(__dirname, 'data', 'data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.skills[0].technical_skills.splice(index, 1)
  const result = JSON.stringify(parseReadData, null, 2)
  await fs.writeFile(path.join(__dirname, 'data', 'data.json'), result)
})


server.post('/api/v1/softSkill', async (req, res) => {
  const { soft_skills } = req.body
  const readData = await fs.readFile(path.join(__dirname, 'data', 'data.json'))
  const parseReadData = JSON.parse(readData)
  const split = soft_skills.split(',')
  for (let x = 0; x < split.length; x++) {
    parseReadData.skills[0].soft_skills.unshift(split[x])
  }
  const result = JSON.stringify(parseReadData,null,2)
  await fs.writeFile(path.join(__dirname,'data','data.json'),result)
  res.send("Soft skill added successfully")
})


server.delete('/api/v1/softSkill',async(req,res) =>{
  const { index } = req.body
  const readData = await fs.readFile(path.join(__dirname, 'data', 'data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.skills[0].soft_skills.splice(index, 1)
  const result = JSON.stringify(parseReadData, null, 2)
  await fs.writeFile(path.join(__dirname, 'data', 'data.json'), result)
})


server.post('/api/v1/tools',async(req,res) => {
  const readData = await fs.readFile(path.join(__dirname,'data','data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.skills[0].tools.unshift(req.body)
  const result = JSON.stringify(parseReadData,null,2)
  await fs.writeFile(path.join(__dirname,'data','data.json'),result)
  res.send("Tools added successfully")
})


server.delete('/api/v1/tools',async(req,res) => {
  const {index} = req.body
  const readData = await fs.readFile(path.join(__dirname,'data','data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.skills[0].tools.splice(index,1)
  const result = JSON.stringify(parseReadData,null,2)
  await fs.writeFile(path.join(__dirname,'data','data.json'),result)

})


const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`)
})
