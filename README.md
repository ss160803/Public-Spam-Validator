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
  - [Usage](#usage)
    - [Email Validation](#email-validation)
    - [Spam Detection](#spam-detection)
  - [APIs](#apis)
    - [OOPSpam](#oopspam)
    - [Abstract API](#abstract-api)
  - [Contributing](#contributing)
    - [Contributions are welcome! Please follow these steps:](#contributions-are-welcome-please-follow-these-steps)
  - [License](#license)

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


2. **Navigate to the project directory:**
   ```sh
   cd PublicSpamValidator


3. **Install dependencies:**
   ```sh
   npm install

4. **Create a .env file in the root directory and add your API keys:**
    ```Plaintext
    ABSTRACT_API_KEY=your_abstract_api_key
OOPSPAM_API_KEY=your_oopspam_api_key

5. **Start the server:**
   ```sh
   nodemon app.js
   ```
6. **Open Browser and Navigate to:**
   ```Plaintext
   http://localhost:3000

## Usage

### Email Validation

1. **Enter the email you wish to validate.**
2. **Click on th "Verify Email"**
3. **View the validation results on the results page.**

### Spam Detection

1. **Enter the text you wish to check for spam.**
2. **Click on the "Check Spam" button.**
3. **View the spam detection results on the results page.**

## APIs

### OOPSpam
- For spam detection.
- Learn more at OOPSpam.com
  
### Abstract API
- For email validation.
- Learn more at abstractapi.com

## Contributing

### Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch `git checkout -b feature/your-feature-name`.
3. Commit your changes `git commit -m 'Add some feature'`
4. Push to the branch `git push origin feature/your-feature-name`
5. Create a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.


Feel free to modify the content to better fit your project's specific details and requirements. If you need any additional sections or adjustments, just let me know! 😊 Your thorough documentation will ensure that others can easily understand and contribute to your project. 🚀
