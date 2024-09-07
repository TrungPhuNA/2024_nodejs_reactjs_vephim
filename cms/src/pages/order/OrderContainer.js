// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { Orders } from "../../components/Order/Order.js";
import { deleteOrderById, getOrdersByFilter } from "../../services/orderService.js";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs.js";

export const OrderContainer = () =>
{

	const [ orders, setOrders ] = useState( [] );
	const [ paging, setPaging ] = useState( {
		page: 1,
		page_size: 10
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

	const deleteById = async (id) => {
		try {
			const response = await deleteOrderById(id);
			if(response?.status === 'success') {
				message.success('Xóa thành công');
				await getOrdersByFilters({...paging, ...params});
			} else {
				message.error(response?.message);
			}

		} catch (error) {
			message.error(error?.message);
		}
	}
	const routes = [
		{
			name: 'Đặt vé',
			route: '/order'
		},
		{
			name: 'Danh sách',
			route: '/'
		},
	]
	return ( <>
		<Breadcrumbs routes={ routes } title={ "Đặt vé" } />
		<Orders
			orders={ orders }
			paging={ paging }
			setPaging={ setPaging }
			setOrders={ setOrders }
			params={ params }
			setParams={ setParams }
			deleteById={ deleteById }
			getOrdersByFilters={ getOrdersByFilters }
		/>
	</> )
};
