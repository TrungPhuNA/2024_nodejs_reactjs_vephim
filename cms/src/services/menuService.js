import { message } from "antd";
import { toggleShowLoading } from "../redux/actions/common";
import { deleteMethod, getMethod, postMethod, putMethod } from "./apiService";
import { buildFilter, timeDelay } from "./common";
import uploadApi from "./upload";

export const MenuService = {
	async create ( data )
	{
		return await postMethod( `/admin/menu/store`, data );
	},

	async getList ( params )
	{
		let filter = buildFilter( params );
		return await getMethod( '/admin/menu', filter );
	},
	async show ( id, params )
	{
		return await getMethod( '/admin/menu/show/' + id, {} );
	},

	async update ( id, data )
	{
		return await putMethod( `/admin/menu/update/${ id }`, data );
	},

	async delete ( id )
	{
		return await deleteMethod( `/admin/menu/${ id }` );
	}
}
export const submitMenuForms = async ( id = null, files, e, dispatch, history ) =>
{
	try
	{
		dispatch( toggleShowLoading( true ) );
		let formValue = { ...e };
		let response;
		if ( id )
		{
			response = await MenuService.update( id, formValue );
		} else
		{
			response = await MenuService.create( formValue );
		}
		if ( response?.status === "success" )
		{
			message.success( `${id && 'Cập nhật' || 'Tạo mới'} thành công!` );
			await timeDelay( 500 );
			history.push( '/menu/list' );
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
			message.error( response.message || 'Có lỗi xảy ra vui lòng thử lại' );
		}
		dispatch( toggleShowLoading( false ) );
	} catch ( error )
	{
		message.error( error.message );
		dispatch( toggleShowLoading( false ) );
	}
}