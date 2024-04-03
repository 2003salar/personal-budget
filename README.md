# Budget Envelope Express App 📊💸

This Express application provides an API for managing budget envelopes.

## Prerequisites

Before running the application, ensure you have Node.js and npm installed on your system.

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone git clone https://github.com/2003salar/personal-budget-1.git
    ```

2. **Install dependencies:**

    ```bash
    cd personal-budget-1
    npm install
    ```

3. **Start the server:**

    ```bash
    node server.js
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

- **To create a new envelope:**
  - Send a POST request to `/envelopes` with JSON payload containing `budget` and `title`.
  
- **To get details of a specific envelope:**
  - Send a GET request to `/envelope/:envelopeId`, where `:envelopeId` is the ID of the envelope.

- **To update budget of a specific envelope:**
  - Send a PUT request to `/envelope/:envelopeId/:amount`, where `:envelopeId` is the ID of the envelope and `:amount` is the amount to subtract from the budget.

- **To transfer budget from one envelope to another:**
  - Send a POST request to `/envelopes/transfer/:fromId/:toId`, where `:fromId` is the ID of the sender envelope and `:toId` is the ID of the receiver envelope. Include `transfer-amount` header in the request with the amount to transfer.

- **To delete a specific envelope:**
  - Send a DELETE request to `/envelope/:envelopeId`, where `:envelopeId` is the ID of the envelope to delete.
