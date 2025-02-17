
# EcommerceBackend


The EcommerceApp backend provides a comprehensive API to manage products, orders, and users. It includes endpoints for managing product inventory, handling user authentication, and processing orders. The backend is designed to support a smooth online shopping experience and features secure user authentication, product management, and order processing. Payment integration is planned as a future development.


## Features

- APIs for user registration, login, and JWT authentication
- Product management API for adding, updating, and deleting products
- Order processing API for creating, updating, and tracking orders
- Admin panel for managing products, users, and orders


## Tech Stack

- Node.js
- Express
- MongoDB
- JWT Authentication



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`JWT_SECRET`

`MONGODB_URI`

`CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_API_KEY`

`CLOUDINARY_API_SECRET`

`API_KEY`

## API Reference

#### Register a User

```http
POST /api/auth/register
```


Headers:

| Parameter | Type     | Description                |
| --------- | -------- | -------------------------- |
| api_key   | string   | **Required**. Your API key |

Body:

| Parameter  | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| name       | string   | **Required**. User's name          |
| email      | string   | **Required**. User's email address |
| password   | string   | **Required**. User's password     |
| phone      | string   | **Required**. User's phone number |

---

#### Login a User

```http
POST /api/auth/login
```

Body:

| Parameter  | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| email      | string   | **Required**. User's email address |
| password   | string   | **Required**. User's password     |

---

#### Verify Token

```http
POST /api/auth/verify-token
```

Body:

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| token     | string   | **Required**. JWT token           |

---

#### Send OTP

```http
POST /api/eVerify/send-otp
```

Body:

| Parameter  | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| email      | string   | **Required**. Email to send OTP    |

---

#### Verify OTP

```http
POST /api/eVerify/verify-otp
```

Body:

| Parameter  | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| email      | string   | **Required**. Email address        |
| otp        | string   | **Required**. OTP to verify        |

---

#### Upload File

```http
POST /api/upload/:id
```

Path Parameters:

| Parameter | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| id        | string   | **Required**. ID associated with the file |

---

#### Get Products (Mobile)

```http
GET /api/product/mob/get
```

Headers:

| Parameter | Type     | Description                |
| --------- | -------- | -------------------------- |
| api_key   | string   | **Required**. Your API key |
| token     | string   | **Required**. JWT token    |

---

#### Add Product to Cart

```http
POST /api/cart/add
```

Headers:

| Parameter | Type     | Description                |
| --------- | -------- | -------------------------- |
| api_key   | string   | **Required**. Your API key |
| token     | string   | **Required**. JWT token    |

Body:

| Parameter  | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| product_id | string   | **Required**. ID of the product   |
| quantity   | number   | **Required**. Quantity of the product |

---

#### Get Cart Details

```http
GET /api/cart/details
```

Headers:

| Parameter | Type     | Description                |
| --------- | -------- | -------------------------- |
| api_key   | string   | **Required**. Your API key |
| token     | string   | **Required**. JWT token    |

## Run Locally

 Clone the repository:

```bash
   git clone https://github.com/yash-mishra150/EcommerceBackend.git
   cd EcommerceBackend
```

 Install dependencies:

```bash
   npm install
```

Configure environment variables:

```
    Create a `.env` file in the root directory and add the following:
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
```

 Run the server locally:
```
   npm start

   The server will run at `http://localhost:5000` (or the port you specified in your `.env` file).

```
 Verify the server is running by visiting `http://localhost:5000` or using tools like Postman to test the API endpoints.


#### *Ensure MongoDB is set up either locally or using MongoDB Atlas, and update the `MONGO_URI` in your `.env` file with your connection string.*


Your backend is now running locally.


## Authors

- [@yashmishra](https://github.com/yash-mishra150)


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://portfolio-yashmishra.vercel.app/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yash-mishra-87b29725b/)


## Related

Here are some related projects

[Awesome README](https://github.com/matiassingers/awesome-readme)

