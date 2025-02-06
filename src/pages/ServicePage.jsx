import { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { NavLink  } from "react-router-dom"
import { Shimmer } from 'react-shimmer'
import AOS from "aos";
import API from '../api';

const ServicePage = () => {

    const pageTitle = "Service"
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
        await API.get("page/service").then(res => {
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
        document.body.classList.add("services-page")
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

           
            <section id="services" className={loading ? 'services section' : 'services section light-background'}>
                {loading ? <>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">
                                <Shimmer width={430} height={300} title={false} image={false}></Shimmer>
                            </div>
                                <div className="col-lg-4">
                                <Shimmer width={430} height={300} title={false} image={false}></Shimmer>
                            </div>
                                <div className="col-lg-4">
                                <Shimmer width={430} height={300} title={false} image={false}></Shimmer>
                            </div>
                        </div>
                    </div>
                </> : <>
                    <div className="container">
                        <div className="row gy-4">
                            {content.services.map((row, index) => {
                                let num = index + 1
                                let delay = num * 100
                                return (
                                    <div key={index} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={delay}>
                                        <div className={`service-item ${row.color.name} position-relative`}>
                                            <div className="icon">
                                                <svg width="100" height="100" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke="none" strokeWidth="0" fill={row.color.code} d="M300,521.0016835830174C376.1290562159157,517.8887921683347,466.0731472004068,529.7835943286574,510.70327084640275,468.03025145048787C554.3714126377745,407.6079735673963,508.03601936045806,328.9844924480964,491.2728898941984,256.3432110539036C474.5976632858925,184.082847569629,479.9380746630129,96.60480741107993,416.23090153303,58.64404602377083C348.86323505073057,18.502131276798302,261.93793281208167,40.57373210992963,193.5410806939664,78.93577620505333C130.42746243093433,114.334589627462,98.30271207620316,179.96522072025542,76.75703585869454,249.04625023123273C51.97151888228291,328.5150500222984,13.704378332031375,421.85034740162234,66.52175969318436,486.19268352777647C119.04800174914682,550.1803526380478,217.28368757567262,524.383925680826,300,521.0016835830174"></path>
                                                </svg>
                                                <i className={row.icon}></i>
                                            </div>
                                            <NavLink to={`/service-detail?id=${row.uuid}`} className="stretched-link">
                                                <h3>{row.title}</h3>
                                            </NavLink>
                                            <p>{row.description}</p>
                                        </div>
                                    </div>
                                )    
                            }) }
                        </div>
                    </div>
                </>}
            </section>
           
            <section id="features" className="features section">
                { loading ? <>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">
                                <Shimmer width={430} height={300} title={false} image={false}></Shimmer>
                            </div>
                                <div className="col-lg-4">
                                <Shimmer width={430} height={300} title={false} image={false}></Shimmer>
                            </div>
                                <div className="col-lg-4">
                                <Shimmer width={430} height={300} title={false} image={false}></Shimmer>
                            </div>
                        </div>
                    </div>
                </> : <>
                    <div className="container section-title" data-aos="fade-up">
                        <h2>{content.feature_section.title}</h2>
                        <p>{content.feature_section.description}</p>
                    </div>
                    <div className="container">
                        <div className="row gy-4">
                            { content.features.map((row, index) => {
                                let delay = 100 * (index + 1)
                                return (
                                    <div key={index} className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay={delay}>
                                        <div className="features-item">
                                            <i className={row.icon} style={{ color: row.color.code }}></i>
                                            <h3><a href="#" className="stretched-link">{row.title}</a></h3>
                                        </div>
                                    </div>
                                )
                            }) }
                        </div>
                    </div>
                </> }
            </section>        
           

        </>
    )
}   

export default ServicePage