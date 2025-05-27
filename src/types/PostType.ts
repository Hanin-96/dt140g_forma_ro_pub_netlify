export interface PostType {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    image: string;
    image_alt: string;
    tags: PostTags[];
    date: Date;
}

export interface PostTags {
    id: number;
    name: string;
    slug: string;
}