const express = require('express')
const fs = require('node:fs/promises')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const server = express()
const FormData = require('form-data')

require('dotenv').config()
const corsOptions = {
  origin: (origin, callback) => {
    console.log(origin); // This will log the origin of the request 
    if (origin === 'https://my-portfolio-one-xi-33.vercel.app') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}
server.use(cors(corsOptions));
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use('/images',express.static(path.join(__dirname, 'public', 'project_images')))


let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})()
const DISPLAY_PHOTO_ROUTE = process.env.DISPLAY_PHOTO_ROUTE
const PROJECT_IMAGE_ROUTE = process.env.PROJECT_IMAGE_ROUTE
const ADD_PROJECT_ROUTE = process.env.ADD_PROJECT_ROUTE
const DELETE_PROJECT_ROUTE = process.env.DELETE_PROJECT_ROUTE
const TECH_SKILL_ROUTE = process.env.TECH_SKILL_ROUTE
const SOFT_SKILL_ROUTE = process.env.SOFT_SKILL_ROUTE
const TOOLS_ROUTE = process.env.TOOLS_ROUTE

console.log('Routes configuration:', {
  DISPLAY_PHOTO_ROUTE,
  PROJECT_IMAGE_ROUTE,
  ADD_PROJECT_ROUTE,
  DELETE_PROJECT_ROUTE,
  TECH_SKILL_ROUTE,
  SOFT_SKILL_ROUTE,
  TOOLS_ROUTE
});

