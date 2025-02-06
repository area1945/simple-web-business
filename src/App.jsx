import HeaderComponent from "./components/HeaderComponent"
import FooterComponent from "./components/FooterComponent"
import BlogPage from "./pages/BlogPage"
import BlogDetailPage from "./pages/BlogDetailPage"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import ErrorPage from "./pages/ErrorPage"
import ContactPage from "./pages/ContactPage"
import PortfolioPage from "./pages/PortfolioPage"
import PortfolioDetailPage from "./pages/PortfolioDetailPage"
import PricingPage from "./pages/PricingPage"
import ServicePage from "./pages/ServicePage"
import ServiceDetailPage from "./pages/ServiceDetailPage"
import TeamPage from "./pages/TeamPage"
import TestimonialPage from "./pages/TestimonialPage"
import TermOfServicePage from "./pages/TermOfServicePage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import { createRef, useEffect, useState, useCallback } from "react"
import {
  Route,
  HashRouter,
  Routes
} from "react-router-dom";
import API from './api';

const App = () => {

   const preloaderElement = createRef()
   const scrollTopElement = createRef()
   const [loading, setLoading] = useState(false)
   const [setting, setSetting] = useState({})
   const [newsletter, setNewsletter] = useState({})
   const [contact, setContact] = useState({})
   const [services, setServices] = useState([])
   const [menu, setMenu] = useState([])
   const [loaded, setLoaded] = useState(false)

   const toggleScrollTop = () => {
      let scrollTop = scrollTopElement.current
      if (scrollTop) {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }
   }

   const scrollToTop = (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
  }

  const getComponent = useCallback(async () => {
      setLoading(true);
      await API.get("page/component").then(res => {
        const result = res.data;
        setSetting(result.setting)
        setMenu(result.menu)
        setNewsletter(result.newsletter)
        setServices(result.services)
        setContact(result.contact)
        setTimeout(() => { 
           setLoading(false)
           setLoaded(true)
        }, 1500)
    })
  }, []);

  useEffect(() => {
     
      if (!document.getElementById("web-icon"))
      {
        const mainScript = document.createElement("link");
        mainScript.setAttribute("id", "web-icon");
        mainScript.setAttribute("rel", "icon");
        mainScript.setAttribute("type", "https://i.ibb.co.com/5jy1gLh/favicon.png");
        mainScript.setAttribute("href", "image/png");
        document.head.appendChild(mainScript);
      }
     
      toggleScrollTop()
      window.addEventListener('scroll', toggleScrollTop);
      
      getComponent()
      
      return () => {
        window.removeEventListener('scroll', toggleScrollTop);
      }
    }, []);

   return (
     <>
       <HashRouter>
          { loaded ? <>
          
            <HeaderComponent setting={setting} menu={menu} />
              <main className="main">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog-detail" element={<BlogDetailPage />} />
                  <Route path="/contact" element={<ContactPage setting={setting} contact={contact} />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/portfolio-detail" element={<PortfolioDetailPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/service" element={<ServicePage />} />
                  <Route path="/service-detail" element={<ServiceDetailPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/testimonial" element={<TestimonialPage />} />
                  <Route path="/term-of-service" element={<TermOfServicePage setting={setting} />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage setting={setting} />} />
                  <Route path="*" element={<ErrorPage />}/>
                </Routes>
              </main>
              <FooterComponent setting={setting} newsletter={newsletter} services={services} />
              <a href="#" id="scroll-top" onClick={scrollToTop} ref={scrollTopElement} className="scroll-top d-flex align-items-center justify-content-center">
                <i className="bi bi-arrow-up-short"></i>
              </a>
          
          </> : <></> }
          { loading ? <div id="preloader" ref={preloaderElement}></div> : <></>  }
       </HashRouter>
      </>
   )
}

export default App