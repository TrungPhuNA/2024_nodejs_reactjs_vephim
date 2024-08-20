import axios from "axios";
import { toggleShowLoading } from "../redux/actions/common";
import { deleteMethod, getMethod, postMethod, putMethod } from "./apiService";
import { buildFilter, timeDelay } from "./common";
import { message } from "antd";
import uploadApi from "./upload";

export const USER_SERVICE = {
	async getListData ( params, dispatch )
	{
		try
		{
			let filter = buildFilter( params );
			dispatch( toggleShowLoading( true ) );
			const response = await getMethod( '/admin/user', filter );;
			await timeDelay( 500 );
			dispatch( toggleShowLoading( false ) );
			if ( response?.status === 'success' )
			{
				return response?.data;

			}
			return null;
		} catch ( error )
		{
			dispatch( toggleShowLoading( false ) )
			return null;
		}
	},
	async showData ( id, dispatch ) 
	{
		try
		{
			dispatch( toggleShowLoading( true ) );
			const response = await getMethod( `/admin/user/show/${ id }` );
			await timeDelay( 1000 );
			dispatch( toggleShowLoading( false ) );
			if ( response?.status === 'success' )
			{
				return response?.data?.user;
			}
			return null;
		} catch ( error )
		{
			dispatch( toggleShowLoading( false ) );
			return null;
		}
	},
	async create ( data )
	{
		return await postMethod( `/admin/user/store`, data );
	},

	async update ( id, data )
	{
		return await putMethod( `/admin/user/update/${ id }`, data );
	},

	async delete ( id )
	{
		return await deleteMethod( `/admin/user/delete/${ id }` );
	}
}
export const submitFormUser = async ( id = null, files, e, dispatch, history ) =>
{
	try
	{
		dispatch( toggleShowLoading( true ) );
		let avatar = await uploadApi.uploadFile(files);
		
		await timeDelay( 500 );
		let formValue = { ...e };
		delete formValue.image;
		formValue.avatar = avatar;
		let response;
		if ( id )
		{
			response = await USER_SERVICE.update( id, formValue );
		} else
		{
			response = await USER_SERVICE.create( formValue );
		}
		dispatch( toggleShowLoading( false ) );
		if ( response?.status === 'success' )
		{
			message.success( `${ id && 'Cập nhật' || 'Tạo mới' } user successfully!` );
			history.push( '/user' );
		} else if ( response?.status === 'fail' && response?.data )
		{
			let error = Object.entries( response?.data ) || [];

			if ( error.length > 0 )
			{
				let messageError = error[0][1];
				message.error( messageError[0] )
			}
		} else
		{
			message.error( response.message || 'Error! Please try again' );
		}
	} catch ( error )
	{
		console.log(error);
		message.error( error.message );
		dispatch( toggleShowLoading( false ) );
	}
}