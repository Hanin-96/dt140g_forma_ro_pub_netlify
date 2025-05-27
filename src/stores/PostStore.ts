import { makeAutoObservable, runInAction } from "mobx";
import { PostType } from "../types/PostType";

class PostStore {


    posts: PostType[] = [];
    allPosts: PostType[] = [];
    post: PostType | null = null;
    loading: boolean = false;
    error: string = "";
    postCategories: string[] = [];
    defaultCategory: string = "Alla inlägg"
    selectedCategory: string = this.defaultCategory;
    searchInput: string = "";



    constructor() {
        makeAutoObservable(this);
    }

    async getAllPosts(categoryId: number) {

        runInAction(() => {
            this.loading = true;
            this.error = "";
        });


        try {
            const response = await fetch(`http://localhost:8002/wp-json/forma_ro/v2/posts?category=${categoryId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("postdata: ", data);

                runInAction(() => {
                    this.allPosts = data;
                    this.postCategories = this.extractCategories(data);
                    this.posts = data;
                    this.loading = false;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.error = "Kunde inte hämta post inläggen.";
                this.loading = false;
            });
        } 

    }

    setSearchInput(value: string) {
        this.searchInput = value;
    }

    searchProduct() {
        console.log("searchInput: ", this.searchInput)
        //Kontrollerar om searchinput är tomt
        if (this.searchInput == "") {
            this.posts = this.allPosts;
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
        const searchedProducts = this.allPosts.filter((postItem) => {
            if (postItem.title.toLowerCase().includes(this.searchInput.toLowerCase())) {
                return true;
            }
            return false;
        });
        runInAction(() => {
            this.posts = searchedProducts;
        });

        // Nollställer pagineringen
        //this.setPage(1);
    }

    //hämtar produkter utifrån kategori
    setCategory(categoryName: string) {
        console.log("Kategori namn: ", categoryName);
        this.selectedCategory = categoryName;

        //Nollställer sökinput
        this.setSearchInput("");

        if (this.postCategories.includes(categoryName)) {
            console.log("Kategori finns")
            const filteredPosts = this.allPosts.filter((postItem) =>
                //Kontrollerar om kategorin på produkt stämmer överens med kategori som filtreras fram
                postItem.tags?.some(
                    (category: any) => category.name === categoryName
                )
            );

            runInAction(() => {
                this.posts = filteredPosts;
            });

        } else {
            console.log("Kategori finns inte")
            runInAction(() => {
                this.posts = this.allPosts;
            });
        }
        //Nollställer paginering
        //this.setPage(1);

    }

    //Extraherar unika kategorier
    extractCategories(posts: PostType[]): string[] {
        const list = posts.flatMap((p) =>
            p.tags?.map((c: any) => c.name) || []
        );
        return [...new Set(list)];
    }

    //Hämta specifik post från Id
    async getPostById(postId: string) {
        runInAction(() => {
            this.loading = true;
            this.error = "";
            this.post = null;
        });

        try {
            const response = await fetch(`http://localhost:8002/wp-json/forma_ro/v2/posts/${postId}`);

            if (response.ok) {
                const data = await response.json();
                console.log("post: ", data[0])
                runInAction(() => {
                    this.post = data[0];
                    this.loading = false;
                });
            }

        } catch (error) {
            runInAction(() => {
                this.error = "Kunde inte hämta post inläggen.";
                this.loading = false;
            });
        } 

    }
}

export const postStore = new PostStore();