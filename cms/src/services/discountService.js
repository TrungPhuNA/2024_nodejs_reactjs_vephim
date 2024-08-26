import { message } from "antd";
import { toggleShowLoading } from "../redux/actions/common";
import { deleteMethod, getMethod, postMethod, putMethod } from "./apiService";
import { buildFilter, timeDelay } from "./common";
import uploadApi from "./upload";

export const DiscountService = {
	async create ( data )
	{
		return await postMethod( `/api/v1/admin/schedule/store`, data );
	},

	async getList ( params )
	{
		let filter = buildFilter( params );
		return await getMethod( '/api/v1/admin/schedule', filter );
	},
	async show ( id, params )
	{
		let filter = buildFilter( params );
		return await getMethod( '/api/v1/admin/schedule/show/' + id, filter );
	},

	async update ( id, data )
	{
		return await putMethod( `/api/v1/admin/schedule/update/${ id }`, data );
	},

	async delete ( id )
	{
		return await deleteMethod( `/api/v1/admin/schedule/delete/${ id }` );
	}
}
export const submitDiscountForm = async ( id = null, e, dispatch, history ) =>
{
	try
	{
		dispatch( toggleShowLoading( true ) );
		let formValue = { ...e };
		let response;
		if ( id )
		{
			response = await DiscountService.update( id, formValue );
		} else
		{
			response = await DiscountService.create( formValue );
		}
		if ( response?.status === 'success' )
		{
			message.success( `${id && 'Update' || 'Create'} successfully!` );
			await timeDelay( 500 );
			history.push( '/schedule' );
		} else if ( response?.status === 'fail' && response?.data )
		{
			let error = Object.entries( response?.data ) || [];
			if ( error.length > 0 )
			{
				let messageError = error.reduce( ( newMessage, item ) =>
				{
					newMessage[ `${ item[ 0 ] }` ] = item[ 1 ][ 0 ];
					return newMessage
				}, {} );
				message.error( messageError )
			}
		} else
		{
			message.error( response.message || 'Error! Please try again' );
		}
		dispatch( toggleShowLoading( false ) );
	} catch ( error )
	{
		message.error( error.message );
		dispatch( toggleShowLoading( false ) );
	}
}