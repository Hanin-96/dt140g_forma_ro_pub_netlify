import { useEffect, useState } from 'react';
import logotypFooter from '../../assets/logo/logotyp_forma_ro_200x160.svg';
import footerStyle from './FooterStyle.module.css';
import parse from 'html-react-parser';

function Footer() {

  const [contactFooterLinks, setcontactFooterLinks] = useState(null);
  const [errorLinks, setErrorLinks] = useState("");

  const getContactLinks = async () => {
    try {

      const response = await fetch("http://localhost:8002/wp-json/wp/v2/posts?slug=kontaktuppgifter-sidfot&_fields=content", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setcontactFooterLinks(data.length > 0 ? data[0].content.rendered : "Ingen kontaktinformation är tillgänglig");
      }
    } catch (error) {
      setErrorLinks("Det gick inte att hämta kontaktuppgifter i sidfoten")
    }

  }
  //useEffect för att hämta in poster
  useEffect(() => {
    getContactLinks();
  }, []);

  return (
    <>
      <footer className={`${footerStyle.contactLinks} bg-forma_ro_grey font-Text text-forma_ro_text p-4 mt-[30rem]`}>
        <div className='flex gap-4 w-width_1000 mx-auto'>
          <img src={logotypFooter} alt="logotyp" style={{ maxWidth: "100px", width: "100%" }} />
          <div>{contactFooterLinks ? parse(contactFooterLinks) : errorLinks}</div>
        </div>
      </footer>
    </>
  )
}

export default Footer