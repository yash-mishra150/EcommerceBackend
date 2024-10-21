const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    ID: {
        type: Number,
        required: true,
        unique: true,
    },
    Product_Name: {
        type: String,
        required: true,
    },
    Product_Description: {
        type: String,
        default: null,
    },
    Product_Rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    Last_Updated: {
        type: Date,
        required: true,
        default: Date.now,
    },
    get_product_category: {
        ID: {
            type: Number,
            required: true,
        },
        Product_Category: {
            type: String,
            required: true,
        },
        Picture_Url: {
            type: String,
            required: true,
        },
    },
    get_all_products: [
        {
            Product_ID: {
                type: Number,
                required: true,
            },
            Picture_URL: {
                type: String,
                required: true,
            },
            Attribute_Combination: {
                type: String,
                required: true,
            },
            Product_Price: {
                type: Number,
                required: true,
            },
            Product_Discount_Price: {
                type: Number,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', foodSchema);
