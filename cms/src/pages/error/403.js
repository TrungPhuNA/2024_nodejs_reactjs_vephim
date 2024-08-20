import React from "react";
import
{
	Button,
} from "reactstrap";
import { Link } from "react-router-dom";

import FooterIcon from "../../components/Icons/FooterIcon.js";
import Widget from "../../components/Widget/Widget.js";

const ForbiddenPage = () =>
{
	return (
		<div className="error-box">
			<div className="error-body text-center">
				<h1 className="error-title text-danger">403</h1>
				<h3 className="text-uppercase error-subtitle text-danger">Không có quyền truy cập !</h3>
				<p className="text-muted m-t-30 m-b-30">Bạn không có quyền truy cập trang này!</p>

			</div>
		</div >
	);
}

export default ForbiddenPage;
