import React, {useState} from "react";
import axios, {AxiosResponse} from "axios";
import {PullRequestReviewContributionsNodes} from "@github-app/shared/types/github-graphql";
import {millisecondsToDateTime, reviewsToAverageTimeToReview} from "../utils/dataTransformer";
import {DateTimeObj} from "@github-app/shared/types/data";
import {InputProps, ReviewStats} from "../types/components";

const UserFormComponent: React.FC<InputProps> = ({label, username, value, parentCallback}) => {
    const [inputs, setInputs] = useState<{ username: string }>({
        username: ''
    });
    const [reviewStats, setReviewStats] = useState<ReviewStats>({
        totalReviews: 0,
        averageTimeToReview: {} as DateTimeObj
    });

    /**
     * Handle the change event for the input
     * Set the input state
     * @param e
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    };

    /**
     * Handle the form submission
     * Make a request to the backend to get the code review stats
     * @param e
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response: AxiosResponse<PullRequestReviewContributionsNodes[]> = await axios.post('http://localhost:3003/api/github/code-reviews', inputs);
            const milliseconds = reviewsToAverageTimeToReview(response.data);

            console.log(response);
            setReviewStats({
                totalReviews: response.data.length,
                averageTimeToReview: millisecondsToDateTime(milliseconds)
            });
            console.log('reviewStats', reviewStats);
            parentCallback(reviewStats);
        } catch (e) {
            setReviewStats({
                    totalReviews: 0,
                    averageTimeToReview: {} as DateTimeObj
                }
            );
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor={username}>{label}</label>
            <input type="text" id={username} name={username} value={inputs.username} onChange={handleChange}/>
            <button type="submit">Submit</button>
        </form>
    );
}

export default UserFormComponent;