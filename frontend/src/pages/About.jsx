import { Helmet } from 'react-helmet-async';

const About = () => {
    return (
        <>
            <Helmet>
                <title>About | People Voice</title>
                <meta name="description" content="Learn about People Voice - Our mission, vision, and the team behind the platform" />
            </Helmet>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">About People Voice</h1>
                <div className="prose lg:prose-xl">
                    <p className="text-lg text-gray-600 mb-4">
                        People Voice is a platform dedicated to connecting people and amplifying their voices.
                        We believe in the power of community and shared experiences.
                    </p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
                    <p className="text-gray-600 mb-4">
                        To create a space where every voice matters and every story can be heard.
                    </p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Our Vision</h2>
                    <p className="text-gray-600">
                        Building a global community where ideas flow freely and connections are meaningful.
                    </p>
                </div>
            </div>
        </>
    );
};

export default About; 