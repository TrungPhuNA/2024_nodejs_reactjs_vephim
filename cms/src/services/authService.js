import { toggleShowLoading } from "../redux/actions/common";
import { deleteMethod, getMethod, postMethod, putMethod } from "./apiService";
import { buildFilter, timeDelay } from "./common";
import { message } from "antd";
import uploadApi from "./upload";

export const AUTH_SERVICE = {
	async login ( data, dispatch )
	{
		try
		{
			const response = await postMethod( '/api/v1/admin/login', data );
			await timeDelay( 500 );
			return response;
		} catch ( error )
		{
			return error;
		}
	},
	// async getProfile ( id, dispatch ) 
	async getProfile()
	{
		return await getMethod('/auth/profile');
	},

	async update ( data )
	{
		return await putMethod( `/auth/profile`, data );
	},
	async changePassword ( data )
	{
		return await putMethod( `/auth/change-password`, data );
	}
}
export const submitProfile = async (files, e, dispatch, history ) =>
{
	try
	{
		dispatch( toggleShowLoading( true ) );
		let fileImg = [];
		let avatar = await uploadApi.uploadFile(files);
		await timeDelay( 500 );
		let formValue = { ...e };
		delete formValue.image;
		if(avatar) {
			formValue.avatar = avatar;
		}
		let response;
		response = await AUTH_SERVICE.update(formValue );
		dispatch( toggleShowLoading( false ) );
		if ( response?.status === 'success' )
		{
			message.success( `Update user successfully!`, 1);
			history.push( '/profile' );
		} else if ( response?.status === 'fail' && response?.data )
		{
			let error = Object.entries( response?.data ) || [];

			if ( error.length > 0 )
			{
				let messageError = error[0][1];
				message.error( messageError[0] , 1)
			}
		} else
		{
			message.error( response.message || 'Error! Please try again', 1 );
		}
	} catch ( error )
	{
		message.error( error.message,1 );
		dispatch( toggleShowLoading( false ) );
	}
}
