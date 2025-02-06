import { useEffect } from "react";
import { NavLink  } from "react-router-dom"

const TermOfServicePage = ({ setting }) => {

    const pageTitle = "Terms Of Service"

    useEffect(() => {
        // Mounting
        document.title = pageTitle
        document.body.classList.add("about-page")
        return () => {
            // Unmount
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
            <section id="about" className="about section">
                <div className="container" dangerouslySetInnerHTML={{__html: setting["term-service"]}}></div>
            </section>
        </>
    )
}   

export default TermOfServicePage