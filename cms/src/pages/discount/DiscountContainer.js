// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { INIT_PAGING } from "../../helpers/constant/value";
import { Discount } from "../../components/Discount/Discount";
import { message } from "antd";
import { DiscountService } from "../../services/discountService";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs";

export const DiscountContainer = () =>
{

	const [ dataList, setDataList ] = useState( [] );
	const [ paging, setPaging ] = useState( {
		page: 1,
		page_size: 10
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
			const response = await DiscountService.getList( filter );
			console.log(response);
			if ( response?.status === 'success' )
			{
				setDataList( response?.data?.schedules || [] );
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
			const response = await DiscountService.delete( id );
			if ( response?.status === 'success' )
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
			name: 'Lịch chiếu',
			route: '/schedule'
		},
		{
			name: 'Danh sách',
			route: '/schedule/list'
		}
	];

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Lịch chiếu" } />
			<Discount
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
	)

};
