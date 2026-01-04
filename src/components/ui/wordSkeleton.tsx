const WordSkeleton = () => {
    return (
        <div className='bg-primary h-screen flex items-center justify-center'>
            <div className='flex-1 max-w-3xl mx-auto px-4 py-10 animate-pulse'>
                <div className='h-12 bg-gray-200 rounded-3xl mb-6' />
                <div className='h-25 bg-gray-200 rounded-3xl mb-6' />
                <div className='h-33 bg-gray-200 rounded-2xl mb-6' />
                <div className='h-49 bg-gray-200 rounded-2xl' />
            </div>
        </div>
    );
};

export default WordSkeleton;
