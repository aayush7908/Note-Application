# Note Application

## Description
This project is a simple Note Making Application created using MERN Stack. The main motive behind developing this project was to learn full-stack web application development using MERN Stack.

This project helped me learn the fundamentals of: 
 * React Hooks
 * MongoDB Schema and Validations
 * API Versioning
 * Modular Design of a Project
 * Cryptography(Single-Key and Two-Key)

## Features
 1. Creative Login Page:
     <img src="https://github.com/aayush7908/Note-Application/assets/116342742/beb2a136-f562-428d-821d-6696753cdd11" alt="Login Page GIF" title="Login Page GIF" width="80%" />
     
 2. Responsive Search Bar:
     <img src="https://github.com/aayush7908/Note-Application/assets/116342742/4803ba50-f368-4f3c-98cd-ce8aefb96e19" alt="Search Bar GIF" title="Search Bar GIF" width="80%" />
 
 3. Theme Toggler:
     <img src="https://github.com/aayush7908/Note-Application/assets/116342742/a8867503-f19a-44b2-96aa-9b38687b0d0b" alt="Theme Toggler GIF" title="Theme Toggler GIF" width="80%" />
 
 4. Infinite Scroll:
     <img src="https://github.com/aayush7908/Note-Application/assets/116342742/3f7eafb4-097c-43c7-b0c1-868a3a9781bc" alt="Infinite Scroll GIF" title="Infinite Scroll GIF" width="80%" />
     Focus on the scroll bar to see how new contents are loaded (fetched from Database), as user reaches to end of scroll.
 
 5. Profile Page:
     <img src="https://github.com/aayush7908/Note-Application/assets/116342742/dc5f7f0a-d48d-4a28-aa6a-d80facc74482" alt="Profile Page" title="Profile Page" width="80%" />
 
 6. Remember Me Option:
     While logging in, if the user checks this option, he need not login again for net 30 days. He will be directly logged in.

## Installation
To clone the repository, open git bash in your desired directory and execute the below given command:
```
git clone https://github.com/aayush7908/Note-Application.git
```

After this, a new directory named `Note-Application` will be created within the current working directory.
 * Now, you need to create two .env files.
     1. Create first one in the directory `Note-Application` and place environment variable:
         * `REACT_APP_API_BASE_URL` and the value set to: `http://localhost:PORT/api/v1` where PORT must be replaced by the port number on which backend server is running.
     
     2. Create second one in the directory `Note-Application/backend` and place three environment variables:
         * `JWT_SECRET`: this will store the secret string for encrypting the passwords
         * `MONGO_URI`: this will store the url on which mongodb database is running (along with the database name)
         * `PORT`: this will store the port number on which your nodejs server will run

Once the environment variables are created, you are ready to start the application.
* First of all, start the backend (nodejs) server by opening the terminal in the directory `Note-Application/backend` and executing the command:
```
node index.js
```

* Then, start the frontend (reactjs) server by opening another terminal in the directory `Note-Application` and executing the command:
```
npm start
```
