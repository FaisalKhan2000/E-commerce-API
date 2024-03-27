# E-Commerce API

API documentation for the E-Commerce application.

## Authentication

### Log in a user

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Log in a user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses**:
  - `200`: Successful login
  - `400`: Invalid login credentials

### Register a new user

- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "name": "string",
    "lastName": "string",
    "email": "string",
    "password": "string",
    "location": "string"
  }
  ```
- **Responses**:
  - `201`: User registration successful
  - `400`: Invalid request body

## Product Routes

### Get all products

- **URL**: `/products`
- **Method**: `GET`
- **Description**: Get all products
- **Parameters**:
  - `page`: Page number (optional)
- **Responses**:
  - `200`: List of products

### Add a new product

- **URL**: `/products`
- **Method**: `POST`
- **Description**: Add a new product
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "price": "number",
    "discountPercentage": "string",
    "rating": "number",
    "stock": "integer",
    "brand": "string",
    "category": "string"
  }
  ```
- **Responses**:
  - `201`: Product added successfully
  - `400`: Invalid request body

### Get a product by ID

- **URL**: `/products/{productId}`
- **Method**: `GET`
- **Description**: Get a product by ID
- **Parameters**:
  - `productId`: ID of the product to retrieve
- **Responses**:
  - `200`: Product details
  - `404`: Product not found

### Update a product by ID

- **URL**: `/products/{productId}`
- **Method**: `PATCH`
- **Description**: Update a product by ID
- **Parameters**:
  - `productId`: ID of the product to update
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "price": "number",
    "discountPercentage": "number",
    "rating": "number",
    "stock": "integer",
    "brand": "string",
    "category": "string"
  }
  ```
- **Responses**:
  - `200`: Product updated successfully
  - `400`: Invalid request body
  - `404`: Product not found

### Delete a product by ID

- **URL**: `/products/{productId}`
- **Method**: `DELETE`
- **Description**: Delete a product by ID
- **Parameters**:
  - `productId`: ID of the product to delete
- **Responses**:
  - `200`: Product deleted successfully
  - `404`: Product not found

## Cart Routes

### Add product to cart

- **URL**: `/cart`
- **Method**: `POST`
- **Description**: Add product to cart
- **Request Body**:
  ```json
  {
    "productId": "string",
    "quantity": "integer"
  }
  ```
- **Responses**:
  - `200`: Product added to cart successfully
  - `400`: Invalid request body

### Get cart contents

- **URL**: `/cart`
- **Method**: `GET`
- **Description**: Get cart contents
- **Responses**:
  - `200`: Cart contents
  - `404`: Cart not found

### Delete cart

- **URL**: `/cart`
- **Method**: `DELETE`
- **Description**: Delete cart
- **Responses**:
  - `200`: Cart deleted successfully
  - `404`: Cart not found

## Order Routes

### Checkout and create order

- **URL**: `/orders/checkout`
- **Method**: `POST`
- **Description**: Checkout and create order
- **Request Body**:
  ```json
  {
    "address": "string"
  }
  ```
- **Responses**:
  - `201`: Order created successfully
  - `400`: Invalid request body

### Get user orders

- **URL**: `/orders`
- **Method**: `GET`
- **Description**: Get user orders
- **Responses**:
  - `200`: List of user orders
  - `404`: No orders found
