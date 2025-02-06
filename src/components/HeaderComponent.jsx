import { useRef, Fragment } from "react"
import { NavLink } from "react-router-dom"


const HeaderComponent = ({ setting, menu }) => {

    const mobileNavToggleBtn = useRef()
   

    const mobileNavToogle = (e) => {
        e.stopPropagation();
        document.querySelector('body').classList.toggle('mobile-nav-active');
        mobileNavToggleBtn.current.classList.toggle('bi-list')
        mobileNavToggleBtn.current.classList.toggle('bi-x')
        e.nativeEvent.stopImmediatePropagation();
    }

    const handleDropDown = (e) => {
        e.stopPropagation();
        e.target.parentNode.classList.toggle('active');
        e.target.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.nativeEvent.stopImmediatePropagation();
    }

    return (
        <>
            <header id="header" className="header d-flex align-items-center sticky-top">
                <div className="container position-relative d-flex align-items-center">
                    <NavLink to={"/"} className="logo d-flex align-items-center me-auto">
                        <h1 className="sitename">{setting["site-name"]}</h1><span>.</span>
                    </NavLink>
                     <nav id="navmenu" className="navmenu">
                        <ul>
                            {Object.keys(menu).map((m, index) => {
                                return (
                                    <Fragment key={index}>
                                        {menu[m].children === undefined ?
                                            <li>
                                                <NavLink to={menu[m].path}>{menu[m].name}</NavLink>
                                            </li> :
                                            <li className="dropdown"><a href="#" onClick={mobileNavToogle}><span>{menu[m].name}</span> <i onClick={handleDropDown} className="bi bi-chevron-down toggle-dropdown"></i></a>
                                                <ul>
                                                    {Object.keys(menu[m].children).map((c, ci) => {
                                                        return (
                                                            <li key={ci}>
                                                                <NavLink to={menu[m].children[c].path}>{menu[m].children[c].name}</NavLink>
                                                            </li>
                                                        )
                                                    }) }
                                                </ul>
                                            </li>
                                        }
                                    </Fragment>
                                )
                            }) }
                        </ul>
                        <i ref={mobileNavToggleBtn} onClick={mobileNavToogle} className="mobile-nav-toggle d-xl-none bi bi-list"></i>
                    </nav>
                    <div className="header-social-links">
                        <a href={setting["company-twitter"]} target="_blank" className="twitter"><i className="bi bi-twitter-x"></i></a>
                        <a href={setting["company-facebook"]} target="_blank"  className="facebook"><i className="bi bi-facebook"></i></a>
                        <a href={setting["company-instagram"]} target="_blank"  className="instagram"><i className="bi bi-instagram"></i></a>
                        <a href={setting["company-linked-in"]} target="_blank"  className="linkedin"><i className="bi bi-linkedin"></i></a>
                    </div>
                </div>
            </header>
        </>
    )
}

export default HeaderComponent