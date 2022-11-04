const router = require('express').Router();
const Order = require('../models/Order');
const { veriftTokenAndAuthorization, veriftTokenAndAdmin, veriftToken } = require("./verifyToken");




//CREATE
router.post("/", veriftToken, async (req, res) => {
    const newOrder = new Order(req.body);


    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }
    catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }
})


//UPDATE
router.put("/:id", veriftTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})


//DELETE
router.delete("/:id", veriftTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order Has been Deleted...");
    }
    catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }
})




//GET USER ORDERS
router.get("/find/:userId", veriftTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    }
    catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }
})



//GET ALL

router.get("/", veriftTokenAndAdmin, async (req, res) => {

    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    }
    catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }
})

//GET MONTHLY INCOME
router.get("/income", veriftTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    }
    catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }

})



module.exports = router;
