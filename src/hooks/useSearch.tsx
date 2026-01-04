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
            setError("");
            return;
        }

        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const params = {
                    page: 1,
                    per_page: 100,
                    search: query,
                    order: "desc" as const,
                    short: 1,
                    ...(lang === "en" ? { type: lang } : { section: "uz" }),
                };

                const res = await axios.get<SearchResponse>(
                    "https://api.wisdomedu.uz/api/catalogue/search",
                    { params, signal: controller.signal }
                );

                setData(res.data.data);
            } catch (err) {
                if (axios.isCancel(err)) return;

                const axiosError = err as AxiosError<{ message?: string }>;
                setError(
                    axiosError.response?.data?.message ?? "Failed to fetch data"
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
