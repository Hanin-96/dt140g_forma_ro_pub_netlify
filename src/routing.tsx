import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AyurvedaStartPage from "./pages/Ayurveda/AyurvedaStartPage";
import DoshaPage from "./pages/Ayurveda/DoshaPage";
import HomePage from "./pages/Home/HomePage";
import ContactPage from "./pages/Contact/ContactPage";
import AboutPage from "./pages/About/AboutPage";
import CeramicStartPage from "./pages/Ceramic/CeramicStartPage";
import GalleryPage from "./pages/Ceramic/GalleryPage";
import AyurvedaPostsPage from "./pages/Ayurveda/AyurvedaPostsPage";
import ProductPage from "./pages/Ceramic/ProductPage";
import PostPage from "./pages/Ayurveda/PostPage";
import CalendarPage from "./pages/Calendar/CalendarPage";
import CeramicPostsPage from "./pages/Ceramic/CeramicAllPostsPage";
import CeramicAllPostsPage from "./pages/Ceramic/CeramicAllPostsPage";
import CeramicPostPage from "./pages/Ceramic/CeramicPostPage";


const router = createBrowserRouter([

    {
        path: "/hem",
        element: <Navigate to="/" replace />,
    },
    {
        path: "/",
        element: (
            <HomePage />
        ),
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "*",
                element: <Navigate to="/" replace />
            },
            {
                path: "/:slug",
                element: (
                    <div>Valfri default sida</div>
                ),
            },

            {
                path: "/kontakt",
                element: (
                    <ContactPage />
                ),
            },
            {
                path: "/kalender",
                element: (
                    <CalendarPage />
                ),
            },
            {
                path: "/om",
                element: (
                    <AboutPage />
                ),
            },
            //Ayurveda sidor
            {
                path: "/ayurveda",
                element: (
                    <AyurvedaStartPage />
                ),
            },
            {
                path: "/ayurveda-inlagg",
                element: (
                    <AyurvedaPostsPage />
                )
            },
            {
                path: "/ayurveda-inlagg/:postId",
                element: (
                    <PostPage />
                )
            },
            {
                path: "/ayurveda-dosha-quiz",
                element: (
                    <DoshaPage />
                )
            },
            {
                path: "/ayurveda/:slug",
                element: (
                    <div>Valfri default ayurveda sida</div>
                )
            },

            //Keramik sidor
            {
                path: "/keramik",
                element: (
                    <CeramicStartPage />
                )
            },
            {
                path: "/keramik-galleri",
                element: (
                    <GalleryPage />
                )
            },
            {
                path: "/keramik-produkt/:productId",
                element: (
                    <ProductPage />
                )
            },

            {
                path: "/keramik-inlagg",
                element: (
                    <CeramicAllPostsPage />
                )
            },
            {
                path: "/keramik-inlagg/:postId",
                element: (
                    <CeramicPostPage />
                )
            },
            {
                path: "/keramik/:slug",
                element: (
                    <div>Valfri default keramik sida</div>
                )
            },
        ]
    }


]);

export default router;
