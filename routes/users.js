const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { UserModel, validateUser, validateLogin, createToken } = require("../models/userModel");



const router = express.Router();

//listin to users page as discribde for router in configRoutes file
router.get("/", async (req, res) => {
    res.json({ msg: "users endPoint" });
})

// basic info about the users by sending the correct token
router.get("/userInfo", auth, async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
        res.json(user);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})

//bring just one by his id that will getting the info about him(from client side) and can edit it easely 
//http://localhost:3002/users/single/63da61eaafc460ddf48f5c5c

router.get("/single/:id", async (req, res) => {
    try {
        let data = await UserModel.findOne({ _id: req.params.id }, { password: 0 });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})

//peganetion to show the pages num and move for next page
router.get("/count", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 5;
    try {
        let count = await UserModel.countDocuments({});
        res.json({ count, pages: Math.ceil(count / perPage) });
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})


// route for admin only that he can get all users 
router.get("/usersList", authAdmin, async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 5;
    let page = req.query.page - 1 || 0;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? 1 : -1;

    try {
        let data = await UserModel
            .find({})
            .limit(perPage)
            .skip(page * perPage)
            .sort({ [sort]: reverse })
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})



// will check the token in server side not in DB (and save power) aspecialy the role and token
router.get("/checkToken", auth, async (req, res) => {
    try {
        res.json(req.tokenData);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})


//sign up user
router.post("/", async (req, res) => {
    let validBody = validateUser(req.body);
    //if error in body will send the error from joi
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UserModel(req.body);
        //crypted the password and strong at 10 level
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        //crypted in client side that wont see the way are crypted
        user.password = "******";
        res.json(user);
    }
    catch (err) {
        // check if email already in system
        if (err.code == 11000) {
            return res.status(400).json({ msg: "email already exsist!", code: 11000 })
        }
        console.log(err);
        res.status(502).json({ err })
    }
})

//login
router.post("/login", async (req, res) => {
    let validBody = validateLogin(req.body);
    //check the joi when login
    // const msg = validBody.error.details[0].message;
    if (validBody.error) {
        // return res.status(401).send(msg.replace(/"/g, ''));
        return res.status(400).json({ msg: validBody.error.details });
    }
    try {
        //check the email
        let user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            // return res.status(401).send("wrong email");
            return res.status(401).json({ msg: "wrong email" });
        }
        //check password
        let validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ msg: "password not match" });
        }
        //if all good will send login token
        let token = createToken(user._id, user.role);
        // distrucct the password and buid another object without password  
        const { password, ...oterUserKeys } = user["_doc"];
        // will get also the role that i can check it when loged in
        res.json({ token, role: user.role, user: oterUserKeys });
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }

})

// ?user_id= &role=
// משנה תפקיד של משתמש
//change the role of user by admin only //
router.patch("/:role/:id", authAdmin, async (req, res) => {
    try {

        //will change the role of the user just by admin only
        let user_id = req.params.id;
        let role = req.params.role;
        // console.log(role);

        // // לא מאפשר למשתמש עצמו לשנות את התפקיד שלו
        // // או לשנות את הסופר אדמין
        // if (user_id == req.tokenData.id || user_id == "63b13b2750267011bebf32be") {
        //     return res.status(401).json({ msg: "You try to change yourself or the superadmin" })
        // }

        let data = await UserModel.updateOne({ _id: user_id }, { role: role })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

// delete user by admin only
router.delete("/:id", authAdmin, async (req, res) => {
    try {
        let id = req.params.id;
        let data = await UserModel.deleteOne({ _id: id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;