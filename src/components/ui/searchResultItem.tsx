import { Link } from "react-router-dom";
import type { WordItem } from "../../types/type";

interface Props {
    item: WordItem;
    lang: "en" | "uz";
}

const SearchResultItem = ({ item, lang }: Props) => {
    return (
        <Link
            to={`/word/${item?.id}?lang=${lang}`}
            className='block p-4 hover:bg-gray-200 transition rounded-xl'>
            <div className='flex items-center gap-3'>
                <h3 className='text-lg font-semibold'>{item?.word}</h3>
                <span className='text-xs bg-primary text-white font-semibold px-2 py-1 rounded'>
                    {item.word_class?.class ?? "—"}
                </span>
            </div>

            <p className='text-gray-600 mt-2'>{item?.translation.join(", ")}</p>
        </Link>
    );
};

export default SearchResultItem;
