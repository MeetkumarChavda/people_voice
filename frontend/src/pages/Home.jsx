import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <>
            <Helmet>
                <title>Home | People Voice</title>
                <meta name="description" content="Welcome to People Voice - Share your voice and connect with others" />
            </Helmet>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">Welcome to People Voice</h1>
                <p className="text-lg text-gray-600">
                    Share your thoughts, connect with others, and make your voice heard.
                </p>
            </div>
        </>
    );
};

export default Home; 