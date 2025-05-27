import { useEffect, useState } from "react";
import parse, { domToReact } from 'html-react-parser';
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import AboutStyle from './AboutStyle.module.css';
import { Link } from 'react-router-dom';


function AboutPage() {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [error, setError] = useState("");
  const [aboutInfo, setAboutInfo] = useState<string>("");
  const [aboutTitle, setAboutTitle] = useState<string>("");



  const getAboutPageInfo = async () => {
    setLoadingSpinner(true);
    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?slug=om&_embed&fields=id,title,content,_embedded", {
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
          setAboutInfo(data[0].content.rendered);
          console.log(data[0].title);
          setAboutTitle(data[0].title.rendered);
          sessionStorage.setItem("aboutPageInfo", JSON.stringify(data[0].content.rendered));
          sessionStorage.setItem("aboutPageTitle", JSON.stringify(data[0].title.rendered));
          setLoadingSpinner(false);
          console.log("AboutInfo content:", aboutInfo);

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
    const cachedAboutPageInfo = sessionStorage.getItem("aboutPageInfo");
    const cachedAboutPageTitle = sessionStorage.getItem("aboutPageTitle");
    if (cachedAboutPageInfo && cachedAboutPageTitle) {
      setAboutInfo(JSON.parse(cachedAboutPageInfo));
      setAboutTitle(JSON.parse(cachedAboutPageTitle));
      return;
    }
    getAboutPageInfo();
    //getAboutPosts();
  }, []);

  return (

    <>
      {loadingSpinner ? (
        <div className={LoadingSpinnerStyle.loadingSpinner}></div>
      ) : (
        <div>
          {error ? (
            <p>{error}</p>
          ) : (
            <div className={AboutStyle.aboutContainer}>
              <div className={AboutStyle.colorBlock}></div>
              <div className={AboutStyle.titleWrap}>
                <h1 className={AboutStyle.aboutTitle}>{aboutTitle && parse(aboutTitle)}</h1>
              </div>
              {aboutInfo &&
                parse(aboutInfo, {
                  replace: (node: any) => {
                    if (node.name === "a" && node.attribs?.href) {
                      const href = node.attribs.href;
                      const isInternal = href.startsWith("/")

                      if (isInternal) {
                        return (
                          <Link to={href}>
                            {domToReact(node.children)}
                          </Link>
                        );
                      }
                    }

                  },
                })}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default AboutPage