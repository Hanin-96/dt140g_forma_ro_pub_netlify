import { makeAutoObservable, runInAction } from "mobx";
import { ProductData } from "../types/Product";

class ProductStore {
    //Cache produkter
    productCache = new Map<string, ProductData>();
    productsGalleryCache = new Map<string, ProductData[]>();
    products: ProductData[] = [];
    allProducts: ProductData[] = [];
    productCategories: string[] = [];
    loading: boolean = false;
    error: string = "";
    currentPage = 1;
    productsPerPage = 9;
    product: ProductData | null = null;
    searchInput: string = "";
    defaultCategory: string = "Alla produkter"
    selectedCategory: string = this.defaultCategory;

    constructor() {
        makeAutoObservable(this);
    }

    setSearchInput(value: string) {
        this.searchInput = value;
    }

    searchProduct() {
        //console.log("searchInput: ", this.searchInput)
        //Kontrollerar om searchinput är tomt
        if (this.searchInput == "") {
            this.products = this.allProducts;
            this.selectedCategory = this.defaultCategory;
            return;
        }
        //Kontrollerar om searchinput är mindre än tre tecken
        if (this.searchInput.length < 3) {
            //Returnerar om den är mindre än 3 tecken
            return;
        }
        //Nollställer kategorin till alla produkter
        this.selectedCategory = this.defaultCategory;

        //Filtrerar fram produkter baserad på titel på produkt
        const searchedProducts = this.allProducts.filter((productItem) => {
            if (productItem.title.rendered.toLowerCase().includes(this.searchInput.toLowerCase())) {
                return true;
            }
            return false;
        });
        this.products = searchedProducts;
        // Nollställer pagineringen
        this.setPage(1);
    }

    //hämtar produkter utifrån kategori
    setCategory(categoryName: string) {
        //console.log("Kategori namn: ", categoryName);
        this.selectedCategory = categoryName;

        //Nollställer sökinput
        this.setSearchInput("");

        if (this.productCategories.includes(categoryName)) {
            //console.log("Kategori finns")
            const filteredProducts = this.allProducts.filter((productItem) =>
                //Kontrollerar om kategorin på produkt stämmer överens med kategori som filtreras fram
                productItem.product_category?.some(
                    (category: any) => category.name === categoryName
                )
            );

            this.products = filteredProducts;

        } else {
            //console.log("Kategori finns inte")
            this.products = this.allProducts;
        }
        //Nollställer paginering
        this.setPage(1);

    }

    //Hämtar alla keramik produkter
    async getCeramicProducts(productId = "") {
        //Om alla produkter redan har hämtats, returnera filtrerad data
        if (this.allProducts.length > 0) {
            //Om produkter har hämtats, exkludera aktuell produkt från senaste
            let filteredData = this.excludeCurrentProduct(productId, this.allProducts);

            //Sortera produkt data efter senaste datum
            if (filteredData) {
                const sortedData = filteredData.sort(
                    (a: { date: string }, b: { date: string }) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                this.products = sortedData
            }
            return;
        }

        if (this.productsGalleryCache.has(productId)) {
            this.products = this.productsGalleryCache.get(productId) || [];
            return;
        }

        this.loading = true;
        this.error = "";
        try {
            const response = await fetch(
                "http://localhost:8002/wp-json/wp/v2/product?_fields=title,product_price,product_description,product_thumbnail,product_thumbnail_alt,id,date,product_category",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                let filteredData = data;
                this.allProducts = data;
                if (productId && productId !== "") {
                    this.productsGalleryCache.set(productId, data);
                }

                //console.log("filtered id: ", productId)
                //console.log("Produkt: ", this.allProducts)

                filteredData = this.excludeCurrentProduct(productId, filteredData);

                const sortedData = filteredData.sort(
                    (a: { date: string }, b: { date: string }) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                const uniqueCategories = this.extractCategories(sortedData);

                runInAction(() => {
                    this.products = sortedData;
                    this.productCategories = uniqueCategories;
                    this.loading = false;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.error = "Kunde inte hämta produkter.";
                this.loading = false;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    excludeCurrentProduct(productId: string, filteredData: any[]) {
        if (productId && productId != "") {

            return filteredData.filter((item: { id: number }) => item.id.toString() !== productId);
        }
        //returnera samma data om productId är satt
        return filteredData;
    }

    //Hämtar produkt utifrån produkt Id
    async getProductById(productId: string) {

        if (this.productCache.has(productId)) {
            this.product = this.productCache.get(productId) || null;
            return;
        }
        this.loading = true;
        this.error = "";
        this.product = null;


        try {
            const response = await fetch(`http://localhost:8002/wp-json/wp/v2/product/${productId}`);

            if (response.ok) {
                const data = await response.json();
                runInAction(() => {
                    this.product = data;
                    this.productCache.set(productId, data);
                    this.loading = false;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.error = "Kunde inte hämta produkten.";
                this.loading = false;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    //Extraherar unika kategorier
    extractCategories(products: ProductData[]): string[] {
        const list = products.flatMap((p) =>
            p.product_category?.map((c: any) => c.name) || []
        );
        return [...new Set(list)];
    }

    get UniqueCategories(): string[] {
        return this.extractCategories(this.products);
    }

    //Paginering
    get paginatedProducts() {
        const indexOfLastProduct = this.currentPage * this.productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - this.productsPerPage;
        return this.products.slice(indexOfFirstProduct, indexOfLastProduct);
    }

    setPage(page: number) {
        this.currentPage = page;
    }
}


export const productStore = new ProductStore();
