# Military Asset Management System

## Project Overview

The Military Asset Management System is a web-based application designed to help military commanders and logistics personnel efficiently manage critical assets such as vehicles, weapons, and ammunition across multiple bases. The system enables real-time tracking of asset movements, assignments, and expenditures while ensuring accountability through role-based access control and audit logging.



## Features

- Asset tracking and inventory management across multiple bases  
- Purchase management with supplier and cost tracking  
- Asset transfer system with status tracking (pending, in-transit, completed)  
- Assignment and expenditure tracking for personnel usage  
- Role-based access control (Administrator, Base Commander, Logistics Officer)  
- Secure authentication using JWT  
- Audit logging for all transactions  



## Technology Stack

### Backend
- Node.js  
- Express.js  
- MongoDB Atlas  
- Mongoose  
- Bcryptjs  
- Jsonwebtoken (JWT)  
- Helmet  
- Express-rate-limit  

### Frontend
- React.js  
- React Router  
- Axios  
- CSS  



## System Architecture

### Database Collections

- Users: Stores user credentials, roles, and base assignments  
- Base: Stores base details such as name and location  
- Asset Types: Defines categories like weapons, vehicles, ammunition  
- Asset Inventory: Tracks balances and asset movements  
- Purchase: Records procurement details  
- Transfer: Manages inter-base asset movement  
- Assignment: Tracks assets assigned to personnel  
- Audit Log: Stores all system activity for accountability  



## API Endpoints

The backend provides RESTful APIs for:

- Authentication  
- Dashboard data  
- Purchase management  
- Transfer management  
- Assignment tracking  

All endpoints include authentication and role-based authorization.



## Project Structure

Military-Asset-Management-System/

│── Backend/  
│── Frontend/  
│── README.md  



## Installation and Setup

### Prerequisites

- Node.js (v18 or higher)  
- MongoDB Atlas account  



### Backend Setup

1. Navigate to Backend directory:
   cd Backend  

2. Install dependencies:
   npm install  

3. Create .env file and add:
   MONGODB_URI=your_mongodb_connection_string  
   JWT_SECRET=your_secret_key  
   NODE_ENV=development  
   PORT=5000  

4. Seed the database:
   npm run seed  

5. Start backend server:
   npm run dev  



### Frontend Setup

1. Navigate to Frontend directory:
   cd Frontend  

2. Install dependencies:
   npm install  

3. Create .env file:
   REACT_APP_API_URL 

4. Start frontend:
   npm start  



## Security Features

- JWT-based authentication  
- Role-based authorization  
- Rate limiting to prevent abuse  
- Secure password hashing using bcrypt  
- Helmet for HTTP security headers  
- Complete audit logging of system activities  



## Future Enhancements

- Advanced analytics dashboard  
- Notifications and alerts system  
- Mobile application support  
- Cloud deployment and scaling  
- Enhanced reporting features  



## Author

Chandana  
https://github.com/Chandanac52
