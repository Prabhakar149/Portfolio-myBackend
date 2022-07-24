const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());

//database
//mongoose.connect("mongodb://localhost:27017/PortfolioAppDB", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://ps-admin:Prabhakar10798@cluster0.qiqfd.mongodb.net/PortfolioAppDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: String,
    contact: String,
    AboutMe: String,
    skills: [
                 {
                   skillName: String, 
                   skillRating: Number
                 }
            ],
    myProjects:[
                {
                    projectTitle: String,
                    description: String,
                    projectSkills: [String]
                }
            ]
});

const User = new mongoose.model("User", userSchema);


app.get("/", function (req, res) {
    res.send("This is a portfolio project");
});


//__________________________________Register start__________________________________
app.post("/register", function(req,res){
    const {userName,userEmail,userPassword} =req.body;

    User.findOne({ emailId: userEmail }, function (err, user) {
        if (user) {
            res.send({ message: "User already registered" });
        } else {
            const myUser = new User({
                name: userName,
                emailId: userEmail,
                password: userPassword,
                address:"",
                contact:"",
                AboutMe:""
            });
            myUser.save((err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({ message: "Successfully registered, Please now login" });
                }
            })
        }
    });
})
//_______________________________________Register end_______________________________________________

//_________________________________Login start________________________________________
app.post("/",function(req,res){
    const { userEmail, userPassword } = req.body;
    User.findOne({ emailId: userEmail }, function (err, user) {
        if (user) {
            if (userPassword === user.password) {
                res.send({ message: "Login successfull", myUser: user });
            } else {
                res.send({ message: "Password didn't match" });
            }
        } else {
            res.send({ message: "User is not registered" });
        }
    });
})
//__________________________________Login end_________________________________________

//__________________________________Profile Update start______________________________

app.post("/profile", function(req,res){
    const {userId, userAddress, userContact, userAbout} = req.body;

    if(userAddress){
        User.updateOne(
            {_id: userId},
            { address: userAddress},
            function(err){
                if(err){
                    res.send(err);
                }
            }
        )
    }
   if(userContact){
    User.updateOne(
        {_id: userId},
        { contact: userContact},
        function(err){
            if(err){
                res.send(err);
            }
        }
    )
   }
   
   if(userAbout){
    User.updateOne(
        {_id: userId},
        { AboutMe: userAbout},
        function(err){
            if(err){
                res.send(err);
            }
        }
    )
   }
   
    User.findOne({ _id: userId }, function (err, user) {
        if (user) {   
            res.send({message:"Successfully submitted your details" ,updatedUser:user});
        } else {
            res.send(err);
        }
    });
    
})
//___________________________________Profile update end________________________________

//_____________________________Skill update start_________________________________________

app.post("/addskill",function(req,res){

    const [myUserId, newSkill] =req.body;

    User.updateOne(
        { _id: myUserId },
        { $push: { skills: newSkill } },
        function (err) {
            if (err) {
                res.send(err);
            }
        }
    );
    User.findOne({ _id: myUserId }, function (err, user) {
        if (user) {   
            res.send({message:"New skill added" ,updatedUser:user});
        } else {
            res.send(err);
        }
    });
    
})

//_____________________________Skill update end___________________________________________
//_____________________________Project Update start________________________________________
app.post("/addnewproject",function(req,res){

    const [myUserId, newProject] =req.body;

    User.updateOne(
        { _id: myUserId },
        { $push: { myProjects: newProject } },
        function (err) {
            if (err) {
                res.send(err);
            }
        }
    );
    User.findOne({ _id: myUserId }, function (err, user) {
        if (user) {   
            res.send({message:"Your new project added" ,updatedUser:user});
        } else {
            res.send(err);
        }
    });
    
})
//_____________________________Project Update end______________________________________


//_____________________________Find user__________________________________________________
app.post("/findUpdatedUser", function(req,res){
    const userId=req.body._id;
    User.findOne({ _id: userId }, function (err, user) {
        if (user) {   
            res.send({updatedUser:user});
        } else {
            res.send(err);
        }
    });
})
//__________________________________________________________________________________________


// setting port
let port = process.env.PORT;
if (port == null || port == "") {
    port = 9002;
}
app.listen(port, function () {
    console.log("Server started succeessfully..");
})