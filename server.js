const express = require("express");
const session = require("express-session")
const mongoose = require("mongoose")
const MongoDBSession = require('connect-mongodb-session')(session)
const bcrypt = require("bcryptjs")
require('dotenv').config();

const app = express();

const UserModel = require('./models/User')

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 5000;

const mongoURI = process.env.MONGO_URI;
const sessionSecret = process.env.SESSION_SECRET;

mongoose.connect( mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log("MongoDB Connected")
}) 

const store = new MongoDBSession({
    uri : mongoURI,
    collecion: "mySessions"
})

app.use(session({
    secret : sessionSecret,
    resave : false,         // for every request to the server whether we want to create a new session
    saveUninitialized : false,   // if we have to save the session or not
    store: store
})) // this middleware will create the session field in the request body

app.get("/", (req, res) => {
    // req.session.isAuth = true;
    // console.log(req.session)
    // console.log(req.session.id)
    res.render("landing")
})

app.get("/register" , (req, res) => {
    res.render("register", { error: null })
})

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    let user = await UserModel.findOne({email})

    if(user){
        return res.render('register', { error: "Email already exists" })
    }

    const hashpassword = await bcrypt.hash(password, 12)

    user = new UserModel({
        name,
        email,
        password: hashpassword
    })

    await user.save();

    res.redirect("/login")
})

app.get("/login" , (req, res) => {
    res.render("login", { error: null })
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // find user
    const user = await UserModel.findOne({ email });

    // validate credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('login', { error: "Email or password is incorrect." });
    }

    // create session
    req.session.isAuth = true;
    req.session.userName = user.name; // optional, to display on dashboard

    // redirect to dashboard
    res.redirect('/dashboard');
});


app.get("/dashboard", (req, res) => {
    if (!req.session.isAuth) {
        return res.render("login", {error : "Please login first"});
    }
    res.render("dashboard", { name: req.session.userName });
});

app.post("/logout", (req,res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    })
})

app.listen(PORT, console.log("Server Running on http://localhost:5000"));