import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <main className="mx-auto flex min-h-[calc(100vh-3.75rem)] w-full max-w-6xl flex-col items-center justify-center px-4 py-12 text-center">
        <p className="text-8xl font-bold tracking-tight text-[#fee135]">404</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-3 text-base text-gray-600">
            The page you are looking for does not exist.
        </p>
        <Link
            to="/"
            className="mt-7 rounded-lg bg-[#fee135] px-6 py-3 font-semibold text-black transition-colors hover:bg-[#fcd700]"
        >
            Back to home
        </Link>
    </main>
);

export default NotFoundPage;
