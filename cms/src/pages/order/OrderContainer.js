// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { Orders } from "../../components/Order/Order.js";
import { getOrdersByFilter } from "../../services/orderService.js";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs.js";

export const OrderContainer = () =>
{

	const [ orders, setOrders ] = useState( [] );
	const [ paging, setPaging ] = useState( {
		page: 1,
		page_size: 20
	} );
	const [ params, setParams ] = useState( {} )
	const dispatch = useDispatch();

	useEffect( () =>
	{
		getOrdersByFilters( paging, setOrders, setPaging );
	}, [] );

	const getOrdersByFilters = async ( filter ) =>
	{
		await getOrdersByFilter( filter, setOrders, setPaging, dispatch );
	}
	const routes = [
		{
			name: 'Đơn hàng',
			route: '/order'
		},
		{
			name: 'Danh sách',
			route: '/'
		},
	]
	return ( <>
		<Breadcrumbs routes={ routes } title={ "Đơn hàng" } />
		<Orders
			orders={ orders }
			paging={ paging }
			setPaging={ setPaging }
			setOrders={ setOrders }
			params={ params }
			setParams={ setParams }
			getOrdersByFilters={ getOrdersByFilters }
		/>
	</> )
};
