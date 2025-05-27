export interface PageData {
    slug: string;
    title: {
        rendered: string
    };
    parent: number;
    id: number;
}

export interface PageDataInfo {
    id: number;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    slug: string;
    parent: number;
}