import Spinner from './Spinner';

const LoadingContainer = ({ fullScreen = false, text = 'Loading...' }) => {
    const containerClasses = fullScreen
        ? 'fixed inset-0 bg-white bg-opacity-80 z-50'
        : 'w-full';

    return (
        <div className={`${containerClasses} flex flex-col items-center justify-center min-h-[200px]`}>
            <Spinner size="lg" />
            {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
        </div>
    );
};

export default LoadingContainer; 