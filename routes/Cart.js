const express = require('express');
const router = express.Router();
const User = require('../schema/auth/userSchema');
const { verifyToken } = require('../util/jwtToken');
const Product = require('../schema/Foods/FoodSchema');



router.post('/add', async (req, res) => {
    const { token, user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({
            message: 'Required details not provided',
            status: 400,
        });
    }

    if (!token) {
        return res.status(400).json({
            message: 'Token not provided',
            status: 400,
        });
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                message: 'Invalid token',
                status: 401,
            });
        }

        const food = await Product.findOne({ 'get_all_products.Product_ID': product_id });

        // If no main product is found
        if (!food) {
            return res.status(404).json({
                message: 'Product not found',
                status: 404,
            });
        }

        const user = await User.findOne({ id: user_id });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                status: 404,
            });
        }

        const existingItemIndex = user.items.findIndex(item => item.productId.toString() === product_id);

        if (existingItemIndex !== -1) {
            user.items[existingItemIndex].quantity = quantity;
            await user.save();
            return res.status(200).json({
                message: 'Updated quantity in cart successfully',
                userId: decoded.id,
                status: 200,
            });
        } else {
            const commonIDExists = user.items.some(item => item.commonId.toString() === food.ID.toString());

            if (commonIDExists) {
                return res.status(400).json({
                    message: 'Another product with the same main product ID already exists in the cart. Cannot add multiple items from the same product group.',
                    status: 400,
                });
            }

            user.items.push({
                productId: product_id,
                commonId: food.ID,
                quantity: quantity,
            });
            await user.save();
            return res.status(200).json({
                message: 'Added to cart successfully',
                userId: decoded.id,
                status: 200,
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            status: 500,
        });
    }
});

module.exports = router;