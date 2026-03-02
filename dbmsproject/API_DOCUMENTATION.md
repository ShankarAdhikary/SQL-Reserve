
# Backend API Documentation

## Introduction

This document provides a detailed guide to the backend API for the banking application. It's intended for frontend developers who need to interact with the backend services.

The API is structured into three main parts:
- **Auth**: Handles user registration, login, and profile management.
- **Bank**: Manages bank accounts, transfers, deposits, and withdrawals.
- **Admin**: Provides administrative functionalities for system management.

### Base URLs

- **Auth API**: `/api/auth`
- **Bank API**: `/api/bank`
- **Admin API**: `/api/admin`

## Authentication

Most API endpoints are protected and require a JSON Web Token (JWT) for access.

### Getting a Token

- A JWT is issued upon a successful login via the `POST /api/auth/login` endpoint.
- The token is returned in the response body.

### Using the Token

- To access protected endpoints, include the JWT in the `Authorization` header of your HTTP request, using the `Bearer` scheme.
- **Example**: `Authorization: Bearer <your_jwt_token>`

---

## Auth API Endpoints

### 1. Register a New User

- **Endpoint**: `POST /api/auth/register`
- **Description**: Creates a new user account. The first user registered will be assigned the `ADMIN` role.
- **Request Body** (`application/json`):
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "strong_password",
    "fullName": "Test User",
    "phone": "1234567890",
    "nationalId": "NATIONAL_ID_123"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "user_id": "some_uuid",
      "username": "testuser",
      "role": "USER"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: If the username or email already exists.
  - `500 Internal Server Error`: For server-side errors.

### 2. Login

- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticates a user and returns a JWT.
- **Request Body** (`application/json`):
  ```json
  {
    "username": "testuser",
    "password": "strong_password"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "token": "your_jwt_token",
    "user": {
      "id": "some_uuid",
      "username": "testuser",
      "fullName": "Test User",
      "role": "USER"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: For invalid credentials.
  - `500 Internal Server Error`: For server-side errors.

### 3. Get User Profile

- **Endpoint**: `GET /api/auth/profile`
- **Authentication**: Required (JWT)
- **Description**: Fetches the profile of the currently authenticated user. Sensitive data is decrypted for display.
- **Success Response** (200):
  ```json
  {
    "username": "testuser",
    "fullName": "Test User",
    "email": "test@example.com",
    "phoneDecrypted": "1234567890",
    "nationalIdDecrypted": "NATIONAL_ID_123",
    "phoneEncryptedInDB": "encrypted_string_representation"
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: If no token is provided.
  - `403 Forbidden`: If the token is invalid.
  - `404 Not Found`: If the user is not found.

---

## Bank API Endpoints

### 1. Create a Bank Account

- **Endpoint**: `POST /api/bank/accounts`
- **Authentication**: Required (JWT)
- **Description**: Creates a new bank account for the authenticated user.
- **Request Body** (`application/json`):
  ```json
  {
    "accountType": "SAVINGS",
    "initialBalance": 500.00
  }
  ```
- **Success Response** (201):
  ```json
  {
    "account_id": "some_uuid",
    "user_id": "user_uuid",
    "account_number": "1234567890",
    "account_type": "SAVINGS",
    "balance": "500.00",
    "created_at": "timestamp"
  }
  ```

### 2. Get User's Bank Accounts

- **Endpoint**: `GET /api/bank/accounts`
- **Authentication**: Required (JWT)
- **Description**: Fetches all bank accounts belonging to the authenticated user.
- **Success Response** (200):
  ```json
  [
    {
      "account_id": "uuid1",
      "account_number": "1111111111",
      "balance": "1500.00",
      ...
    },
    {
      "account_id": "uuid2",
      "account_number": "2222222222",
      "balance": "3000.50",
      ...
    }
  ]
  ```

### 3. Transfer Funds

- **Endpoint**: `POST /api/bank/transfer`
- **Authentication**: Required (JWT)
- **Description**: Transfers a specified amount from one of the user's accounts to another account.
- **Request Body** (`application/json`):
  ```json
  {
    "fromAccountId": "your_account_uuid",
    "toAccountNumber": "recipient_account_number",
    "amount": 100.00,
    "description": "Payment for services"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Transfer successful"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: For insufficient funds, invalid account, etc.

### 4. Deposit Funds

- **Endpoint**: `POST /api/bank/deposit`
- **Authentication**: Required (JWT)
- **Description**: Deposits money into one of the user's accounts.
- **Request Body** (`application/json`):
  ```json
  {
    "accountId": "your_account_uuid",
    "amount": 200.00
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Deposit successful"
  }
  ```

### 5. Withdraw Funds

- **Endpoint**: `POST /api/bank/withdraw`
- **Authentication**: Required (JWT)
- **Description**: Withdraws money from one of the user's accounts.
- **Request Body** (`application/json`):
  ```json
  {
    "accountId": "your_account_uuid",
    "amount": 50.00
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Withdrawal successful"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: For insufficient funds.

---

## Admin API Endpoints

**Note**: All admin endpoints require a valid JWT from a user with the `ADMIN` role.

### 1. Get All Users

- **Endpoint**: `GET /api/admin/users`
- **Authentication**: Required (JWT, Admin)
- **Description**: Retrieves a list of all users in the system with their account details.
- **Success Response** (200):
  ```json
  [
    {
      "user_id": "uuid",
      "username": "testuser",
      "email": "test@example.com",
      "full_name": "Test User",
      "role": "USER",
      "created_at": "timestamp",
      "account_count": "2",
      "total_balance": "4500.50"
    }
  ]
  ```

### 2. Get All Transactions

- **Endpoint**: `GET /api/admin/transactions`
- **Authentication**: Required (JWT, Admin)
- **Description**: Retrieves a list of all transactions in the system.
- **Success Response** (200):
  ```json
  [
    {
      "transaction_id": "uuid",
      "sender_account_id": "sender_uuid",
      "receiver_account_id": "receiver_uuid",
      "amount": "100.00",
      "transaction_type": "TRANSFER",
      "status": "COMPLETED",
      "created_at": "timestamp",
      "sender_acc": "sender_account_number",
      "receiver_acc": "receiver_account_number"
    }
  ]
  ```

### 3. Get System Logs

- **Endpoint**: `GET /api/admin/logs`
- **Authentication**: Required (JWT, Admin)
- **Description**: Retrieves the last 100 system audit logs.
- **Success Response** (200):
  ```json
  [
    {
      "log_id": 1,
      "user_id": "uuid",
      "action": "LOGIN_SUCCESS",
      "details": "User logged in",
      "ip_address": "::1",
      "timestamp": "timestamp",
      "username": "testuser"
    }
  ]
  ```

