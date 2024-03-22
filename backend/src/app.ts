import "./setup";
import express from "express";
import githubRoutes from "./routes/githubRoutes";

// Create an express app instance and set the port to 3000 or the PORT environment variable
const app = express();
const port = process.env.PORT || 3000;

//middleware to parse json
app.use(express.json());

//set up routes
app.use('/github', githubRoutes);

//start the server on the specified port and log a message to the console
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});