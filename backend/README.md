# API Documentation

## User Registration

Register a new user in the system.

### Endpoint

```
POST /users/register
```

### Description

Creates a new user account with the provided details.

### Request Body

| Field      | Type     | Required | Description                    |
|------------|----------|----------|--------------------------------|
| username   | string   | Yes      | User's desired username        |
| email      | string   | Yes      | User's email address          |
| password   | string   | Yes      | User's password               |
| phone      | string   | Yes      | User's phone number           |
| role       | string   | Yes      | User role (driver/passenger)  |

### Response Status Codes

| Status Code | Description                                |
|-------------|--------------------------------------------|
| 201         | User successfully created                  |
| 400         | Bad Request - Invalid input parameters     |
| 409         | Conflict - Email/username already exists   |
| 500         | Internal Server Error                      |

### Example Request

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+1234567890",
  "role": "passenger"
}
```

### Example Success Response

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "passenger"
  }
}
```

### Example Error Response

```json
{
  "status": "error",
  "message": "User registration failed",
  "errors": {
    "email": "Email already exists",
    "password": "Password must be at least 8 characters long"
  }
}
```

### Notes

- All timestamps are returned in ISO 8601 format
- The API uses JWT tokens for authentication in subsequent requests
- Password must contain at least 8 characters, including numbers and letters

## User Login

This section provides details about the login function and the JWT token used for authentication.

### Endpoint

```
POST /users/login
```

### Description

Authenticates a user and returns a JWT token for subsequent requests.

### Request Body

| Field      | Type     | Required | Description                    |
|------------|----------|----------|--------------------------------|
| email      | string   | Yes      | User's email address          |
| password   | string   | Yes      | User's password               |

### Response Status Codes

| Status Code | Description                                |
|-------------|--------------------------------------------|
| 200         | User successfully authenticated            |
| 400         | Bad Request - Invalid input parameters     |
| 401         | Unauthorized - Invalid email or password   |
| 500         | Internal Server Error                      |

### Example Request

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Example Success Response

```json
{
  "status": "success",
  "message": "User authenticated successfully",
  "data": {
    "token": "jwt_token"
  }
}
```

### Example Error Response

```json
{
  "status": "error",
  "message": "User authentication failed",
  "errors": {
    "email": "Invalid email or password"
  }
}
```

### Notes

- The JWT token must be included in the Authorization header for all subsequent requests
- The token expires after 24 hours
