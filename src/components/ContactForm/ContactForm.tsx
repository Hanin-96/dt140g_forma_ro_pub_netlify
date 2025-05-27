import { useState } from "react"
import React from 'react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from "react-google-recaptcha";
import ContactStyle from './ContactStyle.module.css';
import LoadingSpinnerStyle from '../LoadingSpinner/LoadingSpinnerStyle.module.css';

//Lucide ikon
import { ChevronDown, ChevronUp, Send } from 'lucide-react';
import type { FormData, FormErrors } from "../../types/FormData";


function ContactForm() {
    const [toggleContactForm, setToggleContactForm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);

    //EmailJS states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("");
    const [checkbox, setCheckbox] = useState(false);

    const [sent, setSent] = useState(false);
    const [sentMsg, setSentMsg] = useState("");
    const [spamError, setSpamError] = useState("");
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    //State för error i fetch anrop
    const [fetchError, setFetchError] = useState<string | null>(null);

    //reCAPCTHA state
    const siteKey_RECAPTCHA: string = import.meta.env.VITE_SITEKEY_RECAPTCHA || "";
    const [captchaResponse, setCaptchaResponse] = useState<string | null>("");

    // Skicka reCAPTCHA-responsen till state när användaren bekräftar
    const handleCaptcha = (value: string | null) => {
        if (value) {
            setCaptchaResponse(value);
        } else {
            setCaptchaResponse(null);
        }
    };

    const validateForm = ((data: FormData) => {
        const errors: FormErrors = {};

        if (!data.name || data.name.trim().length < 2) {
            errors.name = "Namn måste vara minst 2 bokstäver.";
        }

        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = "Skriv en giltig e-postadress";
        }

        if (!data.message || data.message.trim().length < 5) {
            errors.message = "Meddelande måste vara minst 5 tecken.";
        }
        if (!data.phone || !/^(\+46|0)[\d\s-]{7,15}$/.test(data.phone.trim())) {
            errors.phone = "Telefonnumret är ogiltigt.";
        }
        if (data.checkbox === false) {
            errors.checkboxMsg = "Kryssa in rutan";
        }

        return errors;
    });


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        //Hindrar automatisk redirect
        e.preventDefault();

        if (isSending) return;

        const formData: FormData = {
            name,
            email,
            phone,
            message,
            checkbox
        };

        const validationErrors = validateForm(formData);

        //Kontaktformuläret innehåller fel
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        } else {
            //Nollställ error validering
            setFormErrors({})
        }


        //HoneyPot kontroll
        const honeyPotField = (e.target as HTMLFormElement)["honeypot"].value;

        if (honeyPotField) {
            setSpamError("Formuläret skickades inte. Möjlig spam.");
            return;
        }


        if (!captchaResponse) {
            setSpamError("Vänligen bekräfta att du inte är en robot.");
            return;
        }

        //Template för emailJS formulär
        const templateParams = {
            from_name: name,
            from_email: email,
            from_phone: phone,
            to_name: "Forma Ro test",
            subject: subject,
            message: message,
            "g-recaptcha-response": captchaResponse,
        }

        console.log(templateParams);

        const serviceId: string = import.meta.env.VITE_SERVICEID || "";
        const templateId: string = import.meta.env.VITE_TEMPLATEID || "";
        const publicKey: string = import.meta.env.VITE_PUBLICKEY || "";

        setIsSending(true);

        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then((response) => {
                setIsSending(false);
                if (response.status !== 200) {
                    formSubmitSend(templateParams);
                }
                console.log("Formuläret har skickats", response);
                setName("");
                setEmail("");
                setPhone("");
                setSubject("");
                setMessage("");
                setCheckbox(false);
                setCaptchaResponse(null);
                setSent(true);
                setSpamError("");
                setSentMsg("Ditt meddelande till FormaRo har skickats.");

                //Nollställer skickat meddelande efter 5s
                setTimeout(() => {
                    setSentMsg("");
                }, 5000)
                //Rensa felmeddelande
                setFetchError(null);
            })
            .catch((error) => {
                console.error("Fel, det gick inte att skicka formuläret", error);
                //setFetchError("Fel. Det gick inte att skicka formuläret - Serverfel")

                //Kalla på fallback formsubmit
                formSubmitSend(templateParams);
            })
    }

    const formSubmitSend = (templateParams: any) => {
        //Gör om datan till formdata för att skicka till formSubmit
        const formData = new FormData();
        formData.append("Namn:", templateParams.from_name);
        formData.append("E-post:", templateParams.from_email);
        formData.append("Telefonnummer:", templateParams.from_phone);
        formData.append("Ämne", templateParams.subject);
        formData.append("Meddelande", templateParams.message);
        formData.append("_captcha", "false");
        formData.append("_template", "table");
        try {
            fetch("https://formsubmit.co/7bad72b7e79fe36964d64d479d63ebd1", {
                method: "POST",
                body: formData,
            })

                .then((response) => {
                    if (response.ok) {
                        setName("");
                        setEmail("");
                        setPhone("");
                        setSubject("");
                        setMessage("");
                        setCheckbox(false);
                        setCaptchaResponse(null);
                        setSent(true);
                        setSpamError("");
                        setFetchError("");
                        setSentMsg("Ditt meddelande till FormaRo har skickats.");

                    } else {
                        setFetchError("Det gick inte att skicka formuläret. Försök igen.");
                    }
                })

        } catch (error) {
            setFetchError("Det gick inte att skicka formuläret. Försök igen.");
        }

    }

    const toggleForm = (toggleOpen: boolean) => {
        setToggleContactForm(toggleOpen);
        if (!toggleOpen) {
            setTimeout(() => {
                setIsOpen(toggleOpen);
            }, 500);
        } else {
            setIsOpen(toggleOpen);
        }

    }

    return (
        <>
            <div className={"w-full max-w-[100rem] mx-auto mb-[20rem]"}>
                <button onClick={() => toggleForm(!toggleContactForm)} className="bg-forma_ro_green relative max-w-[100rem] p-4 w-full text-forma_ro_btn">
                    Kontakta Forma Ro
                    {(!toggleContactForm) ? (<ChevronDown className="inline absolute m-4 right-0 top-0" />) : <ChevronUp className="inline absolute m-4 right-0 top-0" />}
                </button>



                {isOpen && (
                    <div className="bg-forma_ro_grey">
                        <form onSubmit={handleSubmit} className={`${ContactStyle.contactFormContainer} ${toggleContactForm ? ContactStyle.contactFormSlideDown : ContactStyle.contactFormSlideUp} shadow-lg`}>
                            <div className="p-8">
                                <div className="flex justify-between gap-20">
                                    <div className="w-full">
                                        <h3>Kontaktuppgifter</h3>
                                        <div>
                                            <label htmlFor="namn">Namn:</label>
                                            <input
                                                type="text"
                                                name="namn"
                                                placeholder="Ditt namn"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="shadow-sm"
                                            />
                                            {
                                                formErrors.name && <p className="text-red-600 mt-[-1rem]">{formErrors.name}</p>
                                            }
                                        </div>
                                        <div>
                                            <label htmlFor="epost">E-post:</label>
                                            <input
                                                type="email"
                                                name="epost"
                                                placeholder="Din e-post"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="shadow-sm"
                                            />
                                            {
                                                formErrors.email && <p className="text-red-600 mt-[-1rem]">{formErrors.email}</p>
                                            }
                                        </div>
                                        <div>
                                            <label htmlFor="phone">Telefon:</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                placeholder="Telefon nummer"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="shadow-sm"
                                            />
                                            {
                                                formErrors.phone && <p className="text-red-600 mt-[-1rem]">{formErrors.phone}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <h3>Meddelande:</h3>
                                        <div>
                                            <label htmlFor="subject">Ämne:</label>
                                            <select name="subject" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="shadow-sm">
                                                <option value="Ayurveda">Ayurveda</option>
                                                <option value="Keramik">Keramik</option>
                                                <option value="Övrigt">Övrigt</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="message">Meddelande:</label>
                                            <textarea
                                                className="bg-white shadow-sm"
                                                name="message"
                                                placeholder="Ditt meddelande"
                                                value={message}
                                                rows={4}
                                                onChange={(e) => setMessage(e.target.value)}
                                            ></textarea>
                                            {
                                                formErrors.message && <p className="text-red-600 mt-[-1rem]">{formErrors.message}</p>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className=" mt-10">
                                    <div className="flex gap-2">
                                        <input type="checkbox" name="checkbox" id="checkbox" className="inline" checked={checkbox}
                                            onChange={(e) => setCheckbox(e.target.checked)} />
                                        <label htmlFor="checkbox">Jag godkänner att mina uppgifter sparas.</label>
                                    </div>
                                    {
                                        formErrors.checkboxMsg && <p className="text-red-600 ">{formErrors.checkboxMsg}</p>
                                    }
                                </div>

                                {/* Honeypot field (osynligt för användaren) */}
                                <input
                                    type="text"
                                    name="honeypot"
                                    style={{ display: 'none', visibility: 'hidden', position: 'absolute' }}
                                    tabIndex={-1}
                                />

                                <div>
                                    <ReCAPTCHA className="m-8"
                                        sitekey={siteKey_RECAPTCHA}
                                        onChange={handleCaptcha}
                                    />
                                    {
                                        spamError && <p className="text-red-600">{spamError}</p>
                                    }
                                </div>
                            </div>
                            {
                                fetchError && <p>{fetchError}</p>
                            }
                            <button type="submit" className=" bg-forma_ro_green p-4 w-full text-forma_ro_btn" disabled={isSending}>Skicka <Send className="inline" /></button>

                        </form>
                    </div>
                )}

                {isSending &&
                    <div className={LoadingSpinnerStyle.loadingSpinner}></div>}


                {(sent) &&
                    <p className="p-4 max-w-[60rem] mx-auto text-center">{sentMsg}</p>
                }
            </div>

        </>
    )
}

export default ContactForm