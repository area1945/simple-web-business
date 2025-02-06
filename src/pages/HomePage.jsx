import { useEffect, useState, useRef, useCallback, useLayoutEffect  } from "react"
import { Shimmer } from 'react-shimmer'
import AOS from "aos";
import Isotope from 'isotope-layout';
import GLightbox from "glightbox";
import API from '../api';
import { NavLink } from "react-router-dom"

const HomePage = () => {

    const [slider, setSlider] = useState(0)
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({})
    const [filterKey, setFilterKey] = useState('*')
    const isotope = useRef()
    
   
    const onClickSliderNext = (e) => {
        e.preventDefault()
        let currentIndex = slider
        currentIndex = currentIndex + 1
        setSlider(currentIndex)
    }

    const onClickSliderPrev = (e) => {
        e.preventDefault()
        let currentIndex = slider
        currentIndex = currentIndex - 1
        setSlider(currentIndex)
    }

    const randomIntFromInterval= (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

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
        await API.get("page/home").then(res => {
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

        let id;

        document.title = "Home"
        document.body.classList.add("index-page")
        
        if (!loading)
        {
            AosInit()
            GLightbox({ selector: '.glightbox' });

            isotope.current = new Isotope('.isotope-container', {
                itemSelector: '.isotope-item',
                layoutMode: 'masonry',
            })

            filterKey === '*' ? isotope.current.arrange({ filter: `*` }) : isotope.current.arrange({ filter: `.${filterKey}` })

            id = setInterval(() => {
                let sliderIndex = randomIntFromInterval(0, 2)
                setSlider(sliderIndex)
            }, 3000)
            
        }
       
        return () => {
           // Unmount
           document.body.classList.remove("index-page")
           isotope.current?.destroy()
           AosInit()
           clearInterval(id)
        }
    }, [loading, slider, filterKey, content]);

    return (
       <>

        <section id="hero" className="hero section dark-background">
            <div id="hero-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                {loading ? <>
                    <div className="carousel-item active">
                        <img src="https://placehold.co/600x400?text=Please+Wait.." alt=""/>   
                    </div>
                    <ol className="carousel-indicators">
                        <li data-bs-target="#hero-carousel" data-bs-slide-to="0" onClick={() => setSlider(0)} className={slider === 0 ? 'active' : ''}></li>
                    </ol>
                </> : <>
                    {content.sliders.map((row, index) => {
                        return (
                            <div key={index} className={slider === index ? 'carousel-item active' : 'carousel-item'}>
                                <img src={row.image} alt=""/>
                                <div className="container">
                                    <h2>{row.title}</h2>
                                    <p>{row.description}</p>
                                    <a href={row.url} target="_blank" className="btn-get-started">Read More</a>
                                </div>
                            </div>
                        )
                    })}
                    <a className={slider === 0 ? "carousel-control-prev d-none" : "carousel-control-prev"} onClick={onClickSliderPrev} role="button" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true"></span>
                    </a>
                    <a className={slider === 2 ? "carousel-control-next d-none" : "carousel-control-next"} onClick={onClickSliderNext} role="button" data-bs-slide="next">
                        <span className="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true"></span>
                    </a>
                    <ol className="carousel-indicators">
                        {content.sliders.map((row, index) => {
                            return (
                                <li key={index} data-bs-target="#hero-carousel" data-bs-slide-to={index} onClick={() => setSlider(index)} className={slider === index ? 'active' : ''}></li>
                            )
                        })}
                    </ol>
                </>}
            </div>
        </section>

      
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

export default HomePage