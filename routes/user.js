const router = require('express').Router();
const CryptoJs = require('crypto-js');
const User = require('../models/User');
const { veriftTokenAndAuthorization, veriftTokenAndAdmin } = require("./verifyToken");


//UPDATE
router.put("/:id", veriftTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJs.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedUser);
    }
    catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }
})


//DELETE
router.delete("/:id", veriftTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User Has been Deleted...");
    }
    catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }
})




//GET USER
router.get("/find/:id", veriftTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;

        res.status(200).json(others)
    }
    catch (err) {
        console.log(err);
        // res.status(500).json(err);
    }
})



//GET ALL USERS
router.get("/", veriftTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();
        res.status(200).json(users);
    }
    catch (err) {
        console.log(err);
        // res.status(500).json(err);
    }
});


//GET USER STATS
router.get("/stats", veriftTokenAndAdmin, async (req, res) => {

    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {

        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        // res.status(500).json(err);
    }
})



module.exports = router;
