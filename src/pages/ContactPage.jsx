import { useEffect, useCallback, useState } from "react";
import { NavLink } from "react-router-dom"
import AOS from "aos";
import API from '../api';

const ContactPage = ({ setting, contact }) => {

    const pageTitle = "Contact"
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const AosInit = () => {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
        AOS.refresh();
    }

      const onSubmit = useCallback(async (event) => {
            event.preventDefault()
            setLoading(true);
            setSuccess(false)
            let formData = {
                email: email,
                name: name,
                subject: subject,
                message: message
            }
            await API.post("page/contact", formData).then(res => {
                setTimeout(() => { 
                    setError("")
                    setLoading(false)
                    setSuccess(true)
                    setName("")
                    setEmail("")
                    setSubject("")
                    setMessage("")
                }, 1500)
                return res.data
            })
            .catch(function (error) {
                let errorMessage = error.response.data.message
                setLoading(false)
                setError(errorMessage)
            });
        }, [name, email, subject, message]);

    useEffect(() => {
        // Mounting
        document.title = pageTitle
        document.body.classList.add("contact-page")
        AosInit()
        return () => {
            // Unmount
            AosInit()
        }
    }, []);

    return (
        <>
            <div className="page-title accent-background">
                <div className="container d-lg-flex justify-content-between align-items-center">
                    <h1 className="mb-2 mb-lg-0">{pageTitle}</h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><NavLink to="/">Home</NavLink></li>
                            <li className="current">{pageTitle}</li>
                        </ol>
                    </nav>
                </div>
            </div>

           
            <section id="contact" className="contact section">
            <div className="mb-5">
                <iframe style={{ "width": "100%", "height": "400px" }} src={setting["company-map"]} frameBorder="0" allowFullScreen=""></iframe>
            </div>
            
            <div className="container" data-aos="fade">
                <div className="row gy-5 gx-lg-5">
                    <div className="col-lg-4">
                        <div className="info">
                        <h3>{contact.title}</h3>
                        <p>{contact.description}</p>
                        <div className="info-item d-flex">
                            <i className="bi bi-geo-alt flex-shrink-0"></i>
                            <div>
                                <h4>Location:</h4>
                                <p>{setting["company-street1"]} {setting["company-street2"]}</p>
                            </div>
                        </div>
                        
                        <div className="info-item d-flex">
                            <i className="bi bi-envelope flex-shrink-0"></i>
                            <div>
                                <h4>Email:</h4>
                                <p>{setting["company-email"]}</p>
                            </div>
                        </div>
                        
                        <div className="info-item d-flex">
                            <i className="bi bi-phone flex-shrink-0"></i>
                            <div>
                                <h4>Call:</h4>
                                <p>{setting["company-phone"]}</p>
                            </div>
                        </div>
                        
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <form onSubmit={onSubmit} role="form" className="php-email-form">
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <input type="text" name="name" className="form-control" id="name" readOnly={loading} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
                                </div>
                                <div className="col-md-6 form-group mt-3 mt-md-0">
                                    <input type="email" className="form-control" name="email" id="email" readOnly={loading} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" required />
                                </div>
                            </div>
                            <div className="form-group mt-3">
                                <input type="text" className="form-control" name="subject" id="subject" readOnly={loading} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required />
                            </div>
                            <div className="form-group mt-3">
                                <textarea className="form-control" name="message" placeholder="Message" readOnly={loading} value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                            </div>
                            <div className="my-3">
                                <div className={!loading ? 'd-none' : 'd-block'}>Loading</div>
                                <div className={ error ? 'error-message d-block' : 'd-none' }>{error}</div>
                                <div className={ success ? 'sent-message d-block': 'd-none' }>Your message has been sent. Thank you!</div>
                            </div>
                            <div className="text-center"><button disabled={loading} type="submit">Send Message</button></div>
                        </form>
                    </div>
                    
                </div>
            </div>
            </section>


        </>
    )
}   

export default ContactPage