# Wallet System

The Wallet System is a web application that allows users to register, login, and manage their wallet balances. It provides a secure platform for users to store and transact with their digital wallets.

## Features

1. **Registration**: Users can register by providing their personal information such as first name, last name, date of birth, address, city, province, telephone number, email address, and username. The registration process includes input validation, server-side validation, and security measures such as tokenization and password hashing. The registered user data is stored in a MySQL database.

2. **Login**: Users can log in to their accounts using their email/username and password. The login process verifies the credentials and returns the user's login data without the password. Single Sign-On (SSO) is implemented to expire old devices when the user logs in from multiple devices.

3. **Wallet**: Each registered user is assigned a unique wallet address encrypted in SHA256. Users can check their wallet balance, top up it, and make payments using it. The wallet APIs are secured with authentication methods to ensure the security of the wallet transactions.

## System Design

The system design of the Wallet System includes the following components:

- **Flowchart Diagram**: This represents the flow of operations in the system, including user registration, login, and wallet management.

<table>
  <tr>
    <td><img src="https://img001.prntscr.com/file/img001/Y_Kfy3wAQv2A35FpWNjWtg.jpeg"></td>
    <td><img src="https://img001.prntscr.com/file/img001/VMsGwuenSI-S_6azpx2C3Q.jpeg"></td>
    <td><img src="https://img001.prntscr.com/file/img001/ACDAScxoQHe5MSBLNe7-og.jpeg"></td>
  </tr>
</table>


- **Database ER Diagram**: Illustrates the entity-relationship model of the database, showing the relationships between entities such as users and wallets.

<table>
  <tr>
    <td><img src="https://img001.prntscr.com/file/img001/z1LccOiTQqO_SapO1NJ7lw.jpg"></td>
  </tr>
</table>

- **UML Sequence Diagram**: Presents the sequence of interactions between different system components during user registration, login, and wallet operations.

<table>
  <tr>
    <td><img src="https://img001.prntscr.com/file/img001/aGC9UZQsS1G5VT9IAsE3Ag.jpeg"></td>
    <td><img src="https://img001.prntscr.com/file/img001/3Bf1mny4TH2xodjtxnWTLw.jpeg"></td>
    <td><img src="https://img001.prntscr.com/file/img001/j_I0crAYS6al2k2kYttSgA.jpeg"></td>
  </tr>
</table>

## Technologies Used

The Wallet System is developed using the following technologies:

- **Node.js**: Provides the runtime environment for executing JavaScript code on the server side.

- **NestJS**: A framework for building efficient and scalable server-side applications using TypeScript.

- **MySQL**: A popular relational database management system for storing user data, wallet information, and transaction records.

- **JWT (JSON Web Token)**: Used for user authentication and generating secure tokens for registration and login.

- **Passport.js**: A middleware for Node.js that provides authentication strategies, including local and JWT-based authentication.

- **TypeORM**: An Object-Relational Mapping (ORM) library simplifies database operations and enables seamless interaction with the MySQL database.

## Installation and Usage

1. Clone the project repository.

2. Install the dependencies by running `npm install`.

3. Set up the environment variables by creating a `.env` file and copying the contents from `env.example`. Update the values as required.

4. Run the application using the provided scripts in the `package.json` file, such as `npm start`. Please make sure the MySQL service is running.

5. API documentation is provided through this link: [http://localhost:3000/api](http://localhost:3000/api).

Once the dependencies and environment variables are set up, you can execute the tests by running the command npm `run test`. This command will trigger the test suite and display the results in the console.

## Environment Setup

To set up the environment for the Wallet System application, follow these steps:

1. Create a new file in the project directory called `.env`.

2. Open the `.env` file in a text editor.

3. Copy and paste the following lines into the `.env` file:

```
JWT_SECRET=

DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
```

4. Define the values of the environment variables. For example, you can change the `JWT_SECRET` value to a different secret key for JWT token generation, or update the database credentials (`DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`) to match your MySQL database configuration.

5. Save the `.env` file.

The application will automatically read the environment variables from the `.env` file when it starts up. Make sure to restart the application if it is already running for the changes to take effect.

## Migration

To perform migrations using TypeORM in the Wallet System application, make sure all the required dependencies are installed by running the following command:

```
npm run typeorm:run-migration
```

This command will execute the migrations defined in the project and update the database schema accordingly.

Note: Make sure your MySQL database server is running and the database credentials provided in the .env file are correct. Also, ensure that the database specified in the .env file (DATABASE_NAME=yourdb) exists in your MySQL server.

By running the migration command, TypeORM will automatically create the necessary tables and relationships based on the defined entities and migrations in the project.

## Additional Information

This project also includes some web3 tasks, as follows:

1. **Screenshot of MetaMask Ethereum Wallet:** The screenshot of the MetaMask Ethereum wallet can be found in the file named `/web3/ethereum-wallet-metamask.png`.

2. **Content Encryptor and Decryptor:** You can access the content encryptor and decryptor through the following link: [http://localhost:3000](http://localhost:3000). This tool enables you to encrypt and decrypt content using your MetaMask address and private key.

3. **Simple Smart Contract in Solidity:** The simple smart contract written in Solidity can be found in the file named `/web3/Counter.sol`. This contract implements the desired functionality, including a counter variable, a constructor to initialize the counter, a function to increment the counter, and a function to retrieve the current counter value.
