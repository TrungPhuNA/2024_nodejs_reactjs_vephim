// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { INIT_PAGING } from "../../helpers/constant/value";
import { Blog } from "../../components/Blog/Blog";
import { BlogService } from "../../services/blogService";
import { message } from "antd";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs";

export const BlogContainer = () =>
{

	const [ dataList, setDataList ] = useState( [] );
	const [ paging, setPaging ] = useState( {
		page: 1,
		page_size: 20
	} );
	const [ params, setParams ] = useState( {} );
	const dispatch = useDispatch();

	useEffect( () =>
	{
		getDatasByFilter( paging );
	}, [] );

	const getDatasByFilter = async ( filter ) =>
	{
		try
		{

			dispatch( toggleShowLoading( true ) )
			const response = await BlogService.getList( params );

			if ( response?.status === "success" )
			{
				setDataList( response?.data?.blogs || [] );
				setPaging( response?.data?.meta || INIT_PAGING );
			}
			dispatch( toggleShowLoading( false ) );
		} catch ( error )
		{
			dispatch( toggleShowLoading( false ) );
		}
	}

	const deleteById = async ( id ) =>
	{
		try
		{
			const response = await BlogService.delete( id );
			if ( response?.status === "success" )
			{
				message.success( 'Xóa thành công' );
				await getDatasByFilter( { ...paging, ...params } );
			} else
			{
				message.error( response?.message );
			}

		} catch ( error )
		{
			message.error( error?.message );
		}
	}

	const routes = [
		{
			name: 'Blog',
			route: '/blog'
		},
		{
			name: 'Danh sách',
			route: '/blog/list'
		}
	];
	return <>
		<Breadcrumbs routes={ routes } title={ "Blog" } />
		<Blog
			dataList={ dataList }
			paging={ paging }
			params={ params }
			deleteById={ deleteById }
			getDatasByFilter={ getDatasByFilter }
			setParams={ setParams }
			setPaging={ setPaging }
			setDataList={ setDataList }
		/>
	</>
};
