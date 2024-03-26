import "./setup";
import express from "express";
import cors from 'cors';
import githubRoutes from "./routes/githubRoutes";
import session from "express-session";
const router = express.Router();

// Create an express app instance and set the port to 3000 or the PORT environment variable
const app = express();
const port = process.env.PORT || 3002;

//middleware to enable CORS and parse JSON
app.use(cors());
app.use(express.json());

// Middleware to enable sessions
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true }
}));

//set up routes
app.use('/api/github', githubRoutes);

router.get("/test", async (req, res) => {
    console.log('Test successful');
    res.status(200).send('Test successful');
});

//start the server on the specified port and log a message to the console
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});