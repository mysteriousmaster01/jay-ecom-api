const router = require('express').Router();
const Cart = require('../models/Cart');
const { veriftTokenAndAuthorization, veriftTokenAndAdmin, veriftToken } = require("./verifyToken");




//CREATE
router.post("/", veriftToken, async (req, res) => {
    const newCart = new Cart(req.body);


    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }
    catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }
})


//UPDATE
router.put("/:id", veriftTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedCart);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})


//DELETE
router.delete("/:id", veriftTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart Has been Deleted...");
    }
    catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }
})




//GET USER CART
router.get("/find/:userId", veriftTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    }
    catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }
})



//GET ALL

router.get("/", veriftTokenAndAdmin, async (req, res) => {

    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    }
    catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }
})


module.exports = router;
