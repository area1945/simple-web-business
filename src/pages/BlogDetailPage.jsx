import { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { NavLink, useSearchParams   } from "react-router-dom"
import API from '../api';
import { Shimmer } from 'react-shimmer'
import moment from 'moment'

const BlogDetailPage = () => {

    const pageTitle = "Blog Details"
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({})
    const [comment, setComment] = useState([])
    const [search, setSearch] = useState('')
    const [parent, setParent] = useState(null)
    const [loadingComment, setLoadingComment] = useState(true)
    const [loadingSubmitComment, setLoadingSubmitComment] = useState(false)
    const [searchParams] = useSearchParams();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [website, setWebsite] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const loadContent = useCallback(async () => {
        setLoading(true);
        let id = searchParams.get("id")
        await API.get("article/detail?id="+id).then(res => {
            const result = res.data;
            setContent(result)
            setTimeout(() => { 
                setLoading(false)
            }, 1500)
            return res.data
        })
    }, []);

    const loadComment = useCallback(async () => {
        setLoadingComment(true);
        let id = searchParams.get("id")
        await API.get("article/listcomment?id="+id).then(res => {
            const result = res.data;
            setComment(result)
            setTimeout(() => { 
                setLoadingComment(false)
            }, 1500)
            return res.data
        })
    }, []);

    const handleSubmit =  useCallback(async (event) => {
        event.preventDefault()

    }, [search])

    const reply = (event) => {
        event.preventDefault()
        setParent(event.target.getAttribute("data-parent"))
        window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" })
    }

    const submitComment = useCallback(async (event) => {

        event.preventDefault()

        setLoadingSubmitComment(true);
        setSuccess(false)

        let formData = {
            parent_uuid: parent,
            article_uuid: content.article.uuid,
            email: email,
            name: name,
            website: website,
            message: message
        }

        await API.post("article/createcomment", formData).then(res => {
            setTimeout(() => { 
                setError("")
                setLoadingSubmitComment(false)
                setSuccess(true)
                setName("")
                setEmail("")
                setWebsite("")
                setMessage("")
                setParent(null)
                loadComment()
            }, 1500)
            return res.data
        })
        .catch(function (error) {
            let errorMessage = error.response.data.message
            setLoadingSubmitComment(false)
            setError(errorMessage)
        });

    }, [name, email, website, message])

    const renderComment = (element) => {
        return (
            <>
                {Object.keys(element).map((item, index) => {
                    let row = element[item]
                    return (
                        <div key={index} id={row.uuid} className="comment">
                            <div className="d-flex">
                                <div className="comment-img"><img src={row.user_image} alt=""/></div>
                                <div>
                                    <h5><a href="#">{row.user_name}</a> <a href="#" data-parent={row.uuid} onClick={reply} className="reply"><i className="bi bi-reply-fill"></i> Reply</a></h5>
                                    <time dateTime={row.created_at}>{moment(row.created_at, "YYYY-MM-DD HH:mm:ss").format("DD/MMM/YYYY HH:mm:ss")}</time>
                                    <p>{row.comment}</p>
                                </div>
                            </div>
                            {row.children !== undefined ? <>
                                <div id={`comment-reply-${row.uuid}`} className="comment comment-reply">
                                    { renderComment(row.children) }
                                </div>
                            </> : <></>}
                        </div>
                    )
                }) }
            </>
        )
    }

    useLayoutEffect(() => {
        //this runs before render
        loadContent()
        loadComment()
    }, []);

    useEffect(() => {
        // Mounting
        document.title = pageTitle
        document.body.classList.add("blog-details-page")
        return () => {
            // Unmount
        }
    }, [loading, content, comment, loadingComment]);
    

    return (
        <>
            <div className="page-title accent-background">
                <div className="container d-lg-flex justify-content-between align-items-center">
                    <h1 className="mb-2 mb-lg-0">{pageTitle}</h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/blog">Blog</NavLink></li>
                            <li className="current">{pageTitle}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <section id="blog-details" className="blog-details section">
                            {loading ? <>
                                <Shimmer width={860} height={300} title={false} image={false}></Shimmer>
                            </> : <>
                                <div className="container">
                                    <article className="article">
                                        <div className="post-img">
                                            <img src={content.article.image} alt="" className="img-fluid"/>
                                        </div>
                                        <h2 className="title">{content.article.title}</h2>
                                        <div className="meta-top">
                                            <ul>
                                                <li className="d-flex align-items-center"><i className="bi bi-person"></i> <a href="#">{content.article.user_name}</a></li>
                                                <li className="d-flex align-items-center"><i className="bi bi-clock"></i> <a href="#"><time dateTime={content.article.published_at}>{moment(content.article.published_at, "YYYY-MM-DD HH:mm:ss").format("DD/MMM/YYYY")}</time></a></li>
                                                <li className="d-flex align-items-center"><i className="bi bi-chat-dots"></i> <a href="#">{content.article.total_comment} Comments</a></li>
                                            </ul>
                                        </div>
                                        <div className="content" dangerouslySetInnerHTML={{__html: content.article.details}}></div>
                                        <div className="meta-bottom">
                                            <i className="bi bi-folder"></i>
                                            <ul className="cats">
                                                {
                                                    content.category_articles.map((row, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <NavLink to={`/blog?category=${row.uuid}`}>{row.name}</NavLink>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                            <i className="bi bi-tags"></i>
                                            <ul className="tags">
                                                {
                                                    content.tag_articles.map((row, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <NavLink to={`/blog?tag=${row.uuid}`}>{row.name}</NavLink>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </article>
                                </div>
                            </>}
                        </section>
                        <section id="blog-comments" className="blog-comments section">
                            { loadingComment ? <>
                                <div className="p-1">
                                    <Shimmer width={860} height={100} title={false} image={false}></Shimmer>
                                </div>
                            </> : <>
                                { content.article.total_comment === 0 ? <>
                                    <div className="container">
                                        <h4 className="comments-count">No Comments</h4>   
                                    </div>
                                </> : <>
                                    <div className="container">
                                        <h4 className="comments-count">{content.article.total_comment} Comments</h4>   
                                        { renderComment(comment) }
                                    </div>
                                </>}
                            </>}
                        </section>
                        {loading ? <>
                            <div className="p-1 mb-4">
                                <Shimmer width={860} height={100} title={false} image={false}></Shimmer>
                            </div>
                        </> : <>
                             <section id="comment-form" className="comment-form section">
                                <div className="container">
                                    <form onSubmit={submitComment}>
                                        <h4>Post Comment</h4>
                                        <p>Your email address will not be published. Required fields are marked * </p>
                                        <div className="row">
                                            <div className="col-md-6 form-group">
                                                <input name="name" type="text" className="form-control" readOnly={loadingSubmitComment} placeholder="Your Name*" value={name} onChange={(e) => setName(e.target.value)} required />
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <input name="email" type="text" className="form-control"  readOnly={loadingSubmitComment} placeholder="Your Email*"  value={email} onChange={(e) => setEmail(e.target.value)}  required />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col form-group">
                                                <input name="website" type="text" className="form-control"  readOnly={loadingSubmitComment} placeholder="Your Website" value={website} onChange={(e) => setWebsite(e.target.value)}  required />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col form-group">
                                                <textarea name="comment" className="form-control"  readOnly={loadingSubmitComment} placeholder="Your Comment*" value={message} onChange={(e) => setMessage(e.target.value)}  required></textarea>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            { success ? <>
                                                <div className="alert alert-success">
                                                    <strong>Your comment has been added.</strong>
                                                </div>
                                            </> : <></> }
                                            { error ? <>
                                                <div className="alert alert-danger">
                                                    <strong>{error}</strong>
                                                </div>
                                            </> : <></> }
                                            <button type="submit" className="btn btn-primary"  disabled={loadingSubmitComment}>
                                                { !loadingSubmitComment ? 'Post Comment' : 'Send Comment...' }
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </section>
                        </>}
                    </div>
                    <div className="col-lg-4 sidebar">
                        <div className="widgets-container">
                            {loading ? <>
                                <Shimmer width={360} height={300} title={false} image={false}></Shimmer>
                            </> : <>
                                <div className="widgets-container">
                                    <div className="blog-author-widget widget-item">
                                        <div className="d-flex flex-column align-items-center">
                                            <img src={content.article.user_image} className="rounded-circle flex-shrink-0" alt=""/>
                                            <h4>{content.article.user_name}</h4>
                                            <div className="social-links">
                                                { content.accounts.map((row, index) => {
                                                    return (
                                                        <a key={index} href={row.sosmed_url}><i className={row.sosmed_icon}></i></a>
                                                    )
                                                }) }
                                            </div>
                                            <p>
                                               {content.article.user_about_me}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="search-widget widget-item">
                                        <h3 className="widget-title">Search</h3>
                                        <form onSubmit={handleSubmit}>
                                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}></input>
                                            <button type="submit" title="Search"><i className="bi bi-search"></i></button>
                                        </form>
                                    </div>
                                    <div className="recent-posts-widget widget-item">
                                        <h3 className="widget-title">Recent Posts</h3>
                                        { content.recents.map((row, index) => {
                                            return (
                                                <div key={index} className="post-item">
                                                    <h4>    
                                                        <NavLink to={`/blog-detail?id=${row.uuid}`}>{row.title}</NavLink>
                                                    </h4>
                                                    <time dateTime={row.published_at}>{moment(row.published_at, "YYYY-MM-DD HH:mm:ss").format("DD/MMM/YYYY")}</time>
                                                </div>
                                            )
                                        }) }
                                    </div>
                                    <div className="tags-widget widget-item">
                                        <h3 className="widget-title">Tags</h3>
                                        <ul>
                                            {
                                                content.tags.map((row, index) => {
                                                    return (
                                                        <li key={index}>
                                                             <NavLink to={`/blog?tag=${row.uuid}`}>{row.name}</NavLink>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </>}
                         </div>
                    </div>
                </div>
            </div>

            

        </>
    )
}   

export default BlogDetailPage