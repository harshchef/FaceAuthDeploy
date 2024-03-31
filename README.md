
Project Link: http://faceauth.us.to/

Face Authentication Application
Overview
This repository contains the code for a face authentication application developed using React.js for the frontend and Node.js with Express.js for the backend. The application utilizes face recognition technology to provide a secure login process based on facial recognition.

Frontend
  React.js: Selected for its component-based architecture, enhancing modularity and reusability.
  Notable Packages:
    axios: A promise-based HTTP client for facilitating AJAX requests to the server.
    react-webcam: A React component enabling access to the user's webcam and capturing video streams.
  Pages:
    Login Screen: Allows users to initiate the authentication process by granting camera access.
    Result Page: Indicates the success or failure of the login attempt.
    Add Face Data Screen: Facilitates the addition of a new user, with an option to retake a picture if needed.
  The registration and login process is intentionally designed to be user-friendly, boasting an intuitive user interface.

Backend
  Packages:
    Express.js, face-api.js, mongoose, canvas, express-fileupload
  Functionality:
    Handles various functionalities such as HTTP requests, face recognition, database operations, image processing, and file uploads.
    Logs all errors for better debugging and troubleshooting.
  Endpoints:
    /post-face: Processes images to extract face descriptors using loaded models, which are then stored in the MongoDB database.
    /check-face: Retrieves face descriptors from the database based on uploaded images, comparing them with known faces to recognize and match faces.
  Deployment:
    Selection of EC2 instance type
    Creation of EC2 instance
    Configuration of security groups
    SSH key pair setup
    Installation of PM2 globally on the EC2 instance
    Configuration of PM2 for managing Node.js application
    Installation of npm, Node.js, Express.js, and other modules on EC2
    Installation of nginx and configuration as a reverse proxy
    Clone the git repository to EC2, start the project using PM2, and check for any errors
    Obtain a free domain from https://freedns.afraid.org/ and link it to the EC2 instance's public IP address.
    Website link: Face Authentication Application
    Getting Started
  
To run the application locally, follow these steps:
    Clone this repository.
    Navigate to the frontend and backend directories and install dependencies using npm install.
    Start the frontend and backend servers using npm start.
    Access the application in your browser at http://localhost:5001.

Contributors
Aditya Kumar(harshchef)
