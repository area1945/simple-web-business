import { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { NavLink  } from "react-router-dom"
import { Shimmer } from 'react-shimmer'
import AOS from "aos";
import API from '../api';

const PricingPage = () => {

    const pageTitle = "Pricing"
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
        await API.get("page/pricing").then(res => {
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
        document.body.classList.add("pricing-page")
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

           
            <section id="pricing" className="pricing section">
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
                            { content.pricing.map((row, index) => {
                                let delay = 100 * (index + 1)
                                return (
                                    <div key={index} className="col-lg-4" data-aos="zoom-in" data-aos-delay={delay}>
                                        <div className="pricing-item featured">
                                            { row.featured === 1  ? <>
                                                <p className="popular">Popular</p>
                                            </> : <></> }
                                            <h3>{row.name}</h3>
                                            <p className="description">{row.description}</p>
                                            <h4><sup>{row.currency}</sup>{parseFloat(row.rate).toFixed(1)}<span> / {row.uom}</span></h4>
                                            <a href={row.url} target="_blank" className="cta-btn">Start a free trial</a>
                                            { row.credircard === 0 ? <>
                                                <p className="text-center small">No credit card required</p>
                                            </> : <></> }
                                            <ul dangerouslySetInnerHTML={{__html: row.details}}></ul>
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

export default PricingPage