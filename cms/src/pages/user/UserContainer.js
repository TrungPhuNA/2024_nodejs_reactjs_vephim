// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UserCpn } from "../../components/User/User";
import { USER_SERVICE } from "../../services/userService";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs";
import { message } from "antd";

export const UserContainer = () =>
{

	const [ listData, setListData ] = useState( [] );
	const [ paging, setPaging ] = useState( {
		page: 1,
		page_size: 20
	} );
	const [ params, setParams ] = useState( {} );
	const dispatch = useDispatch();

	useEffect( () =>
	{
		getListData( paging );
	}, [] );

	const getListData = async ( filter ) =>
	{
		const response = await USER_SERVICE.getListData( filter, dispatch );
		if ( response )
		{
			setListData( response.users );
			setPaging( response.meta );
		} else
		{
			setListData( [] );
		}
	}

	const routes = [
		{
			name: 'Người dùng',
			route: '/user/list'
		},
		{
			name: 'Danh sách',
			route: ''
		}
	];

	const deleteById = async ( id ) =>
	{
		try
		{
			const response = await USER_SERVICE.delete( id );
			if ( response?.status === 'success' )
			{
				message.success( 'Delete user successfully' );
				await getListData( { ...paging, ...params } );
			} else
			{
				message.error( response?.message );
			}

		} catch ( error )
		{
			message.error( error?.message );
		}
	}

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Người dùng" } />
			<UserCpn
				listData={ listData }
				paging={ paging }
				deleteById={ deleteById }
				params={ params }
				getListData={ getListData }
				setParams={ setParams }
				setPaging={ setPaging }
				setListData={ setListData }
			/>
		</> )
};
