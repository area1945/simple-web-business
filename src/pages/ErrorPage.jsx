import { useEffect } from "react";
import { NavLink  } from "react-router-dom"

const ErrorPage = () => {

    const pageTitle = "Page Not Found"

    useEffect(() => {
        // Mounting
        document.title = pageTitle
        document.body.classList.add("error-page")
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
        </>
    )
}   

export default ErrorPage