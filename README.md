# Budget Envelope Express App 📊💸

This Express application provides an API for managing budget envelopes.

## Prerequisites

Before running the application, ensure you have Node.js and npm installed on your system.

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone git clone https://github.com/2003salar/personal-budget.git
    ```

2. **Install dependencies:**

    ```bash
    cd personal-budget
    npm install
    ```

3. **Start the server:**

    ```bash
    npm start
    ```

    The server will start listening on port 3000 by default. You can access the API endpoints using a tool called Postman. 

## Endpoints

- **GET /:** Get all envelopes
- **POST /envelopes:** Create a new envelope
- **GET /envelope/:envelopeId:** Get details of a specific envelope
- **PUT /envelope/:envelopeId/:amount:** Update budget of a specific envelope
- **POST /envelopes/transfer/:fromId/:toId:** Transfer budget from one envelope to another
- **DELETE /envelope/:envelopeId:** Delete a specific envelope

## Usage

### Path
- Navigate to `/api/v1/envelopes` and to associated paths as mentioned bellow. 

- **To get all envelopes:**
  - Send a GET request to `/` to get all the envelopes.

- **To create a new envelope:**
  - Send a POST request to `/` with JSON payload containing `budget` and `title`.
  
- **To get details of a specific envelope:**
  - Send a GET request to `/:id`, where `:id` is the ID of the envelope.

- **To update budget of a specific envelope:**
  - Send a PATCH request to `/:id`, where `:id` is the ID of the envelope, and sending in the request body `amount` to subtract from the budget.

- **To transfer budget from one envelope to another:**
  - Send a POST request to `/transfer/:fromId/:toId`, where `:fromId` is the ID of the sender envelope and `:toId` is the ID of the receiver envelope. Include `amount` in the request body with the amount to transfer.

- **To delete a specific envelope:**
  - Send a DELETE request to `/:id`, where `:id` is the ID of the envelope to delete.

- **To test the API endpoints using Newman:**

1. Ensure that your Express.js server is running.
2. Run the following command in your terminal to execute the exported Postman collection using Newman:
   ```bash
   npm test
   ```

## Technologies
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

