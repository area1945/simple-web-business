import { useEffect, useState, useRef, useCallback, useLayoutEffect  } from "react"
import { Shimmer } from 'react-shimmer'
import AOS from "aos";
import Isotope from 'isotope-layout';
import GLightbox from "glightbox";
import API from '../api';
import { NavLink } from "react-router-dom"

const PortfolioPage = () => {

    const pageTitle = "Portfolio"
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({})
    const [filterKey, setFilterKey] = useState('*')
    const isotope = useRef()

    const handleFilterKeyChange = key => () => setFilterKey(key)

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
        await API.get("page/portfolio").then(res => {
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

        document.title = "Portfolio"
        document.body.classList.add("portfolio-page")
        
        if (!loading)
        {
            AosInit()
            GLightbox({ selector: '.glightbox' });

            isotope.current = new Isotope('.isotope-container', {
                itemSelector: '.isotope-item',
                layoutMode: 'masonry',
            })

            filterKey === '*' ? isotope.current.arrange({ filter: `*` }) : isotope.current.arrange({ filter: `.${filterKey}` })
        }
       
        return () => {
           // Unmount
           document.body.classList.remove("portfolio-page")
           isotope.current?.destroy()
           AosInit()
        }
    }, [loading,  filterKey, content]);

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

            <section id="portfolio" className="portfolio section">
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
                        <div className="row mt-2">
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
                        <div className="row mt-2">
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
                        <h2>{content.portfolio_section.title}</h2>
                        <p>{content.portfolio_section.description}</p>
                    </div>
                    <div className="container">
                        <div className="isotope-layout"  data-default-filter="*" data-layout="masonry" data-sort="original-order">
                            <ul className="portfolio-filters isotope-filters" data-aos="fade-up" data-aos-delay="100">
                                <li className={filterKey === '*' ? 'filter-active' : ''} onClick={handleFilterKeyChange('*')}>All</li>
                                {content.categories.map((row, index) => {
                                    let code = `filer-${row.slug}`
                                    return (
                                        <li key={index} className={filterKey === code ? 'filter-active' : ''} onClick={handleFilterKeyChange(code)}>{row.name}</li>
                                    )    
                                }) }
                            </ul>
                        
                            <div className="row gy-4 isotope-container"  data-aos="fade-up" data-aos-delay="200">
                                {content.portfolio.map((row, index) => {
                                let code = `filer-${row.category_slug}`
                                return (
                                        <div key={index} className={`col-lg-4 col-md-6 portfolio-item isotope-item ${code}`}>
                                            <img src={row.image} className="img-fluid" alt="" />
                                            <div className="portfolio-info">
                                                <h4>{row.name}</h4>
                                                <p>{row.description}</p>
                                                <a href={row.image} title={row.name} data-gallery="portfolio-gallery-app" className="glightbox preview-link"><i className="bi bi-zoom-in"></i></a>
                                                <NavLink to={`/portfolio-detail?id=${row.uuid}`} title="More Details" className="details-link">
                                                    <i className="bi bi-link-45deg"></i>
                                                </NavLink>
                                            </div>
                                        </div>
                                )
                            })}
                            </div>
                        
                        </div>
                    </div>
                </>}
            </section>

            
        </>
    )
}   

export default PortfolioPage