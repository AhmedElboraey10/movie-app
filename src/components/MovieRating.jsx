export const MovieRating = ({ movie }) => {
    if (!movie.vote_count) return null;

    const rating = Math.round(movie.vote_average * 10);
    const ratingColor =
        rating < 40 ? '#ef4444'
        : rating < 60 ? '#f97316'
        : rating < 75 ? '#eab308'
        : '#00dc89';

    return (
        <span
            className="absolute -bottom-5 left-3 z-20 grid size-10 place-items-center rounded-full p-0.75 shadow-lg"
            style={{ background: `conic-gradient(${ratingColor} ${rating}%, #3f4b53 0)` }}
        >
            <span className="grid size-full place-items-center rounded-full bg-[#101820] text-[10px] font-extrabold leading-none text-white">
                {rating}%
            </span>
        </span>
    );
};
