import { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { NavLink  } from "react-router-dom"
import { Shimmer } from 'react-shimmer'
import AOS from "aos";
import API from '../api';


const TeamPage = () => {

    const pageTitle = "Team"
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
        await API.get("page/team").then(res => {
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
        document.body.classList.add("team-page")
        AosInit()
        return () => {
            // Unmount
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

           
            <section id="team" className={'team section'}>
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
          

        </>
    )
}   

export default TeamPage