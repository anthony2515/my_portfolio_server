const express = require('express')
const fs = require('node:fs/promises')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const server = express()
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors())
server.use('/images', express.static(path.join(__dirname,'public','project_images')));

server.get('/api/v1/photo', async (req, res) => {
  try{
    const response = await fs.readFile(path.join(__dirname,'public','display_photo.jpg'))

    res.setHeader('Content-Type', 'image/*')
    
    res.send(response)
  }catch(e){
    console.log("error fetching image",e)
  }
  
})
server.get('/api/v1/about_me',async(req,res) => {
  try{
    
    const response = await fs.readFile(path.join(__dirname,'data','data.json'))

    res.setHeader('Content-Type','application/json')
   
    res.send(JSON.parse(response))
  }catch(e){
    console.log("error fetching JSON data",e)
  }
})
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'public')) // Sets the destination for uploaded files

  },
  filename: function (req, file, cb) {
    // Sets the file name. This example uses the original file name, but it can be customized
    cb(null, 'display_photo.jpg')
  }
});
const upload = multer({ storage: storage });
server.post('/api/v1/file',upload.single('litrato'), async(req,res) => {
  console.log(req.file)
})
const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`)
})
