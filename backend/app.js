const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');

app.use(cors());
require("./src/db/conn")
app.use(express.json());

const {Login} = require("./src/models/user");

app.post("/login",async(req,res)=>{
    try{
        const user = new Login(req.body);
        const createUser =await user.save();
        res.status(201).send(user); 
    }catch(e){
        res.status(400).send(e);
    }
})

app.get("/login",async(req,res)=>{
    try {
       const login = await Login.find();
       res.status(201).send(login)
       console.log(login);
       
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/login/:id",async(req,res)=>{
    try{
        const _id = req.params.id;
        const logindata =await Login.findById({_id});
        // console.log(logindata);

        if(!logindata){
            return res.status(404).send();
        }
        else{
            res.send(logindata)
        }
    }catch(e){
        res.status(500).send(e);
    }
})

app.patch("/login/:id",async(req,res)=>{
    try {
        const _id = req.params.id;
        const loginupdate = await Login.findByIdAndUpdate(_id,req.body,{
            new:true
        });
        res.send(loginupdate);
        // console.log(loginupdate); 
    } catch (error) {
        res.status(400).send(error);
    }
})

app.delete("/login/:id",async(req,res)=>{
    try{
         const deletelogin =await Login.findByIdAndDelete(req.params.id);
         if(!req.params.id){
            return res.status(400).send();
         }
         res.send(deletelogin);
    }catch(err){
        res.status(500).send(err);
    }
})

app.listen(port,()=>{
    console.log(`server Started at port: ${port}`);    
})

