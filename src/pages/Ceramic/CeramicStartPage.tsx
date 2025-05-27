import { useEffect, useState } from "react";
import parse from 'html-react-parser';
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import ceramicStartStyle from './CeramicStartStyle.module.css';
import { ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageDataInfo } from "../../types/PageData";
import { ProductData } from "../../types/Product";
import { observer } from "mobx-react-lite";
import { productStore } from "../../stores/ProductStore";

const CeramicStartPage = observer(() => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [loadingSpinnerPosts, setLoadingSpinnerPosts] = useState(false);
  const [pageError, setPageError] = useState("");
  const [productsError, setProductsError] = useState<string | null>(null);
  const [ceramicInfo, setCeramicInfo] = useState<PageDataInfo | null>(null);


  const isLoading = loadingSpinner || loadingSpinnerPosts;


  const getCeramicPageInfo = async () => {
    setLoadingSpinner(true);
    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?slug=keramik&fields=id,title,content,_embedded", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);


        if (data.length > 0) {
          setCeramicInfo(data[0]);
          sessionStorage.setItem("ceramicStartPageInfo", JSON.stringify(data[0]));
          setLoadingSpinner(false);

        } else {
          setPageError("Kunde inte ladda Keramik sidans innehåll.");
        }
      }
    } catch (error) {
      setPageError("Kunde inte ladda Keramik sidans innehåll.");
    } finally {
      setLoadingSpinner(false);
    }
  }


  const getCeramicProducts = async () => {
    setLoadingSpinnerPosts(true);
    setProductsError(null);

    try {
      await productStore.getCeramicProducts();
    } catch (error) {
      setProductsError("Kunde inte ladda produkterna.");
    } finally {
      setLoadingSpinnerPosts(false);
    }
  }


  //useEffect för att hämta produktinnehåll
  useEffect(() => {
    getCeramicProducts();
    const cachedCeramicStartPageInfo = sessionStorage.getItem("ceramicStartPageInfo");
    if (cachedCeramicStartPageInfo) {
      setCeramicInfo(JSON.parse(cachedCeramicStartPageInfo));
      return;
    }
    getCeramicPageInfo();


  }, []);
  return (
    <>

      {!loadingSpinner && !productsError && (
        <div>
          {pageError ? (
            <p>{pageError}</p>
          ) : (
            <div className={ceramicStartStyle.ceramicContainer}>
              <h1 className={ceramicStartStyle.ceramicTitle}>{ceramicInfo && parse(ceramicInfo.title.rendered)}</h1>
              {ceramicInfo && parse(ceramicInfo.content.rendered)}
            </div>
          )}
        </div>
      )}
      {isLoading && (
        <div className={LoadingSpinnerStyle.loadingSpinner}></div>
      )}

      {!loadingSpinnerPosts && (

        <div>
          {productsError ? (
            <p>{productsError}</p>
          ) : (
            <div className="mx-auto max-w-[100rem]">
              <h3 className="text-center mt-40 mb-4">Senaste keramik</h3>
              <div className="flex gap-8 justify-between p-4">
                {productStore.allProducts.slice(0, 3).map((product: ProductData) => (
                  product && (

                    <Link key={product.id} to={`/keramik-produkt/${product.id}`} className="hover:no-underline">
                      <article
                        className={`border-[1px] border-forma_ro_grey rounded-3xl text-center max-w-[30rem] max-h-[50rem] h-auto w-full hover:bg-forma_ro_red`}
                        
                      >
                        <img src={product.product_thumbnail} alt={product.product_thumbnail_alt} className="rounded-t-2xl max-w-[30rem] max-h-[30rem] min-h-[30rem] min-w-[30rem] h-full w-full object-cover" />
                        <h4 className="text-[20px] p-2 font-semibold">{product.title.rendered}</h4>
                        <p className="p-2">{product.product_price}:-</p>
                        <button className="flex gap-1 justify-center mx-auto p-2 text-[18px]">Se produkt  <ChevronsRight className="color-forma_ro_black" /></button>
                      </article>
                    </Link>

                  )
                ))}
              </div>
              <Link to={`/keramik-galleri`} className="flex gap-1 justify-center mx-auto p-4 text-[20px] mt-20 bg-forma_ro_red w-full rounded-2xl">
                Se alla produkter <ChevronsRight className="color-forma_ro_black" />
              </Link>

            </div>
          )}
        </div>

      )
      }
    </>
  )
});

export default CeramicStartPage