import {dateTimeToMilliseconds, millisecondsToDateTime, reviewsToAverageTimeToReview} from "../utils/dataTransformer";
import {PullRequestReviewContributionsNodes} from "@github-app/shared/types/github-graphql";

describe('All dataTransformer.test.ts tests', () => {
    describe('Unit', () => {
        test('Test reviewsToAverageTimeToReview returns the same time for a PR opened on Friday and resolved at the same time on Monday and a PR opened on Monday and resolved at the same time on Tuesday', async () => {
            // Arrange
            const dataOpenedFri = [
                {
                    pullRequestReview: {createdAt: '2024-03-26 14:20:00'},
                    pullRequest: {createdAt: '2024-03-25 15:20:00'}
                }
            ] as unknown as PullRequestReviewContributionsNodes[];

            const dataOpenedMon = [
                {
                    pullRequestReview: {createdAt: '2024-03-25 14:20:00'},
                    pullRequest: {createdAt: '2024-03-22 15:20:00'}
                }
            ] as unknown as PullRequestReviewContributionsNodes[];

            // Act
            const timeToReviewFri = reviewsToAverageTimeToReview(dataOpenedFri);
            const timeToReviewMon = reviewsToAverageTimeToReview(dataOpenedMon);

            // Assert
            expect(timeToReviewFri).toEqual(timeToReviewMon);

        });
        test('Test reviewsToAverageTimeToReview returns the correct time for a PR opened on Wednesday, and resolved on a Thursday two weeks later', async () => {
            // Arrange
            const data = [
                {
                    pullRequestReview: {createdAt: '2024-03-28 15:20:00'},
                    pullRequest: {createdAt: '2024-03-13 14:20:00'}
                }
            ] as unknown as PullRequestReviewContributionsNodes[];

            // Act
            const timeToReview = reviewsToAverageTimeToReview(data);

            // Assert
            expect(timeToReview).toEqual(dateTimeToMilliseconds({
                days: 11,
                hours: 1,
                minutes: 0,
                seconds: 0
            }));
        });
    });
});