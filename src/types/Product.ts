 export interface ProductCategory {
    term_id: number;
    name: string;
    slug: string;
}

export interface ProductData {
    id: number;
    title: {
        rendered: string
    };
    product_category: ProductCategory[];
    product_price: string;
    product_description: string;
    product_measurement: string;
    product_thumbnail: string;
    product_thumbnail_alt: string;
}