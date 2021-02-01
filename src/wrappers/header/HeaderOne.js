import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import { connect } from "react-redux";
import Logo from "../../components/header/Logo";
import NavMenu from "../../components/header/NavMenu";
import IconGroup from "../../components/header/IconGroup";
import MobileMenu from "../../components/header/MobileMenu";
import HeaderTop from "../../components/header/HeaderTop";
import WebService from '../../util/webService';
import constant from '../../util/constant';
// import { setLocalData } from '../../util/helper';
import { setMerchant } from "../../redux/actions/storeAction";
import { getCurrentLocation } from "../../redux/actions/userAction";
const HeaderOne = ({
  setMerchant,
  merchant,
  layout,
  top,
  borderStyle,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass,
  defaultStore,
  getCurrentLocation,
  currentLanguageCode
}) => {
  const history = useHistory();
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [contentData, setContentData] = useState([]);

  useEffect(() => {
    setMerchant()
    getCurrentLocation()
    getCategoryHierarchy();
    getContent();
    const header = document.querySelector(".sticky-bar");
    setHeaderTop(header.offsetTop);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

    // localStorage.setItem('selectedLang', currentLanguageCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCategoryHierarchy = async () => {
    let action = constant.ACTION.CATEGORY + '?count=20&page=0&store=' + defaultStore + '&lang=' + currentLanguageCode;
    try {
      let response = await WebService.get(action);
      if (response) {
        setCategoryData(response.categories);
      }
    } catch (error) {
      // console.log(error.messages)
      // console.log(error)
      history.push('/not-found')
    }


  }
  const getContent = async () => {
    let action = constant.ACTION.CONTENT + constant.ACTION.PAGES + '?&store=' + defaultStore + '&lang=' + currentLanguageCode;
    try {
      let response = await WebService.get(action);
      if (response) {
        setContentData(response)
      }
    } catch (error) {
    }
  }
  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  return (
    <header
      className={`header-area clearfix ${headerBgClass ? headerBgClass : ""} ${headerPositionClass ? headerPositionClass : ""}`}>
      <div
        className={`${headerPaddingClass ? headerPaddingClass : ""} ${
          top === "visible" ? "d-none d-lg-block" : "d-none"} header-top-area ${
          borderStyle === "fluid-border" ? "border-none" : ""}`}>
        <div className={layout === "container-fluid" ? layout : "container"}>
          {/* header top */}
          <HeaderTop borderStyle={borderStyle} />
        </div>
      </div>

      <div
        className={`${
          headerPaddingClass ? headerPaddingClass : ""
          } sticky-bar header-res-padding clearfix ${
          scroll > headerTop ? "stick" : ""
          }`}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          <div className="row">
            <div className="col-xl-2 col-lg-2 col-md-6 col-4">
              {/* header logo */}
              {
                merchant.logo != null && <Logo imageUrl={merchant.logo.path} logoClass="logo" />
              }

            </div>
            <div className="col-xl-8 col-lg-8 d-none d-lg-block">
              {/* Nav menu */}
              <NavMenu categories={categoryData} contents={contentData} />
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-8">
              {/* Icon group */}
              <IconGroup />
            </div>
          </div>
        </div>
        {/* mobile menu */}
        <MobileMenu categories={categoryData} contents={contentData} />
      </div>
    </header>
  );
};

HeaderOne.propTypes = {
  // merchant: PropTypes.string,
  borderStyle: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  layout: PropTypes.string,
  top: PropTypes.string,
  setMerchant: PropTypes.func
};

const mapStateToProps = state => {
  return {
    merchant: state.merchantData.merchant,
    currentLanguageCode: state.multilanguage.currentLanguageCode,
    defaultStore: state.merchantData.defaultStore
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMerchant: () => {
      dispatch(setMerchant());
    },
    getCurrentLocation: () => {
      dispatch(getCurrentLocation())
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(multilanguage(HeaderOne));

// export default HeaderOne;
