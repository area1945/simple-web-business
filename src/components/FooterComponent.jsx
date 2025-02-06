import { NavLink } from "react-router-dom"
import { useState, useCallback } from "react"
import API from '../api';

const FooterComponent = ({ setting, newsletter, services }) => {

    const nowYear = new Date().getFullYear()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const onSubmit = useCallback(async (event) => {
        event.preventDefault()
        setLoading(true);
        setSuccess(false)
        await API.post("page/subscribe", { email: email }).then(res => {
            setTimeout(() => { 
                setError("")
                setLoading(false)
                setSuccess(true)
                setEmail("")
            }, 1500)
            return res.data
        })
        .catch(function (error) {
            let errorMessage = error.response.data.message
            setLoading(false)
            setError(errorMessage)
        });
    }, [email]);

    return (
        <>
            <footer id="footer" className="footer dark-background mt-auto">
                <div className="container footer-top">
                    <div className="row gy-4">
                        <div className="col-lg-4 col-md-6 footer-about">
                            <NavLink to={"/"} className="logo d-flex align-items-center">
                                <span className="sitename">{setting["company-name"]}</span>
                            </NavLink>
                            <div className="footer-contact pt-3">
                                <p>{setting["company-street1"]}</p>
                                <p>{setting["company-street2"]}</p>
                                <p className="mt-3"><strong>Phone:</strong> <span>{setting["company-phone"]}</span></p>
                                <p><strong>Email:</strong> <span>{setting["company-email"]}</span></p>
                            </div>
                            <div className="social-links d-flex mt-4">
                                <a href={setting["company-twitter"]} target="_blank" className="twitter"><i className="bi bi-twitter-x"></i></a>
                                <a href={setting["company-facebook"]} target="_blank"  className="facebook"><i className="bi bi-facebook"></i></a>
                                <a href={setting["company-instagram"]} target="_blank"  className="instagram"><i className="bi bi-instagram"></i></a>
                                <a href={setting["company-linked-in"]} target="_blank"  className="linkedin"><i className="bi bi-linkedin"></i></a>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-3 footer-links">
                            <h4>Useful Links</h4>
                            <ul>
                                <li><NavLink to={"/"}>Home</NavLink></li>
                                <li><NavLink to={"/about"}>About us</NavLink></li>
                                <li><NavLink to={"/service"}>Services</NavLink></li>
                                <li><NavLink to={"/term-of-service"}>Terms of service</NavLink></li>
                                <li><NavLink to={"/privacy-policy"}>Privacy policy</NavLink></li>
                            </ul>
                        </div>

                        <div className="col-lg-2 col-md-3 footer-links">
                            <h4>Our Services</h4>
                            <ul>
                                {services.slice(0, 5).map((row, index) => {
                                    return (
                                        <li key={index}><NavLink to={`/service?id=${row.uuid}`}>{row.title}</NavLink></li>
                                    )
                                }) }
                            </ul>
                        </div>

                        <div className="col-lg-4 col-md-12 footer-newsletter">
                            <h4>{newsletter.title}</h4>
                            <p>{newsletter.description}</p>
                            <form onSubmit={onSubmit}>
                                <div className="newsletter-form"><input type="email" name="email" required onChange={(e) => setEmail(e.target.value)} value={email} /><input  type="submit" value="Subscribe" /></div>
                                <div className={!loading ? 'd-none' : 'loading'}>Loading</div>
                                <div className={ error ? 'error-message text-danger' : 'd-none' }>{error}</div>
                                <div className={ success ? 'sent-message text-success': 'd-none' }>Your subscription request has been sent. Thank you!</div>
                            </form>
                        </div>

                    </div>
                    </div>
                    <div className="container copyright text-center mt-4">
                    <p>© <span>Copyright {nowYear}</span> <strong className="px-1 sitename">{setting["company-name"]}</strong> <span>All Rights Reserved</span></p>
                    <div className="credits">
                        Designed by 
                        <NavLink className={"ms-2"} to={"/"}>
                            {setting["site-author"]}
                        </NavLink>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default FooterComponent