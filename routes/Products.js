const express = require('express');
const router = express.Router();
const apiKeyMiddleware = require(`${__dirname}/../middleware/apikey`);
const limiter = require(`${__dirname}/../middleware/rateLimiter`);
const removeWhitespace = require(`${__dirname}/../middleware/removeWhitespaces`);
const { verifyToken } = require('../util/jwtToken');
const Food = require('../schema/Foods/FoodSchema');


router.use(apiKeyMiddleware);
router.use(limiter);
router.use(removeWhitespace);


router.get('/get', async (req, res) => {
    const { token } = req.body;

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


        const products = await Food.find().select('ID Product_Name Product_Description Product_Rating get_product_category get_all_products').lean();


        const sanitizedProducts = products.map(product => {
            const { _id, __v, createdAt, updatedAt, ...rest } = product; 
            return {
                ...rest,
                get_product_category: {
                    ...rest.get_product_category,
                    _id: undefined, 
                },
                get_all_products: rest.get_all_products.map(({ _id, ...item }) => item) 
            };
        });

        res.status(200).json({
            FoodItems: sanitizedProducts,
            status: 200,
        });
    } catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).json({
            message: 'Server error',
            status: 500,
        });
    }
});


// router.post('/add', async (req, res) => {
//     const {
//         ID,
//         Product_Name,
//         Product_Description,
//         Product_Rating,
//         Last_Updated,
//         get_product_category,
//         get_all_products
//     } = req.body;


//     if (!ID || !Product_Name || !get_product_category || !get_all_products) {
//         return res.status(400).json({
//             message: 'ID, Product_Name, Product_Category, and Product Variants are required.',
//             status: 400,
//         });
//     }

//     try {
//         const newFoodItem = new Food({
//             ID,
//             Product_Name,
//             Product_Description: Product_Description || null, 
//             Product_Rating: Product_Rating || 0, 
//             Last_Updated: Last_Updated || new Date(), 
//             get_product_category,
//             get_all_products
//         });


//         const savedFoodItem = await newFoodItem.save();
//         res.status(201).json({
//             message: 'Food item added successfully!',
//             FoodItem: savedFoodItem,
//             status: 201,
//         });
//     } catch (error) {
//         console.error('Error adding food item:', error);
//         res.status(500).json({
//             message: 'Server error',
//             status: 500,
//         });
//     }
// });

// router.post('/add-multiple', async (req, res) => {
//     const foodItems = req.body; 


//     if (!Array.isArray(foodItems) || foodItems.length === 0) {
//         return res.status(400).json({
//             message: 'Please provide an array of food items.',
//             status: 400,
//         });
//     }

//     try {
//         const savedFoodItems = await Food.insertMany(foodItems);
//         res.status(201).json({
//             message: 'Food items added successfully!',
//             FoodItems: savedFoodItems,
//             status: 201,
//         });
//     } catch (error) {
//         console.error('Error adding food items:', error);
//         res.status(500).json({
//             message: 'Server error',
//             status: 500,
//         });
//     }
// });

module.exports = router;
