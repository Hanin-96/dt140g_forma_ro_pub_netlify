import { useEffect } from "react";
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import { Link } from "react-router-dom";
import { ChevronsRight } from "lucide-react";
import Pagination from "../../components/Pagination/Pagination";

//productStore
import { observer } from "mobx-react-lite";
import { productStore } from "../../stores/ProductStore";


const GalleryPage = observer(() => {

  //useEffect för att hämta in alla produkter i galleriet
  useEffect(() => {
    productStore.getCeramicProducts();
  }, []);


  return (
    <>
      {productStore.loading && <div className={LoadingSpinnerStyle.loadingSpinner}></div>}
      {productStore.error && <p className="mx-auto max-w-[100rem] mt-4">{productStore.error}</p>}
      {!productStore.loading && !productStore.error && (
        <div className="mx-auto max-w-[100rem]">
          <h1 className="mt-20 mb-16 text-center">Galleri</h1>

          <div className="mb-10 flex gap-[10rem] justify-between max-w-[100rem] m-2 p-4 rounded-2xl border-[1px] border-forma_ro_grey">
            <div className="w-full flex gap-4 items-center">
              <label htmlFor="SortOptions" className="text-[16px]">Kategorier:</label>
              <select name="sortOptions" id="sortOptions" className="w-full max-w-[50rem] text-[16px] cursor-pointer p-2 rounded-xl shadow-sm" onChange={(e) => productStore.setCategory(e.target.value)} value={productStore.selectedCategory}>
                <option value={productStore.defaultCategory}>{productStore.defaultCategory}</option>
                {productStore.productCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}

              </select>
            </div>

            <div className="w-full flex gap-4 items-center">
              <label htmlFor="searchInput" className="text-[16px] inline">Sök:</label>
              <input type="text" name="searchInput" id="searchInput" className="text-[16px] max-w-[50rem] w-full shadow-sm p-2 rounded-xl"
                placeholder="Skriv namn på produkt"
                value={productStore.searchInput}
                onChange={(e) => {
                  productStore.setSearchInput(e.target.value);
                  productStore.searchProduct();
                }}
              />
            </div>
          </div>

          <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productStore.paginatedProducts.map(product => (
              <Link key={product.id} to={`/keramik-produkt/${product.id}`} className="hover:no-underline">
                <article className="border-[1px] border-forma_ro_grey rounded-3xl text-center hover:bg-forma_ro_red  h-full w-full">



                  <img src={product.product_thumbnail} alt={product.product_thumbnail_alt ?? "produkt bild"} className="rounded-t-2xl max-h-[30rem] h-full w-full object-cover" />
                  <h4 className="text-[20px] p-2 font-semibold">{product.title.rendered}</h4>
                  <p className="p-2">{product.product_price}:-</p>
                  <button className="flex gap-1 justify-center mx-auto p-2 text-[18px]">
                    Se produkt <ChevronsRight className="color-forma_ro_black" />
                  </button>
                </article>
              </Link>

            ))}
          </div>

          <Pagination
            totalProducts={productStore.products.length}
            productsPerPage={productStore.productsPerPage}
            setCurrentPage={(page) => productStore.setPage(page)}
            currentPage={productStore.currentPage}
          />
        </div>
      )}

    </>

  )
});

export default GalleryPage