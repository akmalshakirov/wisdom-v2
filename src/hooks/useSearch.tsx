import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { SearchResponse, WordItem } from "../types/type";

type Lang = "en" | "uz";

export function useSearch(query: string, lang: Lang) {
    const [data, setData] = useState<WordItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!query.trim()) {
            setData([]);
            return;
        }

        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await axios.get<SearchResponse>(
                    "https://api.wisdomedu.uz/api/catalogue/search",
                    {
                        params: {
                            page: 1,
                            per_page: 100,
                            search: query,
                            order: "desc",
                            short: 1,
                            type: lang,
                        },
                        signal: controller.signal,
                    }
                );

                setData(res.data.data);
            } catch (err) {
                if (axios.isCancel(err)) return;

                const error = err as AxiosError<any>;
                setError(
                    error.response?.data?.message ?? "Failed to fetch data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => controller.abort();
    }, [query, lang]);

    return { data, loading, error };
}
