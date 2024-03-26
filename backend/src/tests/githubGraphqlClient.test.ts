import {GithubGraphqlClient} from "../classes/githubGraphqlClient";

describe('All githubGraphqlClient.test.ts tests', () => {
    beforeAll(() => {
        process.env.GITHUB_ACCESS_TOKEN = "ghp_testtoken1234";
    });
    describe('Unit', () => {
        test('Test mocked getUserCodeReviewData method', async () => {
            const client = GithubGraphqlClient.getInstance();
            const reviews = await client.getUserCodeReviewData('testuser');
            expect(reviews).toEqual(expect.any(Array));
        }, 10000);
        test('Singleton GitHubGraphqlClient should return an instance of GitHubGraphqlClient', () => {
            const instance = GithubGraphqlClient.getInstance();
            expect(instance).toBeInstanceOf(GithubGraphqlClient);
        });
    });
    describe('Integration', () => {
        test('Singleton GitHubGraphqlClient should return the same instance', () => {
            const firstInstance = GithubGraphqlClient.getInstance();
            const secondInstance = GithubGraphqlClient.getInstance();
            expect(firstInstance).toBe(secondInstance);
        });
    });
});