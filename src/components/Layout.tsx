import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <>
            <Header />
            <main style={{minHeight: "80vh"}}>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Layout