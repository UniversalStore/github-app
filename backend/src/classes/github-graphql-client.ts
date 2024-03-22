import {cacheExchange, Client, fetchExchange} from "@urql/core";
import {PullRequestReviewContributionsNodes, UserCodeReviewDataResponse} from "../types/github-graphql";

/**
 * Singleton class for interacting with the GitHub GraphQL API
 */
export class GithubGraphqlClient {
    private static instance: GithubGraphqlClient;
    private client: Client;

    /**
     * Get the singleton instance of the GithubGraphqlClient
     * Private constructor to enforce singleton pattern
     * @private
     */
    private constructor() {
        this.client = new Client({
            url: 'https://api.github.com/graphql',
            exchanges: [cacheExchange, fetchExchange],
            fetchOptions: {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
                }
            }
        });
    }

    /**
     * Get the singleton instance of the GithubGraphqlClient
     */
    public static getInstance(): GithubGraphqlClient {
        if (!GithubGraphqlClient.instance) GithubGraphqlClient.instance = new GithubGraphqlClient();
        return GithubGraphqlClient.instance;
    }

    /**
     * Make a query to the GitHub GraphQL API
     * @param query
     * @param variables
     */
    private async query<Response>(query: string, variables?: object): Promise<Response | undefined> {
        const cachedResponse = this.client.readQuery<Response>(query, variables)?.data;
        if (!cachedResponse) return (await this.client.query<Response>(query, variables))?.data;

        return cachedResponse;
    }


    /**
     * Gets the entirety of a user's code review history from GitHub
     * N.B. GitHub only seems to make the last 12 months worth of contributions available
     * @param login
     * @param fromDate
     * @param toDate
     */
    public async getUserCodeReviewData(login: string, fromDate?: Date, toDate?: Date): Promise<PullRequestReviewContributionsNodes[]> {
        const reviews: PullRequestReviewContributionsNodes[] = [];
        let hasNextPage = true;
        let endCursor = '';

        while (hasNextPage) {
            const after = endCursor ? `, after: "${endCursor}"` : '';
            const query = `
                query GetUserCodeReviewData ($login: String!) {
                    user(login: $login) {
                        id
                        login
                        contributionsCollection {
                            pullRequestReviewContributions(first:100, orderBy:{direction:DESC}${after}) {
                                nodes {
                                    pullRequest {
                                        title
                                        repository {
                                            name
                                        }
                                        author {
                                            login
                                        }
                                        createdAt
                                    }
                                    pullRequestReview {
                                        createdAt
                                        author {
                                            login
                                        }
                                    }
                                }
                                pageInfo {
                                    hasNextPage
                                    endCursor
                                }
                            }
                        }
                    }
                }`;

            // Get the next page of reviews
            const response = await this.query<UserCodeReviewDataResponse>(query, {login});
            const nodes = response?.user?.contributionsCollection?.pullRequestReviewContributions?.nodes;

            //If the first review is before the fromDate, break the loop

            //first review is the most recent one, so check if it after the toDate
            //if it is, only add reviews that are before the toDate and after the fromDate and break the loop
            if (nodes?.[0].pullRequestReview?.createdAt) {
                const latestReviewDate = new Date(nodes[0].pullRequestReview.createdAt);
                if (toDate && latestReviewDate > toDate) {
                    const relevantReviews = nodes.filter((review) => {
                            const reviewDate = new Date(review.pullRequestReview.createdAt);
                            return reviewDate <= toDate && (!fromDate || reviewDate >= fromDate);
                        }
                    );
                    reviews.push(...relevantReviews);
                    //if all reviews were not added, break the loop
                    if (relevantReviews.length !== nodes.length) break;
                }
            }

            //The last review is the oldest from this page, so check if it is before the fromDate
            // if it is, only add reviews that are before the fromDate and after the toDate and break the loop
            if (nodes?.[nodes.length - 1].pullRequestReview?.createdAt) {
                const lastReviewDate = new Date(nodes[nodes.length - 1].pullRequestReview.createdAt);
                if (fromDate && lastReviewDate < fromDate) {
                    const relevantReviews = nodes.filter((review) => {
                            const reviewDate = new Date(review.pullRequestReview.createdAt);
                            return (!toDate || reviewDate <= toDate) && reviewDate >= fromDate;
                        }
                    );
                    reviews.push(...relevantReviews);
                    //if all reviews were not added, break the loop
                    if (relevantReviews.length !== nodes.length) break;

                    // Update the pagination variables and continue
                    hasNextPage = !!response?.user?.contributionsCollection?.pullRequestReviewContributions?.pageInfo?.hasNextPage;
                    endCursor = response?.user?.contributionsCollection?.pullRequestReviewContributions?.pageInfo?.endCursor || '';
                    continue;
                }
            }

            // Update the pagination variables
            hasNextPage = !!response?.user?.contributionsCollection?.pullRequestReviewContributions?.pageInfo?.hasNextPage;
            endCursor = response?.user?.contributionsCollection?.pullRequestReviewContributions?.pageInfo?.endCursor || '';

            // Add the reviews to the list of reviews if they exist
            if (nodes) reviews.push(...nodes);
        }

        return reviews;
    }
}