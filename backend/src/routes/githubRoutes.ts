import {GithubGraphqlClient} from "../classes/github-graphql-client";
import express from "express";

const app = express();

let client: GithubGraphqlClient;

//Return the data for a request for a user's code reviews
app.get("/code-reviews", async (req, res) => {
   try {
       const login = req.query.login as string;
       const fromDate = req.query?.fromDate ? new Date(req.query?.fromDate as string) : undefined;
       const toDate = req.query?.toDate ? new Date(req.query?.toDate as string) : undefined;
       client = GithubGraphqlClient.getInstance();
       const repoData = await client.getUserCodeReviewData(login, fromDate, toDate);

       res.status(200).send(repoData);
   } catch (error: any) {
       res.status(500).send(`Couldn't retrieve code reviews for user: ${req.query.login}`);
   }
});

export default app;