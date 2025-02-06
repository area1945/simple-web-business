import { useEffect, useState, useCallback, useLayoutEffect, createRef } from "react";
import { NavLink, useSearchParams  } from "react-router-dom"
import { Shimmer } from 'react-shimmer'
import moment from 'moment'
import ReactPaginate from 'react-paginate'
import API from '../api'


const BlogPage = () => {

    const pageTitle = "Blog"
    const itemsPerPage = 6
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({})
    const [pageCount, setPageCount] = useState(0);
    const [searchParams] = useSearchParams();
    const paginate = createRef()

    const loadContent = useCallback(async (itemOffset) => {

        setLoading(true);
        
        let url = `article/list?offset=${itemOffset}&limit=${itemsPerPage}`

        if(searchParams.get("tag")){
            url += `&tag=${searchParams.get("tag")}`
        }

        if(searchParams.get("category")){
            url += `&category=${searchParams.get("category")}`
        }

        await API.get(url).then(res => {
            const result = res.data;
            const pageCount = Math.ceil(result.total / itemsPerPage);
            setPageCount(pageCount)
            setContent(result)
            setTimeout(() => { 
                setLoading(false)
            }, 1500)
            return res.data
        })
    }, [content, pageCount]);

    const handlePageClick = (event) => {
        let page = event.selected + 1
        let offset = (page - 1) * itemsPerPage
        loadContent(offset)
    }
    
    useLayoutEffect(() => {
        //this runs before render
        loadContent(0)
    }, []);

    useEffect(() => {
        // Mounting
        document.title = pageTitle
        document.body.classList.add("blog-page")
        
        return () => {
            // Unmount
        }
     }, [loading]);

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

            <section id="blog-posts" className="blog-posts section">
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
                    <div className="container">
                        <div className="row gy-4">
                            { content.list.map((row, index) => {
                                return (
                                    <div key={index} className="col-lg-4">
                                        <article className="position-relative h-100">
                                            <div className="post-img position-relative overflow-hidden">
                                                <img src={row.image} className="img-fluid" alt=""/>
                                                <span className="post-date">{moment(row.published_at, "YYYY-MM-DD").format("DD/MMM/YYYY")}</span>
                                            </div>
                                            <div className="post-content d-flex flex-column">
                                                <h3 className="post-title">{row.title}</h3>
                                                <div className="meta d-flex align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-person"></i> <span className="ps-2">{row.author_name}</span>
                                                    </div>
                                                    <span className="px-3 text-black-50">/</span>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-folder2"></i> <span className="ps-2">{row.categories}</span>
                                                    </div>
                                                </div>
                                                <p>
                                                    {row.description}
                                                </p>
                                                <hr></hr>
                                                <NavLink to={`/blog-detail?id=${row.uuid}`} className="readmore stretched-link">
                                                    <span>Read More</span><i className="bi bi-arrow-right"></i>
                                                </NavLink>
                                            </div>
                                        </article>
                                    </div>
                                )
                            }) }
                        </div>    
                     </div>
                </>}
            </section>
            
            <section id="blog-pagination" className="blog-pagination section">
                <div className="container">
                    <div className="d-flex justify-content-center">
                        <ReactPaginate
                            ref={paginate}
                            breakLabel="..."
                            activeClassName="active"
                            onPageChange={handlePageClick}
                            pageCount={pageCount}
                            renderOnZeroPageCount={null}
                        />
                    </div>
                </div>
            </section>

        </>
    )
}   

export default BlogPage