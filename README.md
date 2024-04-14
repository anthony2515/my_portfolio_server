# My Portfolio (Server Side)
Hello everyone welcome to the server side of my portfolio website. Here I will explain everything how my portfolio gets all the data and images and how my portfolio manager manages all data whenever I want to add, edit or delete some stuff in my portfolio website 

# Server Deployment
I hosted this server using vercel and made a vercel.json file to configure the source of the routes and set the source of the main server to server/server.js like this
```json
{
  "builds":[{"src":"server/server.js", "use":"@vercel/node"}],
  "routes": [
    { "src": "/(.*)", "dest": "server/server.js" }
  ]
}
```

and I set the source to all endpoints to this "/(.*)"

# File Structure
-All the files that we need to make these server are stored in the server directory

-The other files including node_modules, package.json, README.md and vercel.json are stored on the root

-I use .env to hide all my api routes for security purposes and set those as environmental variables so vercel will able to read those routes

![alt text](image-1.png)


# Project Architecture
![alt text](image-2.png)

Basically the <strong>Portfolio</strong> gets the data straight from the server on the other hand, The <strong>Portfolio Manager</strong> will go to the proxy server to find the actual route and pass the body of the form including the password to the actual server to process the request

# Using Proxy Server

The main reason why I used proxy server or "/api/proxy" is to avoid exposing the actual api endpoints on public and also to avoid hackers trying to manipulate the data using the actual route. I also found that using cors restriction is not enough to hide the server endpoint because its only applicable on browsers but not on Postman or Insomia. But I still apply it just to restrict other origins to use my server from the browser.

I didnt directed those routes with get request to the proxy server as I dont really worry about someone could've copy the images or data of my portfolio website.

<strong>Code sample</strong>
```javascript
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
```

Another thing is I specify the api route on the request body as a key word like  "save inputs", "change display photo", "change project image", etc instead of using the actual api route



# Password check

I used the header "X-API-KEY" as a password to access certain endpoint to the server and made a function to check password as a middleware like this:
```javascript
const checkPasswordMiddleWare = (req, res, next) => {
  const password = req.headers['x-api-key']; 
  if (password === process.env.X_API_KEY) {
    next();
  } else {
    res.status(403).json({ error: 'Incorrect password, file not uploaded.' });
  }
};
```
So if the password matches the X_API_KEY(environmental variable) then proceed to the next middleware otherwise it returns an error

