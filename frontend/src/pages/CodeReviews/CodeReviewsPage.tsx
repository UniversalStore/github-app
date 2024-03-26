import React from "react";
import UserFormComponent from "../../components/UserFormComponent";
import ReviewStatsComponent from "./ReviewStatsComponent";

const CodeReviewsPage: React.FC = () => {
    const [reviews, setReviews] = React.useState<any>({});
    /**
     * Set the code review stats for the user
     * @param reviewStats
     */
    const setReviewStats = (reviewStats: any) => {
        console.log(reviewStats);
        setReviews(reviewStats);
    }

return (
        <div>
            <h2>Code Reviews</h2>
            <p>Code reviews are a great way to ensure code quality and share knowledge among team members.</p>
            <UserFormComponent label="Enter a username to see code review stats" username="username" value="" parentCallback={setReviewStats} />
            <ReviewStatsComponent reviews={reviews}/>
        </div>
    );
};

export default CodeReviewsPage;