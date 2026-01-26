import { AnimatePresence, motion } from "motion/react";
import {
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo,
    type ChangeEvent,
} from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";
import { useSearch } from "../../../hooks/useSearch";
import SearchResultItem from "../searchResultItem";

const SearchInput = () => {
    const [params, setParams] = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);

    const urlQuery = params.get("q") ?? "";
    const lang = (params.get("lang") ?? "en") as "en" | "uz";

    const [localQuery, setLocalQuery] = useState(urlQuery);

    useEffect(() => {
        setLocalQuery(urlQuery);
    }, [urlQuery]);

    const debouncedSearchQuery = useDebounce(localQuery, 150);
    const debouncedUrlQuery = useDebounce(localQuery, 500);

    useEffect(() => {
        if (debouncedUrlQuery !== urlQuery) {
            setParams({ q: debouncedUrlQuery, lang }, { replace: true });
        }
        document.title = "Wisdom v2";
    }, [debouncedUrlQuery, lang, urlQuery, setParams]);

    const { data, loading, error } = useSearch(debouncedSearchQuery, lang);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/" && document.activeElement !== inputRef.current) {
                e.preventDefault();
                inputRef.current?.focus();
            }

            if (
                e.key === "Escape" &&
                document.activeElement === inputRef.current
            ) {
                setLocalQuery("");
                inputRef.current?.blur();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setLocalQuery(e.target.value);
    }, []);

    const onLangChange = useCallback(
        (newLang: "en" | "uz") => {
            setParams({ q: localQuery, lang: newLang }, { replace: true });
        },
        [localQuery, setParams],
    );

    const hasResults = useMemo(() => data && data.length > 0, [data]);
    const hasQuery = useMemo(
        () => debouncedSearchQuery.trim().length > 0,
        [debouncedSearchQuery],
    );

    const StatusDisplay = useMemo(() => {
        if (loading) {
            return (
                <div className='flex items-center gap-3'>
                    <div className='w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin' />
                    <p className='text-gray-600'>Searching...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className='text-red-500'>
                    <svg
                        className='w-12 h-12 mx-auto mb-3'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                    </svg>
                    <p className='font-medium'>Something went wrong!</p>
                    <p className='text-sm mt-1'>{error}</p>
                </div>
            );
        }

        if (hasQuery && !loading && data !== null && data.length === 0) {
            return (
                <div className='text-gray-500'>
                    <svg
                        className='w-12 h-12 mx-auto mb-3 text-gray-300'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                    </svg>
                    <p className='font-medium'>Nothing found!</p>
                    <p className='text-sm mt-1'>Search for another word.</p>
                </div>
            );
        }

        return (
            <div className='text-gray-500'>
                <svg
                    className='w-12 h-12 mx-auto mb-3 text-gray-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                </svg>
                <p className='font-medium'>Start searching.</p>
                <p className='text-sm mt-1'>The results will appear here.</p>
            </div>
        );
    }, [loading, error, hasQuery, data]);

    return (
        <div className='w-full max-w-3xl mx-auto px-4'>
            <div className='bg-white rounded-2xl shadow-xl p-3 flex gap-3 transition-all hover:shadow-2xl'>
                <span className='flex items-center justify-center pl-1'>
                    <svg
                        className='size-7 text-gray-400 pointer-events-none'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                        />
                    </svg>
                </span>

                <input
                    ref={inputRef}
                    value={localQuery}
                    onChange={onInputChange}
                    placeholder='Hit "/" to focus and search'
                    autoComplete='off'
                    autoFocus
                    name='word'
                    className='flex-1 px-4 py-3 pl-0 focus:outline-none text-gray-800 placeholder:text-gray-400'
                />

                <button
                    className='border rounded-lg border-gray-500/50 px-3 cursor-pointer outline-none *:stroke-[#227680] focus:bg-primary focus:*:stroke-white transition not-focus:hover:bg-gray-400/20'
                    onClick={() => setLocalQuery("")}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-x-icon lucide-x'>
                        <path d='M18 6 6 18' />
                        <path d='m6 6 12 12' />
                    </svg>
                </button>

                <div className='flex gap-2'>
                    {(["en", "uz"] as const).map((l) => (
                        <button
                            key={l}
                            onClick={() => onLangChange(l)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer outline-none focus:ring-2 focus:ring-primary transition-all ${
                                l === lang
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}>
                            {l.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode='wait'>
                {!hasResults ? (
                    <motion.div
                        key='empty'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className='flex items-center gap-2 justify-center text-center bg-white rounded-2xl mt-4 p-8 shadow-md'>
                        {StatusDisplay}
                    </motion.div>
                ) : (
                    <motion.div
                        key='results'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className='mt-4 bg-white rounded-2xl shadow-lg max-h-[60vh] overflow-y-auto'>
                        {data.map((item, index) => (
                            <motion.div
                                key={item.id * item.id + index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: index * 0.03,
                                    duration: 0.3,
                                }}>
                                <SearchResultItem item={item} lang={lang} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchInput;
