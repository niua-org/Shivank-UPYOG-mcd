import React from "react";
import { Rating } from "@nudmcdgnpm/digit-ui-react-components";

const StarRated = ({ text, rating }) => <Rating text={text} withText={true} currentRating={rating} maxRating={5} onFeedback={() => {}} />;

export default StarRated;
