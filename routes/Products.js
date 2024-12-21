const express = require('express');
const router = express.Router();

const { verifyToken } = require('../util/jwtToken');
const Food = require('../schema/Foods/FoodSchema');
const Shoe = require('../schema/Shoes/ShoeSchema');
const User = require('../schema/auth/userSchema');

// router.post('/fav/toggle', async (req, res) => {
//     const { token, user_id, product_id, isHearted } = req.body;
//     try {
//         if (!user_id || !product_id || !isHearted) {
//             return res.status(400).json({ msg: 'Please provide all required details.' });
//         }

//         if (!token) {
//             return res.status(400).json({
//                 message: 'Token not provided',
//                 status: 400,
//             });
//         }
//         const decoded = verifyToken(token);
//         if (!decoded) {
//             return res.status(401).json({
//                 message: 'Invalid token',
//                 status: 401,
//             });
//         }

//         const user = await User.findOne({ id: user_id });
//         if (!user) {
//             return res.status(404).json({
//                 message: 'User not found',
//                 status: 404,
//             });
//         }

//         const existingItemIndex = user.fav.findIndex(item => item.productId.toString() === product_id);
//         if (existingItemIndex !== -1) {
//             user.fav.splice(existingItemIndex, 1);
//             await user.save();
//             return res.status(200).json({ msg: 'Product removed from favorites.' });
//         } else {
//             user.fav.push({ productId: product_id, isHearted: isHearted });
//             await user.save();
//             return res.status(200).json({ msg: 'Product added to favorites.' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Server error',
//             status: 500,
//         });
//     }
// })

router.post('/mob/get', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            message: 'Token not provided',
            status: 400,
        });
    }

    try {
        // Verify the token
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                message: 'Invalid token',
                status: 401,
            });
        }


        const products = await Shoe.find().lean();

        const sanitizedProducts = products.map(({ _id, createdAt, updatedAt, __v, ...rest }) => rest);


        res.status(200).json({
            ShoeItems: sanitizedProducts,
            status: 200,
        });
    } catch (error) {
        console.error('Error fetching shoe items:', error);
        res.status(500).json({
            message: 'Server error',
            status: 500,
        });
    }
});



router.post('/get', async (req, res) => {
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
//         const savedFoodItems = await Shoe.insertMany(foodItems);
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
