//Nav-meny interface
export interface MenuLink {
    href: string;
    pageText: string;
    parent: number;
    id: number;
    children: MenuLink[];
}


