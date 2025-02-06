import { useEffect, useState, useCallback, useLayoutEffect } from "react"
import AOS from "aos";
import { NavLink } from "react-router-dom"
import { Shimmer } from 'react-shimmer'
import API from '../api';

const AboutPage = () => {

    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({})

    const WayPointInit = (id, script, destroy) => {
        if (destroy) {
            document.getElementById(id).remove();
        } else {
            const mainScript = document.createElement("script");
            mainScript.setAttribute("id", id);
            mainScript.setAttribute("src", `/${script}`);
            document.body.appendChild(mainScript);
        }   
    }
   
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
        await API.get("page/about").then(res => {
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
        document.title = "About"
        document.body.classList.add("about-page")

        AosInit()   
        WayPointInit("waypoint-plugin", "noframework.waypoints.js", false)
        WayPointInit("waypoint-script", "waypoint.js", false)
        
        return () => {
            // Unmount
            AosInit()
            WayPointInit("waypoint-plugin", "noframework.waypoints.js", true)
            WayPointInit("waypoint-script", "waypoint.js", true)
        }
    }, [loading, content]);

    return (
        <>
            
            <div className="page-title accent-background">
                <div className="container d-lg-flex justify-content-between align-items-center">
                    <h1 className="mb-2 mb-lg-0">About</h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><NavLink to="/">Home</NavLink></li>
                            <li className="current">About</li>
                        </ol>
                    </nav>
                </div>
            </div>
        
            <section id="about" className="about section">
                <div className="container">
                    <div className="row position-relative">
                        {loading ? <>
                            <div className="col-lg-4">
                                <Shimmer width={430} height={300} title={false} image={false}></Shimmer>
                            </div>
                            <div className="col-lg-6">
                                <Shimmer width={860} height={300} title={false} image={false}></Shimmer>
                            </div>
                        </> : <>
                            <div className="col-lg-7 about-img" data-aos="zoom-out" data-aos-delay="200"><img src={content.about.image} alt=""/></div>
                            <div className="col-lg-7" data-aos="fade-up" data-aos-delay="100" dangerouslySetInnerHTML={{__html: content.about.details}}></div>
                        </>}
                    </div>
                </div>
            </section>

           
            <section id="team" className={loading ? 'team section' : 'team section light-background'}>
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
                    <div className="container section-title" data-aos="fade-up">
                        <h2>{content.team_section.title}</h2>
                        <p>{content.team_section.description}</p>
                    </div>
                    <div className="container">
                        <div className="row gy-4">
                            {content.teams.map((row, index) => {
                                let delay = 100 * (index +1)
                                return (
                                    <div key={index} className="col-lg-3 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay={delay}>
                                        <div className="team-member">
                                            <div className="member-img">
                                                <img src={row.image} className="img-fluid" alt=""/>
                                                <div className="social">
                                                    { content.team_sosmend.filter(x => x.entity_uuid === row.uuid).map((rr, idx) => {
                                                        return (
                                                           <a key={idx} target="_blank" href={`${rr.url}${rr.username}`}><i className={rr.icon}></i></a>
                                                        )
                                                    }) }
                                                </div>
                                            </div>
                                            <div className="member-info">
                                                <h4>{row.name}</h4>
                                                <span>{row.position}</span>
                                            </div>
                                        </div>
                                    </div>
                                )    
                            }) }
                        </div>
                    </div>
                </>}
            </section>

            <section id="skills" className="skills section">
                { loading ? <>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <Shimmer width={645} height={200} title={false} image={false}></Shimmer>
                            </div>
                            <div className="col-lg-6">
                                <Shimmer width={645} height={200} title={false} image={false}></Shimmer>
                            </div>
                        </div>
                    </div>
                </> : <>
                    <div className="container section-title" data-aos="fade-up">
                        <h2>{content.skill_section.title}</h2>
                        <p>{content.skill_section.description}</p>
                    </div>
                    <div className="container" data-aos="fade-up" data-aos-delay="100">
                        <div className="row skills-content skills-animation">
                            <div className="col-lg-6">
                               {content.skills.slice(0, 3).map((row, index) => {
                                    return (
                                        <div key={index} className="progress">
                                            <span className="skill"><span>{row.name}</span> <i className="val">{row.rate} %</i></span>
                                            <div className="progress-bar-wrap">
                                                <div className="progress-bar" role="progressbar" aria-valuenow={parseInt(row.rate)} aria-valuemin="0" aria-valuemax={parseInt(row.rate)}></div>
                                            </div>
                                        </div>
                                    )
                               }) }
                            </div>
                            <div className="col-lg-6">
                                {content.skills.slice(3).map((row, index) => {
                                    return (
                                        <div key={index} className="progress">
                                            <span className="skill"><span>{row.name}</span> <i className="val">{row.rate} %</i></span>
                                            <div className="progress-bar-wrap">
                                                <div className="progress-bar" role="progressbar" aria-valuenow={parseInt(row.rate)} aria-valuemin="0" aria-valuemax={parseInt(row.rate)}></div>
                                            </div>
                                        </div>
                                    )
                               }) }
                            </div>
                        </div>
                    </div>
                </> }
            </section>

            <section id="clients" className="clients section">
                {loading ? <>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3">
                                <Shimmer width={322.5} height={200} title={false} image={false}></Shimmer>
                            </div>
                            <div className="col-lg-3">
                                <Shimmer width={322.5} height={200} title={false} image={false}></Shimmer>
                            </div>
                            <div className="col-lg-3">
                                <Shimmer width={322.5} height={200} title={false} image={false}></Shimmer>
                            </div>
                            <div className="col-lg-3">
                                <Shimmer width={322.5} height={200} title={false} image={false}></Shimmer>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-lg-3">
                                <Shimmer width={322.5} height={200} title={false} image={false}></Shimmer>
                            </div>
                            <div className="col-lg-3">
                                <Shimmer width={322.5} height={200} title={false} image={false}></Shimmer>
                            </div>
                            <div className="col-lg-3">
                                <Shimmer width={322.5} height={200} title={false} image={false}></Shimmer>
                            </div>
                            <div className="col-lg-3">
                                <Shimmer width={322.5} height={200} title={false} image={false}></Shimmer>
                            </div>
                        </div>
                    </div>
                </> : <>
                    <div className="container section-title" data-aos="fade-up">
                        <h2>{content.customer_section.title}</h2>
                        <p>{content.customer_section.description}</p>
                    </div>
                    <div className="container" data-aos="fade-up" data-aos-delay="100">
                        <div className="row g-0 clients-wrap">
                            { content.customers.map((row, index) => {
                                return (
                                    <div key={index} className="col-xl-3 col-md-4 client-logo">
                                        <img src={row.image} className="img-fluid" alt=""/>
                                    </div>
                                )
                            }) }
                        </div>
                    </div>
                </>}
            </section>
           
        
        </>
    )
}   

export default AboutPage