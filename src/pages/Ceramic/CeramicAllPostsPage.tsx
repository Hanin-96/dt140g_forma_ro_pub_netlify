import { observer } from "mobx-react-lite"
import { postStore } from "../../stores/PostStore"
import { useEffect } from "react";
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import { ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";

const CeramicAllPostPage = observer(() => {
    const trimText = (htmlString: string, maxLength: number) => {
        //Skapa ett temporärt element för att rensa bort HTML-taggar
        const tmp = document.createElement("Div");
        tmp.innerHTML = htmlString;
        const text = tmp.textContent || tmp.innerText || "";

        //Trimma texten om den är för lång
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        } else {
            return text;
        }
    }


    //useEffect för att hämta in alla postinlägg
    useEffect(() => {
        postStore.getAllPosts(38);
    }, []);

    return (
        <>
            {postStore.loading && <div className={LoadingSpinnerStyle.loadingSpinner}></div>}
            {postStore.error && <p className="mx-auto max-w-[100rem] mt-4">{postStore.error}</p>}

            {!postStore.loading && !postStore.error && (
                <div className="mx-auto max-w-[100rem]">
                    <h1 className="mt-20 mb-16 text-center">Keramik inlägg</h1>

                    <div className="mb-10 flex gap-[10rem] justify-between m-2 p-4 rounded-2xl max-w-[100rem] border-[1px] border-forma_ro_grey">
                        <div className="w-full flex gap-4 items-center">
                            <label htmlFor="SortOptions" className="text-[16px]">Kategorier:</label>
                            <select name="sortOptions" id="sortOptions" className="w-full max-w-[50rem] text-[16px] cursor-pointer p-2 rounded-xl shadow-sm" onChange={(e) => postStore.setCategory(e.target.value)} value={postStore.selectedCategory}>
                                <option value={postStore.defaultCategory}>{postStore.defaultCategory}</option>
                                {postStore.postCategories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}

                            </select>
                        </div>

                        <div className="w-full flex gap-4 items-center">
                            <label htmlFor="searchInput" className="text-[16px] inline">Sök:</label>
                            <input type="text" name="searchInput" id="searchInput" className="text-[16px] max-w-[50rem] w-full p-2 shadow-sm rounded-xl"
                                placeholder="Skriv namn på produkt"
                                value={postStore.searchInput}
                                onChange={(e) => {
                                    postStore.setSearchInput(e.target.value);
                                    postStore.searchProduct();
                                }}
                            />
                        </div>
                    </div>
                    <div className="p-2 flex flex-wrap gap-8">
                        {postStore.posts.map(post => (
                            <Link key={post.id} to={`/keramik-inlagg/${post.id}`} className="hover:no-underline max-w-[100rem] w-full">
                                <article className="border-[1px] border-forma_ro_grey rounded-3xl hover:bg-forma_ro_red">
                                    <div className="flex justify-between">
                                        <div className="max-w-[40rem] w-full p-4 flex flex-col justify-between">
                                            <h4 className="text-[20px] font-semibold">{post.title}</h4>
                                            <p>{trimText(post.excerpt, 150)}</p>
                                            <button className="flex gap-1 text-[18px]">
                                                Läs mer <ChevronsRight className="color-forma_ro_black" />
                                            </button>
                                        </div>
                                        <img src={post.image} alt={post.image_alt} className="rounded-r-2xl max-w-[50rem] min-w-[50rem] min-h-[30rem] max-h-[30rem] w-full object-cover" />
                                    </div>

                                </article>
                            </Link>
                        ))}
                    </div>
                </div>

            )}
        </>
    )
})
export default CeramicAllPostPage