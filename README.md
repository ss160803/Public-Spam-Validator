# PublicSpamValidator

PublicSpamValidator is a web application designed to provide users with a seamless spam validation experience. It offers email validation and spam detection services, ensuring that users can identify and filter out spam effectively. This project leverages several APIs to deliver its functionality.

## Table of Contents

- [PublicSpamValidator](#publicspamvalidator)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)

## About

PublicSpamValidator was built to help users validate emails and detect spam with ease. It's crafted with attention to detail, usability, and functionality, ensuring that every feature meets user needs efficiently.

## Features

- Email Validation
- Spam Detection
- Responsive Design
- User-Friendly Interface

## Technologies

- Node.js
- Express
- EJS (Embedded JavaScript templating)
- Bootstrap
- Axios
- Rate Limiting (express-rate-limit)
- Cookie Parsing (cookie-parser)
- UUID (uuid)
- Node Cache (node-cache)
- dotenv

## Setup

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/PublicSpamValidator.git

   ```

2. **Navigate to the project directory:**

   ```sh
   cd PublicSpamValidator

   ```

3. **Install dependencies:**

   ```sh
   npm install

   ```

4. **Create a .env file in the root directory and add your API keys:**
   ```Plaintext
   ABSTRACT_API_KEY=your_abstract_api_key
   OOPSPAM_API_KEY=your_oopspam_api_key
