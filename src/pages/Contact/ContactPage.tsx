import { useEffect, useState } from "react";
import ContactForm from "../../components/ContactForm/ContactForm"
import parse from 'html-react-parser';
import { PageDataInfo } from "../../types/PageData";
import ContactModuleStyle from "./ContactStyle.module.css";
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';


function ContactPage() {
  const [contactInfo, setContactInfo] = useState<PageDataInfo[]>([]);
  const [error, setError] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const getContactPageInfo = async () => {
    setLoadingSpinner(true);
    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?slug=kontakt&_fields=content,id,title", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();

        if (data.length > 0) {
          setContactInfo(data);
          //Lagra i sessionStorage
          sessionStorage.setItem("contactPageInfo", JSON.stringify(data));
          setLoadingSpinner(false);

        } else {
          setError("Ingen kontaktinformation är tillgänglig");
        }
      }
    } catch (error) {
      setError("Kunde inte ladda kontaktsidans innehåll.");
    } finally {
      setLoadingSpinner(false);
    }
  }

  //useEffect för att hämta in kontaktsida innehåll
  useEffect(() => {
    const cachedContactPageInfo = sessionStorage.getItem("contactPageInfo");
    if(cachedContactPageInfo) {
      setContactInfo(JSON.parse(cachedContactPageInfo));
      return;
    }
    getContactPageInfo();
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
            <>
              <div className="mt-20 border-[1px] border-b-0 max-w-[100rem] mx-auto border-forma_ro_grey p-4">
                {contactInfo.length > 0 ? (
                  contactInfo.map((page) => (
                    <div key={page.id}>
                      <h1>{page.title.rendered}</h1>
                      <div className={ContactModuleStyle.contactpageInfo}>
                        {parse(page.content.rendered)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Ingen kontaktinformation är tillgänglig</p>
                )}
              </div>
              <ContactForm />
            </>
          )}
        </div>
      )}
    </>
  )
}

export default ContactPage