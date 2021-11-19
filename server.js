const express=require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
var User=require('./models/register')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const jwtsecretkey="kjsgdaflajskdflkjasdlkjfasdkjf!@#$%^&*()iylfjkkj#$%^GDGFGFG&^*GF(SD(G)SDG&)SD&G)SH&)DG&)D&G)&D"

mongoose.connect('mongodb://localhost:27017/userdb',
{useNewUrlParser:true,useUnifiedTopology:true},
function(err)
{
    if(err){
        console.log("Not Connected to db ")
    }
    else
    {
        console.log("Connected to Db ")
    }
}
)

app.use(express.static(path.join(__dirname,"/views")))
app.use(express.urlencoded({ extended:false }))
app.engine('html', require('ejs').renderFile);


app.post('/register',async (req,res)=>
{
    console.log("Register User API request")
    if(!(req.body.Name && req.body.Password))
    {
        res.json({ 
            ReturnMessage:"Enter Details"
        })
    }
    var user=new User(req.body)
    user.Password=await bcrypt.hash(user.Password,10)
    user.save((err,data)=>{
        if(err){
            res.json({
                ReturnMessage:"Not Registered ",
                Status:404
            })
            res.redirect("/login")
        }
        else
        {
            res.json({
                RetunrMessage:"Registered",
                Status:200,
                data:data
            })
        }

    })
    
})

app.post('/login', async (req,res)=>{
    console.log("Login User Api Request")
     const user= await User.findOne({Name:req.body.Name})
            if(user)
            {
                var validpassword = await bcrypt.compare(req.body.Password,user.Password)
                if(validpassword)
                {
                    const token=jwt.sign({id:user._id,Name:user.Name},jwtsecretkey,{ expiresIn: '20m' })
                    res.json({
                        data:user,
                        ReturnMessage:"Login Successfully",
                        data:user,
                        token:token
                    })
                    localStorage.setItem("Token",token)
                }
                else{
                    res.json({
                        ReturnMessage:"Login Failed"
                    })
                }
            }
            else
            {
               res.json({ 
                   ReturnMessage:"User not Found"
               })
            }
       
    
})


app.get('/search',async(req, res)=>
{
    try{
        if(!(req.body.Name && req.body.Contact))
        {
            res.json({ 
                ReturnMessage:"No Data Entered"
            })
        }
        const user = await User.find({Name:req.body.Name}||{Contact:req.body.Contact})
        if(user) 
        {
            res.json({
                ReturnMessage:"User Found",
                data:user,
            })
        }
         else
                {
                    res.json({
                        ReturnMessage:"User not Found",
                        
                    })
                   
                }
    }
    catch{
        re.json({
            ReturnMessage:"No"
        })
    }
   
       
})

// app.get('/login',(req,res)=>{
//     res.render('login.html',)
// })
// app.get('/register',(req,res)=>{
//     res.render('register.html')
// })


app.listen(port=9999,(req,res)=>{
    console.log("Server Started",port)
})
