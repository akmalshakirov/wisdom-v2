import { type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";
import { useSearch } from "../../../hooks/useSearch";
import SearchResultItem from "../searchResultItem";

const SearchInput = () => {
    const [params, setParams] = useSearchParams();

    const query = params.get("q") ?? "";
    const lang = (params.get("lang") ?? "en") as "en" | "uz";

    const debouncedQuery = useDebounce(query, 500);
    const { data, loading, error } = useSearch(debouncedQuery, lang);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setParams({
            q: e.target.value,
            lang,
        });
    };

    const onLangChange = (newLang: "en" | "uz") => {
        setParams({
            q: query,
            lang: newLang,
        });
    };

    return (
        <label className='w-full max-w-3xl mx-auto px-4'>
            <div className='bg-white rounded-2xl shadow-xl p-3 flex gap-3'>
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
                    type='text'
                    value={query}
                    onChange={onInputChange}
                    placeholder='Search words...'
                    autoComplete='off'
                    autoFocus
                    name='word'
                    className='flex-1 px-4 py-3 pl-0 focus:outline-none'
                />

                <div className='flex gap-2'>
                    {(["en", "uz"] as const).map((l) => (
                        <button
                            key={l}
                            onClick={() => onLangChange(l)}
                            className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${
                                l === lang
                                    ? "bg-primary text-white"
                                    : "bg-gray-200"
                            }`}>
                            {l.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <p className='mt-4 text-center text-white'>Searching...</p>
            )}

            {error && <p className='mt-4 text-center text-red-600'>{error}</p>}

            {!loading && data.length === 0 && debouncedQuery && (
                <p className='mt-4 text-center'>No results found</p>
            )}

            {!loading && data.length > 0 && (
                <div className='mt-5 p-2 bg-white rounded-xl shadow max-h-[60vh] overflow-y-auto'>
                    {data.map((item) => (
                        <SearchResultItem
                            key={item.id}
                            item={item}
                            lang={lang}
                        />
                    ))}
                </div>
            )}
        </label>
    );
};

export default SearchInput;
