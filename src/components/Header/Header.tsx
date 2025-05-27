import { NavLink } from "react-router-dom";
import HeaderModuleStyle from "./HeaderStyle.module.css";
import { useEffect, useState } from "react";
import { MenuLink } from "../../types/MenuLinks";
import { PageData } from "../../types/PageData";
import logotypHeader from '../../assets/logo/logotyp_forma_ro_200x160.svg';
import { Link } from 'react-router-dom';


function Header() {
    const [showMenu, setMenu] = useState(false);
    const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);

    //Toggla meny
    const toggleMenuBar = () => {

        setMenu(value => !value)
    }

    const getNavLinks = async (): Promise<void> => {
        try {
            const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?_fields=title, slug, parent, id", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const data = await response.json();


                const links: MenuLink[] = data
                    .map((page: PageData) => ({
                        href: page.slug,
                        pageText: page.title.rendered,
                        parent: page.parent,
                        id: page.id
                    }));


                const parentLinks = links.filter((page: MenuLink) => {
                    return page.parent == 0;
                })

                parentLinks.forEach(parent => {
                    parent.children = links.filter(child => child.parent === parent.id);
                })

                setMenuLinks(parentLinks)
                sessionStorage.setItem("nav-links", JSON.stringify(parentLinks));

                //console.log("data:", data);
                console.log("menylänkar:", parentLinks);

            }

        } catch (error) {
            console.log("error", error)
        }
    }


    //useEffect för att hämta in poster
    useEffect(() => {
        const cachedLinks = sessionStorage.getItem("nav-links");
        if (cachedLinks) {
            setMenuLinks(JSON.parse(cachedLinks));
            return;
        }
        getNavLinks();
    }, []);

    return (
        <>
            <header className={HeaderModuleStyle.header}>
                <div className={HeaderModuleStyle.headerContainer}>
                    <Link to="/hem">
                        <img src={logotypHeader} alt="logotyp" height={120} width={150} style={{ maxWidth: "150px", width: "100%" }} loading="lazy" />
                    </Link>

                    <nav>
                        <ul className={HeaderModuleStyle.navMain}>
                            {menuLinks.map((link, index) => (
                                <li key={index} className={HeaderModuleStyle.menuItem} >
                                    <NavLink to={link.href} className={({ isActive }) => `${HeaderModuleStyle.menuItem} ${isActive ? HeaderModuleStyle.active : ""}`}>{link.pageText}</NavLink>

                                    {link.children && link.children.length > 0 && (
                                        <ul className={HeaderModuleStyle.dropdown}>
                                            {link.children.map(child => (
                                                <li key={child.id}>
                                                    <NavLink to={child.href} className={({ isActive }) => `${HeaderModuleStyle.menuItem} ${isActive ? HeaderModuleStyle.active : ""}`}>{child.pageText}</NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className={HeaderModuleStyle.navMobil}>
                            {showMenu && (
                                <ul>
                                    {menuLinks.map((link, index) => (
                                        <li key={index} >
                                            <NavLink to={link.href}
                                                onClick={toggleMenuBar}
                                            >{link.pageText}</NavLink>

                                            {link.children && link.children.length > 0 && (
                                                <ul>
                                                    {link.children.map(child => (
                                                        <li key={child.id}>
                                                            <NavLink to={child.href}
                                                                onClick={toggleMenuBar}>{child.pageText}</NavLink>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                            )}

                        </div>


                        {/* Hamburgare */}
                        <div className={`${HeaderModuleStyle.hamburger} ${showMenu ? HeaderModuleStyle.hamburger && HeaderModuleStyle.active : ""}`} onClick={toggleMenuBar}>
                            <span className={HeaderModuleStyle.bar}></span>
                            <span className={HeaderModuleStyle.bar}></span>
                            <span className={HeaderModuleStyle.bar}></span>
                        </div>

                    </nav>


                </div>
            </header>
        </>
    )
}

export default Header