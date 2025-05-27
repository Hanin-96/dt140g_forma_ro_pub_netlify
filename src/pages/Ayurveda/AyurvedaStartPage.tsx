import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import { useEffect, useState } from "react";
import parse from 'html-react-parser';
import { Link } from "react-router-dom";
import AyurvedaStyle from './AyurvedaStyle.module.css';
import { PageDataInfo } from '../../types/PageData';

//postStore
import { observer } from 'mobx-react-lite';
import { postStore } from "../../stores/PostStore";

const AyurvedaStartPage = observer(() => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [loadingSpinnerPosts, setLoadingSpinnerPosts] = useState(false);
  const [pageError, setPageError] = useState("");
  const [ayurvedaPostsError, setAyurvedaPostsError] = useState("");
  const [ayurvedaPage, setAyurvedaPage] = useState<PageDataInfo | null>(null);



  const isLoading = loadingSpinner || loadingSpinnerPosts;

  const getAyurvedaPageInfo = async () => {
    setLoadingSpinner(true);
    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?slug=ayurveda&_fields=title,content", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);


        if (data.length > 0) {
          setAyurvedaPage(data[0]);
          sessionStorage.setItem("ayurvedaStartPageInfo", JSON.stringify(data[0]));
          console.log("data[0]:", data[0])
          setLoadingSpinner(false);

        } else {
          setPageError("Kunde inte ladda Ayurveda sidans innehåll.");
        }
      }
    } catch (error) {
      setPageError("Kunde inte ladda Ayurveda sidans innehåll.");
    } finally {
      setLoadingSpinner(false);
    }
  }

  const getAyurvedaPosts = async () => {
    setLoadingSpinnerPosts(true);

    try {
      await postStore.getAllPosts(37);
      console.log("Posts in store:", postStore.posts);

    } catch (error) {
      setAyurvedaPostsError("Kunde inte ladda ayurveda inlägg.");
    } finally {
      setLoadingSpinnerPosts(false);
    }

  }

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

  //useEffect för att hämta in Om sida innehåll
  useEffect(() => {
    getAyurvedaPosts();
    const cachedAyurvedaStartPageInfo = sessionStorage.getItem("ayurvedaStartPageInfo");
    if (cachedAyurvedaStartPageInfo) {
      setAyurvedaPage(JSON.parse(cachedAyurvedaStartPageInfo));
      return;
    }
    getAyurvedaPageInfo();


  }, []);

  return (
    <>
      {!loadingSpinner && (
        <div>
          {pageError ? (
            <p>{pageError}</p>
          ) : (
            <div className={AyurvedaStyle.ayurvedaContainer}>

              <h1 className={AyurvedaStyle.ayurvedaTitle}>{ayurvedaPage && parse(ayurvedaPage.title.rendered)}</h1>

              {ayurvedaPage && parse(ayurvedaPage.content.rendered)}
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className={LoadingSpinnerStyle.loadingSpinner}></div>
      )}

      {!loadingSpinnerPosts && (

        <div>
          {ayurvedaPostsError ? (
            <p>{ayurvedaPostsError}</p>
          ) : (
            <div className="mx-auto max-w-[100rem]">
              <h3 className="text-center mt-40 mb-4">Senaste inlägg</h3>
              <div className='flex gap-8 justify-between p-4'>
                {postStore.posts.slice(0, 3).map((post: any) => (

                  <div key={post.id}>
                    <Link to={`/ayurveda-inlagg/${post.id}`} className={AyurvedaStyle.ayurvedaPosts}>
                      <article className="border-[1px] border-forma_ro_grey rounded-3xl text-center max-w-[30rem] w-full max-h-[60rem] h-full flex flex-col justify-between">
                        {post.image && (
                          <img
                            className="rounded-t-2xl max-w-[30rem] w-full max-h-[20rem] h-full object-cover"
                            src={post.image}
                            alt={post.image_alt || 'Post inlägg bild'}
                          />
                        )}
                        <div className='p-2'>
                          <h4 className="text-[20px] p-2 font-semibold">{post.title}</h4>
                          <p>
                            {trimText(post.content, 150)}
                          </p>
                          <br />
                          <p>Läs mer</p>
                        </div>
                      </article>
                    </Link>
                  </div>
                ))}
              </div>
              <div>
                <Link to={`/ayurveda-inlagg`} className="flex gap-1 justify-center mx-auto p-4 text-[20px] mt-20 bg-forma_ro_orange w-full rounded-2xl">
                  Se alla Ayurveda inlägg
                </Link>

              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
});

export default AyurvedaStartPage