import axios from "axios";
import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import type { WordDetail } from "../../types/type";
import { speakWord } from "../../utils/speakWord";
import WordSkeleton from "./wordSkeleton";

const WordDetailPage = () => {
    const { id } = useParams();
    const [params] = useSearchParams();
    const lang = (params.get("lang") ?? "en") as "en" | "uz";
    const [data, setData] = useState<WordDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string })?.from;

    useEffect(() => {
        const fetchWord = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `https://api.wisdomedu.uz/api/word/${id}`,
                    { params: { lang } }
                );

                document.title = `Wisdom v2 - ${response.data?.word || "Word"}`;
                setData(response.data);
            } catch (err) {
                console.error("Error fetching word:", err);
                setError("So'zni yuklashda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchWord();
        }
    }, [id, lang]);

    const handleBack = () => {
        if (from) {
            navigate(from);
        } else {
            navigate(-1);
        }
    };

    if (loading) {
        return <WordSkeleton />;
    }

    // ✅ TO'G'RI tekshiruv - data obyekt, array emas!
    if (!data || error) {
        return (
            <div className='bg-primary h-screen flex flex-col gap-5 items-center justify-center'>
                <h1 className='text-4xl text-white font-bold'>
                    {error || "Hech narsa topilmadi!"}
                </h1>
                <div className='flex items-center justify-center gap-3'>
                    <button
                        onClick={handleBack}
                        className='flex items-center justify-center rounded-2xl py-3 bg-white cursor-pointer outline-none px-4 hover:bg-white/90 transition active:translate-y-1'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='18px'
                            viewBox='0 -960 960 960'
                            width='24px'
                            fill='#000'>
                            <path d='M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z' />
                        </svg>
                        Ortga
                    </button>
                    <p className='text-white'>yoki</p>
                    <button
                        onClick={() => window.location.reload()}
                        className='flex items-center justify-center rounded-2xl py-3 bg-white cursor-pointer outline-none px-4 hover:bg-white/90 transition active:translate-y-1'>
                        Yangilash
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-primary min-h-screen flex items-center justify-center'>
            <div className='container max-w-3xl mx-auto px-4 py-10'>
                <button
                    onClick={handleBack}
                    className='flex w-full items-center justify-center rounded-2xl py-3 bg-white mb-4 cursor-pointer outline-none px-4 hover:bg-white/90 transition active:translate-y-1'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='18px'
                        viewBox='0 -960 960 960'
                        width='24px'
                        fill='#000'>
                        <path d='M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z' />
                    </svg>
                    Ortga
                </button>

                <div className='bg-white rounded-3xl shadow-xl p-6'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-4xl font-bold text-gray-800'>
                            {data.word}
                        </h1>

                        <button
                            onClick={() => speakWord(data.word, lang)}
                            className='flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:opacity-90 transition cursor-pointer active:translate-y-1'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                height='24px'
                                viewBox='0 -960 960 960'
                                width='24px'
                                fill='#fff'>
                                <path d='M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z' />
                            </svg>
                            Tinglash
                        </button>
                    </div>

                    <p className='mt-2 text-gray-500'>
                        {data.word_class_body}
                        <span className='ml-2 px-2 py-1 bg-primary text-white font-semibold rounded'>
                            {data.word_class?.class ?? "—"}
                        </span>
                    </p>
                </div>

                {data.words_uz && data.words_uz.length > 0 && (
                    <section className='mt-6 bg-white rounded-2xl shadow p-6'>
                        <h2 className='text-xl font-semibold mb-3'>Tarjima</h2>
                        <ul className='flex flex-wrap gap-2'>
                            {data.words_uz.map((w) => (
                                <li
                                    key={w.id}
                                    className='px-3 py-1 bg-gray-100 rounded-full'>
                                    {w.word}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {data.examples && (
                    <section className='mt-6 bg-white rounded-2xl shadow p-6'>
                        <h2 className='text-xl font-semibold mb-3'>Misollar</h2>
                        <div
                            className='space-y-3 text-gray-700'
                            dangerouslySetInnerHTML={{
                                __html: data.examples,
                            }}
                        />
                    </section>
                )}
            </div>
        </div>
    );
};

export default WordDetailPage;
