// @ts-nocheck
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup/LinksGroup.js";
import { changeActiveSidebarItem } from "../../redux/actions/navigation.js";
import SofiaLogo from "../Icons/SofiaLogo.js";
import cn from "classnames";
import { SIDE_BARS } from '../../helpers/constant/sideBar';

const Sidebar = ( props ) =>
{

	const {
		activeItem = '',
		...restProps
	} = props;

	const [ burgerSidebarOpen, setBurgerSidebarOpen ] = useState( false );

	useEffect( () =>
	{
		if ( props.sidebarOpened )
		{
			setBurgerSidebarOpen( true )
		} else
		{
			setTimeout( () =>
			{
				setBurgerSidebarOpen( false )
			}, 0 );
		}
	}, [ props.sidebarOpened ] );

	const genSideBar = () =>
	{
		let path_name = window.location?.pathname;
		return SIDE_BARS.map( ( item, key ) =>
		{
			if ( item.children?.length > 0 )
			{
				let childrenLinks = item.children.reduce( ( newArr, e ) =>
				{
					newArr.push( {
						header: e.title,
						link: e.path,
						activeItem: e.path
					} );
					return newArr;
				}, [] );
				return <LinksGroup
					key={ key }
					onActiveSidebarItemChange={ activeItem => props.dispatch( changeActiveSidebarItem( activeItem ) ) }
					activeItem={ props.activeItem }
					header={ item.title }
					isHeader
					link={ item.path }
					iconName={ <i className={ item.icon } /> }
					index={ `${ item.path }` }
					childrenLinks={ childrenLinks }
				/>
			} else
			{
				return <LinksGroup
					key={item.key}
					onActiveSidebarItemChange={ activeItem => props.dispatch( changeActiveSidebarItem( activeItem ) ) }
					activeItem={ props.activeItem }
					header={ item.title }
					isHeader
					iconName={ <i className={ item.icon } /> }
					link={ item.path }
					index={ `${ item.path }` }
				/>
			}
		} );
	}

	return (
		<nav className={ cn( s.root, { [ s.sidebarOpen ]: burgerSidebarOpen } ) } >
			<header className={ s.logo }>
				 <img src={'/logo.png'} style={{ width:"150px"}} />
			</header>
			<ul className={ s.nav }>
				{
					genSideBar()
				}
			</ul>
		</nav>
	);
}

Sidebar.propTypes = {
	sidebarOpened: PropTypes.bool,
	dispatch: PropTypes.func.isRequired,
	activeItem: PropTypes.string,
	location: PropTypes.shape( {
		pathname: PropTypes.string,
	} ).isRequired,
}

function mapStateToProps ( store )
{
	return {
		sidebarOpened: store.navigation.sidebarOpened,
		activeItem: store.navigation.activeItem,
	};
}

export default withRouter( connect( mapStateToProps )( Sidebar ) );
