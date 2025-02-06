import { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { NavLink, useSearchParams   } from "react-router-dom"
import AOS from "aos";
import API from '../api';
import { Swiper, SwiperSlide } from "swiper/react";
import { Shimmer } from 'react-shimmer'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import moment from 'moment'


const PortfolioDetailPage = () => {

    const pageTitle = "Portfolio Details"
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({})
    const [searchParams] = useSearchParams();
    
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
        await API.get("page/portfoliodetail?id="+id).then(res => {
            const result = res.data;
            setContent(result)
            setTimeout(() => { 
                setLoading(false)
            }, 1500)
            return res.data
        })
    }, []);

    useLayoutEffect(() => {
        //this runs before render
        loadContent()
    }, []);

    useEffect(() => {
        // Mounting
        
        document.title = pageTitle
        document.body.classList.add("portfolios-details-page")
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
                            <li><NavLink to="/portfolio">Portfolio</NavLink></li>
                            <li className="current">{pageTitle}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            
            <section id="portfolio-details" className="portfolio-details section">
                <div className="container" data-aos="fade-up">
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
                        <div className="portfolio-details-slider">
                            <Swiper
                                modules={[Navigation, Pagination, Scrollbar, A11y]}
                                navigation
                                pagination={{ clickable: true }}
                            >
                                { content.images.map((row, index) => {
                                    return (
                                        <SwiperSlide key={index}><img src={row.path} alt=""/></SwiperSlide>
                                    )
                                }) }
                            </Swiper>
                        </div>
                        <div className="row justify-content-between gy-4 mt-4">
                            <div className="col-lg-8" data-aos="fade-up">
                                <div className="portfolio-description">
                                    <h2>{content.portfolio.title}</h2>
                                    <div dangerouslySetInnerHTML={{__html: content.portfolio.details1}}></div>

                                     { content.testimonial.map((row, index) => {
                                         return (
                                            <div className="testimonial-item" key={index}>
                                                <p>
                                                    <i className="bi bi-quote quote-icon-left"></i>
                                                    <span>{row.quote}</span>
                                                    <i className="bi bi-quote quote-icon-right"></i>
                                                </p>
                                                <div>
                                                    <img src={row.image} className="testimonial-img" alt=""/>
                                                    <h3>{row.name}</h3>
                                                    <h4>{row.position}</h4>
                                                </div>
                                            </div>
                                         )
                                     }) }
                                    
                                    <div dangerouslySetInnerHTML={{__html: content.portfolio.details2}}></div>
                                </div>
                            </div>
                            <div className="col-lg-3" data-aos="fade-up" data-aos-delay="100">
                                <div className="portfolio-info">
                                <h3>Project information</h3>
                                    <ul>
                                        <li><strong>Category</strong> {content.portfolio.category_name}</li>
                                        <li><strong>Client</strong> {content.portfolio.customer_name}</li>
                                        <li><strong>Project date</strong> {moment(content.portfolio.project_date, "YYYY-MM-DD").format("DD/MMM/YYYY")}</li>
                                        <li><strong>Project URL</strong> <a href={content.portfolio.link} target="_blank">{content.portfolio.link}</a></li>
                                        <li><a href={content.portfolio.link} target="_blank" className="btn-visit align-self-start">Visit Website</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </> }
                </div>
            </section>
           

        </>
    )
}   

export default PortfolioDetailPage