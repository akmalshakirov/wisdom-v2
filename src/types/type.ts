export interface WordClass {
    id: number;
    class: string;
}

export interface WordItem {
    id: number;
    word: string;
    word_class: WordClass | null;
    translation: string[];
}

export interface SearchResponse {
    data: WordItem[];
    message: string;
    meta: {
        total_items: number;
        per_page: number;
        current_page: number;
        pages: number;
    };
}

export interface WordDetail {
    id: number;
    word: string;
    example: string | null;
    examples: string | null;
    word_class: {
        id: number;
        class: string;
    };
    word_class_body: string | null;
    words_uz: {
        id: number;
        word: string;
        example: string | null;
    }[];
}
