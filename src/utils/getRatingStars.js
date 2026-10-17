export const getRatingStars = (voteAverage) => {
    const ratingOutOfFive = Math.round(voteAverage / 2);
    return '\u2605'.repeat(ratingOutOfFive) + '\u2606'.repeat(5 - ratingOutOfFive);
};
