import { useEffect, useState } from 'react'
import LoadingSpinnerStyle from '../LoadingSpinner/LoadingSpinnerStyle.module.css';
import parse from 'html-react-parser';
//import doshaPostsStyle from './DoshaPosts.module.css'
import { DoshaType } from '../../types/DoshaQuiz';
import { ChevronDown } from 'lucide-react';

function DoshaPostsQuiz() {

    const [doshaPosts, setDoshaPosts] = useState<DoshaType[]>([]);
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [error, setError] = useState("");



    const getDoshaPagePosts = async () => {
        setLoadingSpinner(true);
        try {
            const response = await fetch("http://localhost:8002/wp-json/wp/v2/posts?categories=42&_fields=id,title,content", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                console.log(data[0].content.rendered);

                if (data.length > 0) {
                    setDoshaPosts(data);
                    sessionStorage.setItem("doshaPostsData", JSON.stringify(data));
                    setLoadingSpinner(false);
                    console.log("Dosha inlägg content:", doshaPosts);

                } else {
                    setError("Ingen information i Om sidan är tillgänglig");
                }
            }
        } catch (error) {
            setError("Kunde inte ladda Om sidans innehåll.");
        } finally {
            setLoadingSpinner(false);
        }
    }

    //useEffect för att hämta in Om sida innehåll
    useEffect(() => {
        const cachedDoshaPosts = sessionStorage.getItem("doshaPostsData");
        if (cachedDoshaPosts) {
            setDoshaPosts(JSON.parse(cachedDoshaPosts));
            return;
        }
        getDoshaPagePosts();
    }, []);

    return (
        <>
            {loadingSpinner &&
                <div className={LoadingSpinnerStyle.loadingSpinner}></div>
            }



            {error &&
                <p>{error}</p>
            }
            {doshaPosts && doshaPosts.length > 0 &&
                <div>
                    {doshaPosts && doshaPosts.map((post: DoshaType) =>

                        <div
                            key={post.id}
                            className={post.title.rendered.toLowerCase().includes("kapha") ? "bg-forma_ro_orange p-4 mb-8 rounded-2xl" : post.title.rendered.toLowerCase().includes("pita") ? "bg-forma_ro_blue p-4 text-white mb-8 rounded-2xl" : post.title.rendered.toLowerCase().includes("vata") ? "bg-forma_ro_green p-4 mb-8 rounded-2xl" : ""}
                        >
                            <div className='flex justify-between'>
                                <h3>{post.title.rendered}</h3>
                                <ChevronDown />
                            </div>
                            {parse(post.content.rendered)}</div>
                    )}
                </div>
            }



        </>
    );
}


export default DoshaPostsQuiz