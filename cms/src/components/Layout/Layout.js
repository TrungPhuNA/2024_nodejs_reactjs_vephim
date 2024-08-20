// -- React and related libs
import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";


// -- Custom Components
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Breadcrumbs from "../Breadbrumbs/Breadcrumbs";

// -- Component Styles
// @ts-ignore
import s from "./Layout.module.scss";
import { ROUTERS } from "../../router";
import IconsPage from "../../pages/uielements/icons/IconsPage";
import { useEffect } from "react";
import { getItem } from "../../services/common";
import { useState } from "react";

const Layout = ( props ) =>
{
	const [ accessToken, setAccessToken ] = useState( localStorage.getItem( 'access_token_cms' ) || null );

	useEffect(() => {
		if ( !accessToken )
		{
			localStorage.clear();
			console.log(1);
			window.location.href = '/login';
		}
	}, [])
	// useEffect(() => {
	// 	if(!getItem('access_token_cms')) {
	// 		localStorage.clear();
	// 		window.location.href = '/login';
	// 		console.log(1);
	// 	}
	// }, [getItem('access_token_cms')])
	return (
		<div className={ s.root }>
			<div className={ s.wrap }>
				<Header />
				<Sidebar />
				<main className={ s.content }>
					{/* <Breadcrumbs url={ props.location.pathname } /> */}
					<Switch>
						{

							ROUTERS.map( ( { path, exact, title, redirectFrom, component: Component } ) =>
							{
								return (
									<Route
										key={ title }
										path={ path }
										exact={ exact }
										render={ prop => <Component { ...prop } /> }
									/>

								)
							} )
						}
						<Route path="/product" exact render={ () => <Redirect to="/product/list" /> } />
						<Route path="/template/ui-elements/icons" component={IconsPage}/>
					</Switch>
				</main>
			</div>
		</div>

	);
}

export default Layout;
