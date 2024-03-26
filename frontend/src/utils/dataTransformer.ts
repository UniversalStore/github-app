import {PullRequestReviewContributionsNodes} from "@github-app/shared/types/github-graphql";
import {DateTimeObj} from "@github-app/shared/types/data";

// Initialize variables
const millisecondsPerDay = 1000 * 60 * 60 * 24;
const millisecondsPerHour = 1000 * 60 * 60;
const millisecondsPerMinute = 1000 * 60;
const millisecondsPerSecond = 1000;

/**
 * Calculate the average time to review a pull request
 * @param data
 */
export function reviewsToAverageTimeToReview(data: PullRequestReviewContributionsNodes[]) {

    const totalTimeToReview = data.reduce((acc: number, review: PullRequestReviewContributionsNodes) => {
        return acc + businessDaysTimeDifference(new Date(review.pullRequest.createdAt), new Date(review.pullRequestReview.createdAt));
    }, 0);

    return totalTimeToReview / data.length;
}

/**
 * Calculate the time difference in milliseconds between two dates, excluding weekends
 * @param startDate
 * @param endDate
 */
function businessDaysTimeDifference(startDate: Date, endDate: Date) {
    // Calculate total days between the two dates
    const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / millisecondsPerDay);

    // Calculate total weekends (Saturdays and Sundays) within the date range
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();
    const totalWeekends = Math.floor((totalDays + startDay) / 7) * 2;
    const partialWeekendsAtStart = startDay === 0 ? 1 : (startDay >= 6 ? 2 : 0);
    const partialWeekendsAtEnd = endDay >= 6 ? 1 : 0;
    const weekendsWithinRange = totalWeekends - partialWeekendsAtStart - partialWeekendsAtEnd;

    // Calculate time difference in milliseconds, excluding weekends
    return (totalDays * millisecondsPerDay - weekendsWithinRange * millisecondsPerDay) +
        (endDate.getHours() * millisecondsPerHour + endDate.getMinutes() * millisecondsPerMinute +
            endDate.getSeconds() * millisecondsPerSecond) -
        (startDate.getHours() * millisecondsPerHour + startDate.getMinutes() * millisecondsPerMinute +
            startDate.getSeconds() * millisecondsPerSecond);
}

/**
 * Convert milliseconds to a DateTime object
 * @param milliseconds
 */
export function millisecondsToDateTime(milliseconds: number): DateTimeObj {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return {days, hours, minutes, seconds};
}

/**
 * Convert a DateTime object to milliseconds
 * @param dateTime
 */
export function dateTimeToMilliseconds(dateTime: DateTimeObj): number {
    return dateTime.days * 1000 * 60 * 60 * 24 +
        dateTime.hours * 1000 * 60 * 60 +
        dateTime.minutes * 1000 * 60 +
        dateTime.seconds * 1000;
}

/**
 * Convert a DateTime object to a string
 * @param dateTime
 */
export function dateTimeToString(dateTime: DateTimeObj): string {
    return `${dateTime.days} days, ${dateTime.hours} hours, ${dateTime.minutes} minutes, ${dateTime.seconds} seconds`;
}