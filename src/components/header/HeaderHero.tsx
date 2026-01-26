import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchInput from "../ui/searchInput/searchInput";

const HeaderHero = () => {
    const [params] = useSearchParams();
    const query = params.get("q");

    const [centered, setCentered] = useState(!query || query === "");

    useEffect(() => {
        setCentered(!query || query === "");
    }, [query]);

    return (
        <div
            className={`bg-primary min-h-dvh flex items-center flex-col transition-all duration-300 ${
                centered ? "pt-[30vh]" : "pt-[15vh]"
            }`}>
            <div className='w-full'>
                <h1 className='text-white font-extrabold text-3xl md:text-5xl leading-tight text-center'>
                    Search words for free!
                </h1>
                <h2 className='text-white mb-4 md:mb-6 text-center mt-2'>
                    Source:{" "}
                    <a href='https://wisdomlugati.uz' className='underline'>
                        Wisdom lug'ati
                    </a>
                </h2>

                <SearchInput />
            </div>
        </div>
    );
};

export default HeaderHero;
