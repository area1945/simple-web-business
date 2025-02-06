import { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { NavLink  } from "react-router-dom"
import { Shimmer } from 'react-shimmer'
import AOS from "aos";
import API from '../api';

const TestimonialPage = () => {

    const pageTitle = "Testimonial"
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({})

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
        await API.get("page/testimonial").then(res => {
            const result = res.data;
            setContent(result)
            setTimeout(() => { 
                setLoading(false)
            }, 1500)
            return res.data
        })
    }, []);

    const getRating = (num) => {
        return Array.from({length: num}, (item, index) => 
            <i key={index} className="bi bi-star-fill"></i>
        );
    }

    useLayoutEffect(() => {
        //this runs before render
        loadContent()
    }, []);

    useEffect(() => {
        // Mounting
        document.title = pageTitle
        document.body.classList.add("testimonial-page")
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
                            <li className="current">{pageTitle}</li>
                        </ol>
                    </nav>
                </div>
            </div>

         
            <section id="testimonials" className="testimonials section">
                <div className="container">
                    <div className="row gy-4">
                       { loading ? <>
                            <div className="col-lg-4">
                                <Shimmer width={430} height={300} title={false} image={false}></Shimmer>
                            </div>
                            <div className="col-lg-4">
                                <Shimmer width={430} height={300} title={false} image={false}></Shimmer>
                            </div>
                            <div className="col-lg-4">
                                <Shimmer width={430} height={300} title={false} image={false}></Shimmer>
                            </div>
                       </> : <>
                            { content.testimonial.map((row, index) => {
                                let delay = 100 * (index + 1)
                                return (
                                    <div key={index} className="col-lg-6" data-aos="fade-up" data-aos-delay={delay}>
                                        <div className="testimonial-item">
                                            <img src={row.image} className="testimonial-img" alt="" />
                                            <h3>{row.name}</h3>
                                            <h4>{row.position}</h4>
                                            <div className="stars">
                                                {getRating(row.rate)}
                                            </div>
                                            <p>
                                                <i className="bi bi-quote quote-icon-left"></i>
                                                <span>{row.quote}</span>
                                                <i className="bi bi-quote quote-icon-right"></i>
                                            </p>
                                        </div>
                                    </div>
                                )
                            }) }
                       </> }
                    </div>
                </div>
            </section>


        </>
    )
}   

export default TestimonialPage