import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { WordDetail } from "../../types/type";
import { speakWord } from "../../utils/speakWord";
import WordSkeleton from "./wordSkeleton";

const WordDetailPage = () => {
    const { id } = useParams();
    const [params] = useSearchParams();
    const lang = (params.get("lang") ?? "en") as "en" | "uz";

    const [data, setData] = useState<WordDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWord = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(
                    `https://api.wisdomedu.uz/api/word/${id}`,
                    { params: { lang } }
                );

                setData(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchWord();
    }, [id, lang]);

    if (loading) {
        return <WordSkeleton />;
    }

    if (!data) return <>Nothing not found!</>;

    return (
        <div className='max-w-3xl mx-auto px-4 py-10'>
            <Link
                to={"/"}
                className='flex items-center justify-center rounded-lg p-2 bg-primary mb-4 cursor-pointer text-white outline-none px-4'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='18px'
                    viewBox='0 -960 960 960'
                    width='24px'
                    fill='#fff'>
                    <path d='M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z' />
                </svg>
                Back
            </Link>
            <div className='bg-white rounded-3xl shadow-xl p-6'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-4xl font-bold text-gray-800'>
                        {data.word}
                    </h1>

                    <button
                        onClick={() => speakWord(data.word, lang)}
                        className='flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:opacity-90 transition cursor-pointer'>
                        🔊 Listen
                    </button>
                </div>

                <p className='mt-2 text-gray-500'>
                    {data.word_class_body}
                    <span className='ml-2 px-2 py-1 bg-primary text-white font-semibold rounded'>
                        {data.word_class.class}
                    </span>
                </p>
            </div>

            {data.words_uz.length > 0 && (
                <section className='mt-6 bg-white rounded-2xl shadow p-6'>
                    <h2 className='text-xl font-semibold mb-3'>Translation</h2>
                    <ul className='flex flex-wrap gap-2'>
                        {data.words_uz.map((w) => (
                            <li
                                key={w.id}
                                className='px-3 py-1 bg-gray-100 rounded-full text-sm'>
                                {w.word}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {data.examples && (
                <section className='mt-6 bg-white rounded-2xl shadow p-6'>
                    <h2 className='text-xl font-semibold mb-3'>Examples</h2>
                    <div
                        className='space-y-3 text-gray-700'
                        dangerouslySetInnerHTML={{
                            __html: data.examples,
                        }}
                    />
                </section>
            )}
        </div>
    );
};

export default WordDetailPage;
