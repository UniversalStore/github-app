import express from "express";
import {GithubGraphqlClient} from "../classes/githubGraphqlClient";

const router = express.Router();

interface CodeReviewPayload {
    username: string;
    fromDate?: string;
    toDate?: string;
}

//Return the data for a request for a user's code reviews
router.post("/code-reviews", async (req, res) => {
   try {
       const body = req.body;
       const username = body.username as string;
       const fromDate = body?.fromDate ? new Date(body?.fromDate as string) : undefined;
       const toDate = body?.toDate ? new Date(body?.toDate as string) : undefined;
       const client = GithubGraphqlClient.getInstance();
       const repoData = await client.getUserCodeReviewData(username, fromDate, toDate);

       res.status(200).send(repoData);
   } catch (error: any) {
       console.error(error);
       res.status(500).send(`Couldn't retrieve code reviews for user: ${req.body?.username}`);
   }
});

export default router;