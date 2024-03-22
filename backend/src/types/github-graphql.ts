export interface UserCodeReviewDataResponse {
   user: User;
}

interface User {
   id: string;
   login: string;
   contributionsCollection: ContributionsCollection;
}

interface ContributionsCollection {
   pullRequestReviewContributions: PullRequestReviewContributions;
}

interface PullRequestReviewContributions {
   nodes: PullRequestReviewContributionsNodes[];
   pageInfo: PageInfo;
}

interface PageInfo {
   hasNextPage: boolean;
   endCursor: string;
}

export interface PullRequestReviewContributionsNodes {
   pullRequest: PullRequest;
   pullRequestReview: PullRequestReview;
}

interface PullRequest {
   title: string;
   repository: Repository;
   author: Author;
   createdAt: string;
}

interface Repository {
   name: string;
}

interface Author {
   login: string;
}

interface PullRequestReview {
   createdAt: string;
}