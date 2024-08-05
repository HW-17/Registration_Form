const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");


const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster1.tlfucku.mongodb.net/RegistrationformDB`,{
    //userNewUrlParser : true,
    //useUnifiedTopology : true,
    });
//registration schema
const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});  
//model of registration schema
const Registartion = mongoose.model("Registartion",registrationSchema);

app.use(bodyParser.urlencoded ({ extended : true}));
app.use(bodyParser.json());


app.get("/", (req,res) =>{
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register",async (req,res) => {
    try{
        const {name, email, password} = req.body;

        const existingUser = await Registartion.findOne({email : email});
        if(!existingUser){
            const registrationData = new Registartion({
           name,
            email, 
            password
        });
        await registrationData.save();
        res.redirect("/success");
        } 
        else{
            console.log("User already exist");
            res.redirect("/error");
        }
    }
    catch (error)
    {
    console.log(error);
    res.redirect("error");
    }
})
app.get("/success",(req, res)=>{
    res.sendFile (__dirname + "/pages/success.html");
})
app.get("/error",(req, res)=>{
    res.sendFile (__dirname + "/pages/error.html");
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})