const upload = multer({ storage: multer.memoryStorage() });
server.post('/api/proxy',upload.single("file"), async (req, res) => {
  const apiUrl = 
  [
    'http://localhost:3000/api/v1/data',
    `http://localhost:3000${DISPLAY_PHOTO_ROUTE}`,
    `http://localhost:3000${PROJECT_IMAGE_ROUTE}`,
    `http://localhost:3000${ADD_PROJECT_ROUTE}`,
    `http://localhost:3000${TECH_SKILL_ROUTE}`,
    `http://localhost:3000${SOFT_SKILL_ROUTE}`,
    `http://localhost:3000${TOOLS_ROUTE}`,

  ]; // The final API URL 
  switch (req.body.api_route) {

    case "change display photo": {
      const { file } = req;
      const form = new FormData();
      
      if (file) {
        form.append('file', file.buffer, file.originalname);
      }
  
      form.append('password', req.body.password);
  
      try {
        const apiResponse = await fetch(apiUrl[1], {
          method: 'POST',
          body: form,
          headers: {
            "X-API-KEY": req.headers['x-api-key']
          },
        });
        const data = await apiResponse.json();
        res.json(data);
      } catch (error) {
        console.error('Failed to handle request:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
      }
      break;
    }
    case "change project image": {
      const { file } = req;

      const form = new FormData();
    
      
      if (file) {
        form.append('file', file.buffer, file.originalname);
      }
      form.append('imageToReplace', req.body.imageToReplace)
      form.append('password', req.body.password);
      form.append('index',req.body.index)
      try {
        const apiResponse = await fetch(apiUrl[2], {
          method: 'POST',
          body: form,
          headers: {
            "X-API-KEY": req.headers['x-api-key']
          },
        });
        const data = await apiResponse.json();
        res.json(data);
      } catch (error) {
        console.error('Failed to handle request:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
      }
      break;
    }
    case "add project":{
      const {file} = req
      const {project_name,description,tech_used,github_url} = req.body
      const form = new FormData();
     
      
      if (file) {
        form.append('image', file.buffer, file.originalname);
      }
      form.append('project_name',project_name)
      form.append('description',description)
      form.append('tech_used',tech_used)
      form.append('github_url',github_url)
      try {
        const apiResponse = await fetch(apiUrl[3], {
          method: 'POST',
          body: form,
          headers: {
            "X-API-KEY": req.headers['x-api-key']
          },
        });
        const data = await apiResponse.json();
        res.json(data);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
      }
      break;
    }
    case "add tech skill":{
      const {proficiency,skill,description} = req.body
      const obj = {
        proficiency,
        skill,
        description
      }
      try{
       const response = await fetch(apiUrl[4],
        {
          method:"POST",
          body: JSON.stringify(obj),
          headers:{
            "X-API-KEY":req.headers['x-api-key'],
            "Content-Type":"application/json"
          }
        })
        const data = await response.json()
        res.json(data)
      }catch(e){
        console.error("Error",e)
        res.status(500).json({error:"Internal server error"})
      }
      break;
    }
    case "add soft skill": {
      try{
        const response = await fetch(apiUrl[5],
        {
          method:"post",
          headers:{
            "X-API-KEY":req.headers["x-api-key"],
            "Content-Type":"application/json"
          },
          body:JSON.stringify(req.body)
        })
        const data = await response.json()
        res.json(data)
      }catch(e){
        res.status(500).json({error:"Internal Server Error"})
      }
      break;
    }
    case "add tool":{
      try{
        const response = await fetch(apiUrl[6],
          {
            method:"post",
            headers:{
              "X-API-KEY":req.headers["x-api-key"],
              "Content-Type":"application/json"
            },
            body:JSON.stringify(req.body)
          })
          const data = await response.json()
          res.json(data)
      }catch(e){
        res.status(500).json({error:"Internal Server Error"})
      }
      break;
    }
    // Add more cases as needed for other api_route values
    default:
      // Handle unknown api_route values
      res.status(400).json({ error: 'Invalid api_route provided.' });
  }

});
server.delete('/api/proxy',async(req,res) => {
  const apiUrl =[
    `http://localhost:3000${DELETE_PROJECT_ROUTE}`,
    `http://localhost:3000${TECH_SKILL_ROUTE}`,
    `http://localhost:3000${SOFT_SKILL_ROUTE}`,
    `http://localhost:3000${TOOLS_ROUTE}`,
  ]
 
  switch(req.body.api_route){
  case "delete project" : {
    try{
    const response = await fetch(apiUrl[0],
    {
      method:'delete',
      headers:{
        "X-API-KEY": req.headers['x-api-key'],
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    })
    const data = await response.json()
    res.json(data)
    }catch(error){
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
    break;
  }
  case "delete tech skill":{
    try{
      const response = await fetch(apiUrl[1],
      {
        method:"delete",
        headers:{
          "Content-Type":"application/json",
          "X-API-KEY":req.headers["x-api-key"]
        },
        body: JSON.stringify(req.body)
      })
      const data = await response.json()
      res.json(data)
    }catch(e){
      console.error("Error",e)
      res.status(500).json({error: "Internal Server Error."})
    }
    break;
  }
  case "delete soft skill":{
    try{
      const response = await fetch(apiUrl[2],
      {
        method:"delete",
        headers:{
          "X-API-KEY":req.headers["x-api-key"],
          "Content-Type":"application/json"
        },
        body:JSON.stringify(req.body)
      })
      const data = await response.json()
      res.json(data)
    }catch(e){
      res.status(500).json({error:"Internal Server Error"})
    }
    break;
  }
  case "delete tool":{
    try{
      const response = await fetch(apiUrl[3],
      {
        method:"delete",
        headers:{
          "Content-Type":"application/json",
          "X-API-KEY":req.headers["x-api-key"]
        },
        body: JSON.stringify(req.body)
      })
      const data = await response.json()
      res.json(data)

    }catch(e){
      res.status(500).json({error:"Internal Server Error"})
    }
    break;
  }
  default:
      // Handle unknown api_route values
      res.status(400).json({ error: 'CANNOT DELETE/' });
}
})
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

const checkPasswordMiddleWare = (req, res, next) => {
  const password = req.headers['x-api-key']; 
  if (password === process.env.X_API_KEY) {
    next();
  } else {
    res.status(403).json({ error: 'Incorrect password, file not uploaded.' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public')) 
  },
  filename: function (req, file, cb) {
 
    cb(null, 'display_photo.jpg')
  },
})
const uploadDisplayPhoto = multer({ storage: storage })
server.post(DISPLAY_PHOTO_ROUTE,
            checkPasswordMiddleWare,
            uploadDisplayPhoto.single('file'),async (req, res) => {
              res.json({message:"display photo has been saved"})
            }
)

const ProjectImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'project_images')) 
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  },
})


const uploadProjectImage = multer({ storage: ProjectImageStorage })


