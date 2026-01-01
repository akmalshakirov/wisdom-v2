import SearchInput from "../ui/searchInput/searchInput";

const HeaderHero = () => {
    return (
        <div className='max-h-dvh h-screen flex items-center justify-center container mx-auto px-4'>
            <div className='w-full max-w-4xl'>
                <h1
                    className='text-white font-extrabold mb-4 md:mb-6 
                       text-3xl md:text-5xl leading-tight text-center'>
                    Search words for free!
                </h1>

                <SearchInput />
            </div>
        </div>
    );
};

export default HeaderHero;
