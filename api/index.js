const express = require('express')
const url = require('./config')
const user = require('./DatabaseConfig/module')
const jwt = require('jsonwebtoken')
var cors = require('cors')
const path = require('path')
const { default: mongoose } = require('mongoose')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const place = require('./DatabaseConfig/places_user')
const download = require('image-downloader')
const fs = require('fs')
const booking = require('./DatabaseConfig/booking')
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use("/uploads",express.static(path.join(__dirname , 'uploads')))
//get the data
app.get('/test',(req,res)=>{
    res.json('works')
})
var salt = bcrypt.genSaltSync(10);
const jwtsecret = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMTk1NTc0MiwiaWF0IjoxNzAxOTU1NzQyfQ.83yz9NKn5lays0d133Lu9Q6OS5gY1MqCncWDHYBdMc4"
//post the data
app.post('/register',async (req, res)=>{
    try {
        if (!req.body.name || !req.body.email || !req.body.password){
            return res.status(400).json('pls fill all the information')
        }else {
            const {name ,email , password} = req.body
            const UserInfo = await user.create({name ,email ,password : bcrypt.hashSync(password, salt)})
            console.log(UserInfo)
            return res.status(200).send(UserInfo)
        }
    }catch(err){
        res.status(404).json(err.message)
    }
})
//Login 
app.post('/login', async (req , res)=>{
    try {
        const {email , password} = req.body
        if ( !email || !password) {
            res.status(404).json('information empty ')
        }else {
            const findUser =  await user.findOne({email})
            if (findUser) {
                const passComp = bcrypt.compareSync(password,findUser.password )
                if (passComp) {
                    jwt.sign({email : findUser.email  , userId  : findUser._id, name:findUser.name}, jwtsecret , {} , (err , token)=>{
                        if (err) {throw err} 
                        else {
                            res.cookie('token', token, {sameSite: 'None', secure: true}).json(findUser)
                        }
                    })
                }else {
                    res.status(200).json('password wrong')
                }
            }else {
                    res.status(200).json('not registered' )
                }
            }
        }catch(err){
        res.status(400).json(err.message)
        console.log("err")
    }
})
app.get('/profile' , (req , res)=>{
    const {token}=req.cookies
    if (token){
        jwt.verify(token , jwtsecret , {}, (err,user)=>{
            if (err) throw err
            res.json(user)
        })
    }else {
        res.json(null)
    }
})
//Logout 
app.post('/logout',(req , res)=>{
    res.cookie('token' , '').json(true)
} )

//post image by link  
app.post('/postImageByLink' , async (req , res)=>{
    const {link}=req.body 
    console.log(link)
    const new_name =Date.now() + '.jpg'
    await download.image({
        url : link  ,
        dest :path.join(__dirname , 'uploads' , new_name)
    })
    const filename = path.join(__dirname , 'uploads' , new_name)
    res.json("uploads/"+new_name)
})
//...................upload files .....................//
const photsMidl = multer({dest : "uploads/"})
app.post('/upload',photsMidl.array('photos', 100),(req , res,next)=>{
    try {
        const uploadFiles = []
        for(let i =0 ; i < req.files?.length ; i++) {
            const {path, originalname} = req.files[i]
            const parts =originalname.split('.');
            const  ext = parts[parts.length -1]
            const newpath = path +  '.' + ext
            fs.renameSync(path, newpath)
            uploadFiles.push(newpath)
        }
        console.log('results')
        console.log(uploadFiles)
        res.json(uploadFiles)
    }
    catch (err) {
        console.log(err.message)
        console.log("err")
    }
})
//....................post new place ................................
app.post('/place' , async (req , res) =>{
    const {owner,title ,address,perks ,description ,checkin ,checkout ,maxguests, photos , bg,price} = req.body
    const data = await place.create({
        owner , title , address , perks , description , checkin , checkout , maxguests , photos , bg, price , liked : false
    })
    res.json(data)
})    
//............................update data .........................
app.put('/place' , async (req ,res )=>{
    const {token} = req.cookies
    const {id} = req.body 
    const {owner,title ,address,perks ,description ,checkin ,checkout ,maxguests, photos  , bg, price} = req.body
    const placedoc = await place.findById(id) 
    jwt.verify(token , jwtsecret , {} , async (err , userData) => {
        if (placedoc.owner.toString() == userData.userId) {
            placedoc.set({title ,address,perks ,description ,checkin ,checkout ,maxguests, photos ,bg,price})
            placedoc.save()
            res.json('ok done updated')
        }
    })
})   
//..........................get all places .....................
app.get('/showplaces', async (req ,res)=>{
    const {token} = req.cookies
    const verify = jwt.verify(token , jwtsecret , {},async (err, user)=>{
        if(err){throw err}
        const {userId } = user
        console.log('user id : ' + userId)
        const place_by_id = await place.find({owner : userId})
        console.log(place_by_id)
        res.json(place_by_id)
    })
})
//........................explace..............................
app.get('/explace/:id', async (req , res)=>{
    const {id} = req.params
    console.log('id:')
    console.log(id)
    const data = await place.findById(id)
    res.json(data)
})
//..................... get allPlaces.........................
app.get('/allPlaces', async (req,res)=>{
    const allPlaces =await place.find()
    res.json(allPlaces)
}) 
//.....................addLike ................................
app.put('/starAdd', async (req, res) => {
    const { liked, id } = req.body;
  
    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
  
    try {
      const target_prod = await place.findById(id);
  
      if (!target_prod) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      target_prod.set({ liked: liked });
      await target_prod.save();
  
      res.json('ok update liked');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
//........................getOnePlace..........................
app.get('/OnePlace/:id' , async (req , res)=>{
    const {id} = req.params
    console.log(id)
    try {
        const target_place = await place.findById(id)
        console.log(target_place)
        res.json(target_place)
    }catch(err) {
        console.log(err)
    }
})
//.......................ApplyForPlace...........................
app.post('/applyForPlace' , async (req , res)=>{
    const {token} = req.cookies
    if (token) {
        const { name , phone , checkin , checkout ,  num , price , photo , title} = req.body
        try {
            const verify = jwt.verify(token , jwtsecret , {} , async (err, user)=>{
                if (err) throw err
                const {userId}= user
                const data = await booking.create({name , phone , checkin , checkout, title ,  num , price ,photo ,  owner: userId}) 
                res.json(data)
            })
        }catch(err){
            console.log(err)
        }
    }
})
//..............................Booking.........................
app.get('/GetBookingPlace',(req , res )=>{
    const {token} = req.cookies
    const verify = jwt.verify(token , jwtsecret , {} , async (err ,user)=>{
        if(err) throw err 
        const data = await booking.find({owner : user.userId})
        res.json(data)
    })

})
//......................connect to moongodb......................
mongoose.connect(url).then((result)=>{
    console.log("connected susessfuly")
}).catch((err)=>{
    console.log("error")
    console.log(err.message)
})
app.listen(5000)



