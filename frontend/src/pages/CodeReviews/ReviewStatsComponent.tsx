import React, {useEffect, useState} from "react";
import {ReviewStats} from "../../types/components";

interface ReviewStatsComponentProps {
    reviews: ReviewStats;
}

const ReviewStatsComponent: React.FC<ReviewStatsComponentProps> = ({reviews}) => {
    const [reviewsState, setReviews] = useState<any>(reviews);

    useEffect(() => {
        setReviews(reviews);
    }, [reviews]);

    return (
        <div>
            <h3>Code Review Stats</h3>
            <ul>
                {Object.keys(reviewsState).map((key: string) => (
                    <li key={key}>{key}: {JSON.stringify(reviewsState[key])}</li>
                ))}
            </ul>
        </div>
    );
}

export default ReviewStatsComponent;