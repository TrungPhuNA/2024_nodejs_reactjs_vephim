// @ts-nocheck
// -- React and related libs
import React from "react";
import { Switch, Route, Redirect } from "react-router";

// -- Redux
import { connect } from "react-redux";

// -- Custom Components
import ErrorPage from "./pages/error/ErrorPage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

// -- Redux Actions
import { logoutUser } from "../src/redux/actions/auth";

// -- Third Party Libs

// -- Services

// -- Component Styles
import "./styles/app.scss";
import 'antd/dist/antd.css'
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import Layout from "./components/Layout/Layout";
import Loading from "./components/Layout/Loading";
import { useEffect } from "react";
import { getItem } from "./services/common";


const App = ( props ) =>
{
	
	return (
		<BrowserRouter>
			<Loading />
			<Switch>
				<Route path="/login" exact component={ Login } />
				<Route path="/error" exact component={ ErrorPage } />
				<Route path="/register" exact component={ Register } />
				<Route path="/" exact render={ () => <Redirect to="/dashboard" /> } />
				<Route path="/movie" exact render={ () => <Redirect to="/movie/list" /> } />
				<Route path="/user" exact render={ () => <Redirect to="/user/list" /> } />
				<Route path="/category" exact render={ () => <Redirect to="/category/list" /> } />
				<Route path="/order" exact render={ () => <Redirect to="/order/list" /> } />
				<Route path="/blog" exact render={ () => <Redirect to="/blog/list" /> } />
				<Route path="/menu" exact render={ () => <Redirect to="/menu/list" /> } />
				<Route path="/setting" exact render={ () => <Redirect to="/setting/role/list" /> } />
				<Route path="/setting/role" exact render={ () => <Redirect to="/setting/role/list" /> } />
				<Route path="/setting/permission" exact render={ () => <Redirect to="/setting/permission/list" /> } />
				<Route path="/" render={ ( props ) => <Layout { ...props } /> } />
				<Route path='**' exact={ true } component={ ErrorPage } />
			</Switch>
		</BrowserRouter>
	);
}

const mapStateToProps = state => ( {
	isAuthenticated: state.auth.isAuthenticated,
} );

export default connect( mapStateToProps )( App );
