const mongoose = require('mongoose');

const ShoeSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        default: null,
    },
    productRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now,
    },
    productCategory: {
        id: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        pictureUrl: {
            type: String,
            required: true,
        },
    },
    allProducts: [
        {
            productId: {
                type: Number,
                required: true,
            },
            pictureUrl: {
                type: String,
                required: true,
            },
            attributeCombination: {
                type: String,
                required: true,
            },
            productPrice: {
                type: Number,
                required: true,
            },
            productDiscountPrice: {
                type: Number,
                required: true,
            },
        },
    ],
}, {
    timestamps: true, 
});

module.exports = mongoose.model('Shoe', ShoeSchema);
