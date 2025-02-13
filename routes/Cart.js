const express = require('express');
const router = express.Router();
const User = require('../schema/auth/userSchema');
const { verifyToken } = require('../util/jwtToken');
const Product = require('../schema/Foods/FoodSchema');
const logger = require('../middleware/logging/logger');


router.get('/get', async (req, res) => {
    const { token, user_id } = req.body;

    
    if (!user_id) {
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

        
        const user = await User.findOne({ id: user_id });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                status: 404,
            });
        }

        
        if (!user.items || user.items.length === 0) {
            return res.status(200).json({
                message: 'No items in user cart',
                products: [],
                status: 200,
            });
        }

        
        const products = await Promise.all(
            user.items.map(async (item) => {
                const product = await Product.findById(item.product_id);
                if (!product) {
                    return null; 
                }
                return {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    productDetails: product,
                };
            })
        );

        
        const filteredProducts = products.filter((product) => product !== null);

       
        return res.status(200).json({
            message: 'Products retrieved successfully',
            products: filteredProducts,
            status: 200,
        });
    } catch (error) {
        logger.error('Error fetching products:', error);
        return res.status(500).json({
            message: 'An error occurred while fetching products',
            error: error.message,
            status: 500,
        });
    }
});

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
        logger.error(error);
        res.status(500).json({
            message: 'Server error',
            status: 500,
        });
    }
});


router.delete('/:userId/product/:productId', async (req, res) => {
    const { userId, productId } = req.params;
    const token = req.query.token;

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
        const user = await User.findOne({ id: userId, 'items.productId': productId });
        if (!user) {
            return res.status(404).json({ message: 'User or item not found' });
        }

        const result = await User.findOneAndUpdate(
            { id: userId },
            { $pull: { items: { productId: productId } } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'User or item not found' });
        }

        res.status(200).json({
            message: 'Item deleted successfully',
            status: 200
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
});
module.exports = router;