# Note Application

## Description
This project is a simple Note Making Application created using __MERN Stack__. The main motive behind developing this project was to learn full-stack web application development using MERN Stack.

This project helped me learn the fundamentals of: 
- React Hooks
- MongoDB Schema and Validations
- API Versioning
- Modular Design of Project
- Centralized Error Handling
- JWT Authentication
- Docker and Containerization

Visit the live app here: https://inotebook-aayush.vercel.app/

## Installation
To clone the repository, open git bash in your desired directory and execute the below given command:

```
git clone https://github.com/aayush7908/Note-Application.git
```

After this, a new directory named `Note-Application` will be created within the current working directory.
Create a `.env` file in that folder with following key-value pairs:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api/v2
JWT_SECRET=YOUR_JWT_SECRET
MONGO_URI=mongodb://database/inotebook
GMAIL_APP_PASSWORD=<YOUR_GOOGLE_APP_PASSWORD>
GMAIL_SENDER=<EMAIL_ADDRESS_OF_ACCOUNT_LINKED_WITH_ABOVE_APP_PWD>
GMAIL_RECEIVER=<EMAIL_ADDRESS_OF_RECEIVER>
PORT=5000
```

After `.env` file is ready, use the following docker command to run the application:

```
docker-compose up --build -d
```

*___INFO:___ Docker will create three containers, one for each of Frontend, Backend and MongoDB Database. These containers will run in background. If you don't want them to run in background, then remove `-d` flag from docker command*

After this, your application is ready. Visit following URL in your browser:

```
http://localhost:3000
```

To stop these containers, you can use the command:
```
docker-compose down
```


## Project Structure
```
.
├── backend             # express.js backend_
│   ├── config          # configuration files for mongoDB database_
│   ├── middleware      # middlewares for request processing_
│   ├── models          # models for data storage_
│   ├── routes          # API endpoints_
│   └── utils           # utility functions used across the application_
│
└── frontend            # react.js frontend_
    └── src
        ├── assets      # static assets for the application_
        ├── components  # reusable components_
        ├── context     # context for global state management_
        ├── pages       # pages which for specifc routes_
        ├── services    # service methods to request backend API_
        └── utils       # utility functions used across the application_
```


## API Endpoints
### Authentication
- `POST: /auth/register`: Register a new user
- `POST: /auth/login`: Login using email and password
- `POST: /auth/forgot-password/otp/send`: Send OTP to verify email for password reset service
- `POST: /auth/forgot-password/otp/verify`: Verify OTP for password reset service
- `POST: /auth/forgot-password/reset-password`: Reset password

### User
- `GET: /user/authenticate`: Authenticate user using JWT token
- `GET: /user/get`: Get details of the authenticated user
- `PATCH: /user/update/name`: Update name of the authenticated user
- `DELETE: /user/delete`: Delete the authenticated user

### Note
- `POST: /note/create`: Create note
- `PUT: /note/update/:id`: Update note by ID
- `DELETE: /note/delete/:id`: Delete note by ID
- `GET: /note/get/one/:id`: Get note by ID
- `GET: /note/get/all`: Get all notes created by the authenticated user


## Features
### Centralized Error Handler
- If there is an error in any API, the error is passed to a Centralized Error Handler.
- Error is checked and if it is found to be critical, an email containing error stack trace is sent to the developer's email address.

### Search Functionality
- Notes can be searched with keywords.
- Provided keywords will be matched for Title, Content as well as Tags of the Notes.

### Infinite Scroll
- In one fetch request, only some fixed number of notes are fetched.
- This helps reducing latency, and thus improves user experience.
- Focus on the scroll bar to see how new contents are loaded (fetched from Database), as user reaches to end of scroll.
 
### Remember Me Option
- While logging in, if the user checks this option, he will be remembered for next 7 days.

### Admin Panel
- Created Admin Panel for user and note management.

### Containerized The Application
- Used `Docker` to containerize the application.