server.post(PROJECT_IMAGE_ROUTE,checkPasswordMiddleWare,uploadProjectImage.single('file'),async (req, res) => {
 try {
    const newProjectImage = req.file.originalname
    
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
    
    await fs.writeFile(path.join(__dirname, 'data', 'data.json'), updateJson)
    //work on data.json projects[index].image get that
    res.json({ message: "Project image has been replaced"})
      // All your logic here, including file operations and JSON manipulation.
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error.' });
  }
  }
)


server.post('/api/v1/data', async (req, res) => {
  
  if(req.headers['x-api-key'] == process.env.X_API_KEY){
    delete req.body.password
    const result = JSON.stringify(req.body, null, 2)
    
    await fs.writeFile(path.join(__dirname, 'data', 'data.json'), result)
  
    res.json({ message: "Data added successfully" })
  }else{
    res.status(401).json({error:"missing api key/incorrect key"})
  }
  
  
})


server.post(
  ADD_PROJECT_ROUTE,checkPasswordMiddleWare,
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
    res.json({ message: 'project added successfully' })
  }
)


server.delete(DELETE_PROJECT_ROUTE,checkPasswordMiddleWare, async (req, res) => {
  const { index, image } = req.body
 
  const readData = await fs.readFile(path.join(__dirname, 'data', 'data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.projects.splice(index, 1)
  const result = JSON.stringify(parseReadData, null, 2)
  await fs.writeFile(path.join(__dirname, 'data', 'data.json'), result)
  await fs.unlink(path.join(__dirname, 'public', 'project_images', image))
  res.json({message: 'Project Deleted'})
})

server.post(TECH_SKILL_ROUTE,checkPasswordMiddleWare, async (req, res) => {
  const readData = await fs.readFile(path.join(__dirname, 'data', 'data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.skills[0].technical_skills.unshift(req.body)
  const result = JSON.stringify(parseReadData, null, 2)
  await fs.writeFile(path.join(__dirname, 'data', 'data.json'), result)
  res.json({message: 'Tech Skill has been added'})
})


server.delete(TECH_SKILL_ROUTE,checkPasswordMiddleWare, async (req, res) => {
  const { index } = req.body

  const readData = await fs.readFile(path.join(__dirname, 'data', 'data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.skills[0].technical_skills.splice(index, 1)
  const result = JSON.stringify(parseReadData, null, 2)
  await fs.writeFile(path.join(__dirname, 'data', 'data.json'), result)
  res.json({message: 'Tech Skill has been Deleted'})
})


server.post(SOFT_SKILL_ROUTE,checkPasswordMiddleWare,async (req, res) => {
  const { soft_skills } = req.body
  const readData = await fs.readFile(path.join(__dirname, 'data', 'data.json'))
  const parseReadData = JSON.parse(readData)
  const split = soft_skills.split(',')
  for (let x = 0; x < split.length; x++) {
    parseReadData.skills[0].soft_skills.unshift(split[x])
  }
  const result = JSON.stringify(parseReadData,null,2)
  await fs.writeFile(path.join(__dirname,'data','data.json'),result)
  res.json({message:"Soft skill added successfully"})
})


server.delete(SOFT_SKILL_ROUTE,checkPasswordMiddleWare,async(req,res) =>{
  const { index } = req.body
  const readData = await fs.readFile(path.join(__dirname, 'data', 'data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.skills[0].soft_skills.splice(index, 1)
  const result = JSON.stringify(parseReadData, null, 2)
  await fs.writeFile(path.join(__dirname, 'data', 'data.json'), result)
  res.json({message: "Soft Skill deleted"})
})


server.post(TOOLS_ROUTE,checkPasswordMiddleWare,async(req,res) => {
  const readData = await fs.readFile(path.join(__dirname,'data','data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.skills[0].tools.unshift(req.body)
  const result = JSON.stringify(parseReadData,null,2)
  await fs.writeFile(path.join(__dirname,'data','data.json'),result)
  res.json({message:"Tool Added Successfully"})
})


server.delete(TOOLS_ROUTE,checkPasswordMiddleWare,async(req,res) => {
  const {index} = req.body
  const readData = await fs.readFile(path.join(__dirname,'data','data.json'))
  const parseReadData = JSON.parse(readData)
  parseReadData.skills[0].tools.splice(index,1)
  const result = JSON.stringify(parseReadData,null,2)
  await fs.writeFile(path.join(__dirname,'data','data.json'),result)
  res.json({message:"Tool Deleted"})
})


const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`)
})
