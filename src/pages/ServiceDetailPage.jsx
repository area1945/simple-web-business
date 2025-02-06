import { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { NavLink, useSearchParams   } from "react-router-dom"
import { Shimmer } from 'react-shimmer'
import AOS from "aos";
import API from '../api';

const ServiceDetailPage = () => {

    const pageTitle = "Service Detail"
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({})
    const [searchParams, setSearchParams] = useSearchParams();

    const AosInit = () => {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
        AOS.refresh();
    }

    const loadContent = useCallback(async () => {
        setLoading(true);
        let id = searchParams.get("id")
        await API.get("page/servicedetail?id="+id).then(res => {
            const result = res.data;
            setContent(result)
            setTimeout(() => { 
                setLoading(false)
            }, 1500)
            return res.data
        })
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
        let uuid = e.target.getAttribute("data-uuid")
        setSearchParams({ id: uuid });
        loadContent()
    }

    useLayoutEffect(() => {
        //this runs before render
        loadContent()
    }, []);

    useEffect(() => {
        // Mounting
        document.title = pageTitle
        document.body.classList.add("services-details-page")
        AosInit()
        return () => {
            // Unmount
            AosInit()
        }
    }, [loading, content]);

    return (
        <>
            <div className="page-title accent-background">
                <div className="container d-lg-flex justify-content-between align-items-center">
                    <h1 className="mb-2 mb-lg-0">{pageTitle}</h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/service">Service</NavLink></li>
                            <li className="current">{pageTitle}</li>
                        </ol>
                    </nav>
                </div>
            </div>

           
            <section id="service-details" className="service-details section">
                <div className="container">
                    { loading ? <>
                        <div className="row">
                            <div className="col-lg-4">
                                <Shimmer width={430} height={300} title={false} image={false}></Shimmer>
                            </div>
                            <div className="col-lg-8">
                                <Shimmer width={860} height={300} title={false} image={false}></Shimmer>
                            </div>
                        </div>
                    </> : <>
                        <div className="row gy-4">
                            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                                <div className="services-list">
                                    { content.services.map((row, index) => {
                                        return (
                                            <a key={index} href="#" className={row.uuid === searchParams.get("id") ? 'active' : ''} data-uuid={row.uuid} onClick={handleClick}>
                                                {row.title}
                                            </a>
                                        )
                                    }) }
                                </div>
                                <h4>{content.service.title}</h4>
                                <p>{content.service.description}</p>
                            </div>
                            <div className="col-lg-8" data-aos="fade-up" data-aos-delay="200">
                                <img src={content.service.image} alt="" className="img-fluid services-img"/>
                                <div dangerouslySetInnerHTML={{__html: content.service.details}}></div>
                            </div>
                        </div>
                    </>}
                </div>
            </section>


        </>
    )
}   

export default ServiceDetailPage