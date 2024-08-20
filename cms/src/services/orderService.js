// @ts-nocheck
import axios from "axios";
import { toggleShowLoading } from "../redux/actions/common";
import { deleteMethod, getMethod, postMethod, putMethod } from "./apiService";
import { buildFilter, timeDelay } from "./common";
import { message } from "antd";

export const getOrders = async (params) => {
	let filters = buildFilter(params);
	return await getMethod('/admin/order', filters);
}

export const showOrderInfo = async (id, params) => {
	return await getMethod(`/admin/order/show/${id}`, params);
}

export const getOrdersByFilter = async (params, setOrders, setPaging, dispatch) => {
	try {
		dispatch(toggleShowLoading(true))
		const response = await getOrders(params);
		await timeDelay(2000);
		if (response?.status === 'success') {
			setOrders(response?.data.orders);
			setPaging(response?.data.meta);

		} else {
			setOrders([]);
		}
		dispatch(toggleShowLoading(false))
	} catch (error) {
		console.log(error);
		setOrders([]);
		dispatch(toggleShowLoading(false))

	}
}

export const getOrderById = async (id, setOrderInfo, dispatch) => {
	try {
		if(dispatch) {
			dispatch(toggleShowLoading(true));
		}
		await timeDelay(1000)
		const response = await showOrderInfo(id);
		if(response?.status === 'success') {
			setOrderInfo(response?.data);
		} else {
			setOrderInfo(null);
		}
		if(dispatch) {
			dispatch(toggleShowLoading(false));
		}
	} catch (error) {
		setOrderInfo(null);
		if(dispatch) {
			dispatch(toggleShowLoading(false));
		}
	}
}

export const updateOrder = async (id, data) => {
	await timeDelay(1000)
	return await putMethod('/admin/order/update/'+id, data);
}