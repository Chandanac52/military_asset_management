Military Asset Management System
Project Overview
The Military Asset Management System is a comprehensive web-based application designed for military commanders and logistics personnel to efficiently manage critical assets including vehicles, weapons, and ammunition across multiple military bases. The system provides real-time tracking of asset movements, assignments, and expenditures while ensuring accountability through role-based access control and comprehensive audit logging.

Key Features
Asset Tracking and Inventory Management
The system maintains accurate records of opening balances, closing balances, and net movements for all asset types across each military base. Net movements are calculated based on purchases, incoming transfers, and outgoing transfers, providing commanders with real-time visibility into asset availability.

Purchase Management
Authorized personnel can record new asset purchases including quantity, unit cost, supplier information, and purchase status. The system maintains a complete historical record of all purchases with filtering capabilities by date, base, and equipment type.

Asset Transfer System
The application facilitates seamless asset transfers between military bases. Each transfer maintains a complete history including timestamps, originating base, destination base, asset details, quantity, and current status. Transfer status can be tracked through pending, in-transit, and completed stages.

Assignment and Expenditure Tracking
Assets can be assigned to personnel with tracking of assignment dates and return status. The system also records asset expenditures with detailed reasoning and authorization information.

Role-Based Access Control
The system implements three distinct user roles with specific access permissions:

Administrator Role: Full access to all system data and operations including user management and system configuration.

Base Commander Role: Complete access to data and operations restricted to their assigned base only.

Logistics Officer Role: Limited access focused on purchase and transfer operations.

Security Features
All transactions including purchases, transfers, and assignments are logged for comprehensive auditing purposes. The system uses JWT-based authentication and implements rate limiting to prevent abuse. Each API request is validated against the user's role and base assignment.

Technology Stack
Backend Technologies
Node.js with Express framework provides the server-side runtime environment. MongoDB Atlas serves as the primary database, chosen for its flexible schema design that accommodates various asset types with different specifications. The document-based structure naturally fits the hierarchical data relationships between bases, assets, and personnel.

Key backend packages include Mongoose for database modeling and validation, Bcryptjs for password hashing, Jsonwebtoken for authentication, Helmet for security headers, and Express-rate-limit for request throttling.

Frontend Technologies
React serves as the frontend framework, providing a responsive and interactive user interface. React Router handles navigation between different sections of the application. Axios manages API communication with the backend server. Custom CSS provides the styling and responsive design.

System Architecture
Database Schema Design
The MongoDB database consists of several collections:

Users Collection stores user credentials, roles, and base assignments. Base Collection maintains information about each military installation including name, location, and contact details.

Asset Types Collection defines the various categories of assets including weapons, vehicles, ammunition, and equipment. Each asset type includes specifications relevant to its category.

Asset Inventory Collection tracks daily balances and movements for each asset type at each base. This collection maintains opening balances, purchases, transfers in and out, assignments, expenditures, and closing balances.

Purchase Collection records all procurement activities including quantity, cost, supplier, and status.

Transfer Collection manages inter-base asset movements with complete audit trails.

Assignment Collection tracks assets issued to personnel including return status and dates.

Audit Log Collection maintains a complete record of all system transactions for accountability.

API Endpoints
The backend exposes RESTful APIs for authentication, dashboard data retrieval, purchase management, transfer management, and assignment tracking. Each endpoint includes middleware validation for authentication and role-based authorization.

Frontend Structure
The React application follows a component-based architecture with separate folders for components, contexts for state management, services for API communication, and utilities for helper functions.

Installation and Setup
Prerequisites
Node.js version 18 or higher must be installed on the system. MongoDB Atlas account is required for database hosting.

Backend Setup
Navigate to the Backend directory and install all dependencies using npm install. Create a .env file in the Backend directory with the following variables:

MONGODB_URI should contain your MongoDB Atlas connection string. JWT_SECRET should be a strong random string for token signing. NODE_ENV should be set to development for local testing. PORT is typically set to 5000.

After configuring the environment variables, run the database seeding script using npm run seed. This will populate the database with initial bases, asset types, and test users. Start the backend server with npm run dev.

Frontend Setup
Navigate to the Frontend directory and install dependencies using npm install. Create a .env file in the Frontend directory with REACT_APP_API_URL set to http://localhost:5000/api.

Start the frontend development server using npm start. The application will be available at http://localhost:3000.
