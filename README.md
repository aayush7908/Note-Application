# Note Application

## Description
This project is a simple Note Making Application created using MERN Stack. The main motive behind developing this project was to learn full-stack web application development using MERN Stack.

This project helped me learn the fundamentals of: 
- React Hooks
- MongoDB Schema and Validations
- API Versioning
- Modular Design of Project
- Centralized Error Handling
- Cryptography(Single-Key and Two-Key)
- Docker and Containerization


## Installation
To clone the repository, open git bash in your desired directory and execute the below given command:

```
git clone https://github.com/aayush7908/Note-Application.git
```

After this, a new directory named `Note-Application` will be created within the current working directory.
Create a `.env` file in that folder with following key-value pairs:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
JWT_SECRET=YOUR_JWT_SECRET
MONGO_URI=mongodb://database/inotebook
GMAIL_APP_PASSWORD=YOUR_GOOGLE_APP_PASSWORD
GMAIL_SENDER=EMAIL_ADDRESS_OF_ACCOUNT_LINKED_WITH_ABOVE_APP_PWD
GMAIL_RECEIVER=EMAIL_ADDRESS_OF_RECEIVER
PORT=5000
```

*__NOTE:__ Values indicated by ALL CAPS have to be replaced by your own credentials.*

After `.env` file is ready, use the following docker command to run the application:

```
docker-compose up --build -d
```

*___INFO:___ Docker will create three containers, one for each of Frontend, Backend and MongoDB Database. These containers will run in background. If you don't want them to run in background, then remove `-d` flag from docker command*

After this, your application is ready. You can use the application by pasting following code in your browser:

```
http://localhost:3000
```

To stop these containers, you can use the command:
```
docker-compose down
```


## Features

1. Centralized Error Handler:
   - If there is an error in any API, the error is passed to a Centralized Error Handler.
   - Error is checked and if it is found to be critical, an email containing error stack trace is sent to the developer's email address.

2. Search Functionality:
    - Notes can be searched keywords.
    - Provided keywords will be matched for Title, Content as well as Tags of the Notes.
    <br />
    <br />
    <img src="https://github.com/aayush7908/Note-Application/assets/116342742/4803ba50-f368-4f3c-98cd-ce8aefb96e19" alt="Search Bar GIF" title="Search Bar GIF" width="80%" />
    <br />
    <br />
 
3. Theme Toggler:
    - Light and Dark Theme Options.
    - By default, the theme will match user computer's OS default theme.
    <br />
    <br />
    <img src="https://github.com/aayush7908/Note-Application/assets/116342742/a8867503-f19a-44b2-96aa-9b38687b0d0b" alt="Theme Toggler GIF" title="Theme Toggler GIF" width="80%" />
    <br />
    <br />
 
4. Infinite Scroll:
    - In one fetch request, only some fixed number of notes are fetched.
    - This helps reducing latency, and thus improves user experience.
    - Focus on the scroll bar to see how new contents are loaded (fetched from Database), as user reaches to end of scroll.
    <br />
    <br />
    <img src="https://github.com/aayush7908/Note-Application/assets/116342742/3f7eafb4-097c-43c7-b0c1-868a3a9781bc" alt="Infinite Scroll GIF" title="Infinite Scroll GIF" width="80%" />
    <br />
    <br />
 
5. Remember Me Option:
    - While logging in, if the user checks this option, he need not login again for net 30 days. He will be directly logged in.
