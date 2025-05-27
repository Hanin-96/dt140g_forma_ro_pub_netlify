import { useEffect, useState } from 'react';
import logotyp from '../../assets/logo/logotyp_forma_ro_200x160.svg';
import Footer from '../../components/Footer/Footer';
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import HomePageStyle from './HomePageStyle.module.css';
import { Link } from 'react-router-dom';

function HomePage() {
    const [images, setImages] = useState<{ src: string; alt: string; caption: string }[]>([]);
    const [errorContent, setErrorContent] = useState("");
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    const getHomePage = async () => {
        setLoadingSpinner(true);

        try {
            const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?slug=hem&_fields=content");

            if (response.ok) {
                const data = await response.json();
                const html = data.length > 0 ? data[0].content.rendered : "";

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                //Hämta bilder
                const imgElements = Array.from(doc.querySelectorAll("div.wp-block-media-text"));

                const imagesData = imgElements.map(div => {
                    const img = div.querySelector("img");
                    return {
                        src: img?.getAttribute("src") || "",
                        alt: img?.getAttribute("alt") || "",
                        caption: div.textContent?.trim() || "",
                    };
                });
                console.log(imagesData);
                setImages(imagesData);
                sessionStorage.setItem("homePageImages", JSON.stringify(imagesData));
                setLoadingSpinner(false);

            }

        } catch (error) {
            setErrorContent("Kunde inte ladda startsidans innehåll.");
        } finally {
            setLoadingSpinner(false);
        }
    };

    useEffect(() => {
        const cachedImages = sessionStorage.getItem("homePageImages");
        if (cachedImages) {
            setImages(JSON.parse(cachedImages));
            return;
        }
        getHomePage();

    }, []);

    return (
        <>
            <div className='p-4'>
                <img src={logotyp} loading='lazy' alt="logotyp" style={{ maxWidth: "150px", width: "100%", margin: "0 auto" }} />
            </div>

            {loadingSpinner ? (
                <div className={LoadingSpinnerStyle.loadingSpinner}></div>
            ) : (
                <div>
                    {errorContent ? (
                        <p className='text-center'>{errorContent}</p>
                    ) :
                        (
                            <div>
                                <div className='max-w-width_1000 mx-auto px-4 mb-[10rem] mt-[100px]'>

                                    <div className='mx-auto flex justify-center gap-[100px]'>
                                        <div>
                                            <Link to="/ayurveda">
                                                <div className='relative'>
                                                    <div className={`${HomePageStyle.imageCircle} ${HomePageStyle.borderAyurveda}`}></div>
                                                    {images.map((img, i) =>
                                                        img.caption.toLowerCase().includes("ayurveda") && (
                                                            <article key={`ayurveda-${i}`} className="w-[300px] h-[300px] max-w-full mx-auto">
                                                                <img src={img.src} alt={img.alt} className="w-full h-full object-cover shadow-md rounded-full mb-10" />
                                                                <button className='w-full bg-forma_ro_orange text-forma_ro_black py-2 px-4 rounded-lg text-[2rem] mt-10'>
                                                                    {img.caption}
                                                                </button>
                                                            </article>
                                                        )
                                                    )}
                                                </div>
                                            </Link>

                                        </div>

                                        <div>
                                            <Link to="/keramik">
                                                <div className='relative'>
                                                    <div className={`${HomePageStyle.imageCircle} ${HomePageStyle.borderKeramik}`}></div>
                                                    {images.map((img, i) =>
                                                        img.caption.toLowerCase().includes("keramik") && (
                                                            <div key={`keramik-${i}`} className="w-[300px] h-[300px] max-w-full mx-auto">
                                                                <img src={img.src} alt={img.alt} className="w-full h-full object-cover shadow-md rounded-full mb-10" />
                                                                <button className='w-full mt-10 bg-forma_ro_red text-forma_ro_black py-2 px-4 rounded-lg text-[2rem]'>
                                                                    {img.caption}
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <Footer />
                            </div>
                        )}
                </div>
            )}

        </>
    );

}

export default HomePage;
