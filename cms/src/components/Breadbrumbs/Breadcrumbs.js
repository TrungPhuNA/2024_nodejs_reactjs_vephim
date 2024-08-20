// -- React and related libs
import React from "react";
import { Link } from "react-router-dom";

// -- Reactstrap Imports
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

// -- Third Party Libs
import { v4 as uuidv4 } from "uuid";

// -- Component Styles
import s from "./Breadcrumbs.module.scss";

const Breadcrumbs = (props) => {

  const renderBreadcrumbs = () => {
    
    return props.routes.map((item, index) => {
      
      return (
        <BreadcrumbItem key={uuidv4()}>
          {(index !== 0) ? item.name
            :  <Link to={item.route}>
              {item.name}
            </Link>
          }
        </BreadcrumbItem>
      )
    })
  }
  return (
    <div className={s.breadcrumbs}>
      <div className="headline-2">{props.title}</div>
      {props.title !== "Dashboard" && props.routes?.length > 0 &&
      <Breadcrumb tag="nav" listTag="div">
        {renderBreadcrumbs()}
      </Breadcrumb>
      }
    </div>
  )
};

export default Breadcrumbs;
