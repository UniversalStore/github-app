import {DateTimeObj} from "@github-app/shared/types/data";

export interface InputProps {
    label: string
    username: string
    value: string,
    parentCallback: (newState: any) => void
}

export interface ReviewStats {
    totalReviews: number,
    averageTimeToReview: DateTimeObj
}
