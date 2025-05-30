import { observer } from "mobx-react-lite"
import { productStore } from "../../stores/ProductStore";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import ProductOrderForm from "../../components/ProductOrderForm/ProductOrderForm";
import { ChevronsRight } from "lucide-react";
import { ProductData } from "../../types/Product";

const ProductPage = observer(() => {

    const { productId } = useParams();

    //Shufflar för att hämta random produkter som finns
    const getRandomProducts = (products: ProductData[], count: number) => {
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const randomProducts = getRandomProducts(productStore.products, 3);

    useEffect(() => {
        if (!productId) return;

        if (String(productStore.product?.id) === productId) return;
        productStore.getProductById(productId);
        productStore.getCeramicProducts(productId);
    }, [productId])
    return (
        <>
            {productStore.loading && <div className={LoadingSpinnerStyle.loadingSpinner}></div>}
            {productStore.product ? (
                <div className="max-w-[100rem] w-full mx-auto mt-10">
                    <section className="flex justify-between gap-10 border-[1px] border-forma_ro_grey rounded-t-2xl p-8 items-center">
                        <div className="max-w-[40rem] w-full">
                            <h1 className="mb-10">{productStore.product.title.rendered}</h1>
                            <p>{productStore.product.product_price}kr</p>
                            <p className="mt-10">{productStore.product.product_measurement}</p>
                            <div className="flex gap-10 border-t-[1px] border-b-[1px] border-forma_ro_grey mt-10">
                                {productStore.product.product_category.map((category) => (
                                    <p key={category.term_id}>{category.name}</p>
                                ))}
                            </div>
                            <p className="mt-10">{productStore.product.product_description}</p>
                        </div>
                        <div className="aspect-square w-full max-w-[50rem]">
                            <img src={productStore.product.product_thumbnail} height={300} width={300} alt={productStore.product.product_thumbnail_alt} className="object-cover w-full rounded-2xl shadow-sm h-full" />
                        </div>
                    </section>

                    <ProductOrderForm />

                    <div>
                        <h3 className="mt-40 mb-10 bg-forma_ro_brown text-white p-2">Andra produkter</h3>
                        <div className="flex justify-between gap-8">
                            {randomProducts.slice(0, 3).map((product: ProductData) => (


                                <Link key={product.id} to={`/keramik-produkt/${product.id}`} className="hover:no-underline max-w-[30rem] h-full w-full">
                                    <article className="border-[1px] border-forma_ro_grey rounded-3xl text-center max-w-[30rem] h-full w-full hover:bg-forma_ro_red">
                                        <img src={product.product_thumbnail} height={300} width={300} alt={product.product_thumbnail_alt} className="rounded-t-2xl max-h-[30rem] max-w-[30rem] h-full w-full object-cover min-h-[30rem]" />
                                        <h4 className="text-[20px] p-2 font-semibold">{product.title.rendered}</h4>
                                        <p className="p-2">{product.product_price}:-</p>
                                        <button className="flex gap-1 justify-center mx-auto p-2 text-[18px]">Se produkt  <ChevronsRight className="color-forma_ro_black" /></button>
                                    </article>
                                </Link>

                            ))}
                    </div>

                </div>

                </div >
            ) : <p>{productStore.error}</p>}

        </>
    )
})

export default ProductPage