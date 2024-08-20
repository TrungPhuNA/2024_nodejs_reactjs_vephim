import { message } from "antd";
import { toggleShowLoading } from "../redux/actions/common";
import { deleteMethod, getMethod, postMethod, putMethod } from "./apiService";
import { buildFilter, timeDelay } from "./common";
import uploadApi from "./upload";

export const BlogService = {
	async create ( data )
	{
		return await postMethod( `/admin/blog/store`, data );
	},

	async getList ( params )
	{
		let filter = buildFilter( params );
		return await getMethod( '/admin/blog', filter );
	},
	async show ( id, params )
	{
		return await getMethod( '/admin/blog/show/' + id, {} );
	},

	async update ( id, data )
	{
		return await putMethod( `/admin/blog/update/${ id }`, data );
	},

	async delete ( id )
	{
		return await deleteMethod( `/admin/blog/${ id }` );
	}
}
export const submitForms = async ( id = null, files, e, dispatch, history ) =>
{
	try
	{
		dispatch( toggleShowLoading( true ) );
		let avatar = await uploadApi.uploadFile(files)
		await timeDelay( 500 );
		let formValue = { ...e };
		delete formValue.image;
		formValue.avatar = avatar;
		formValue.hot = formValue.hot ? 1 : -1;
		let response;
		if ( id )
		{
			response = await BlogService.update( id, formValue );
		} else
		{
			response = await BlogService.create( formValue );
		}
		if ( response?.status === "success" )
		{
			message.success( `${id && 'Cập nhật' || 'Tạo mới'} thành công!` );
			await timeDelay( 500 );
			history.push( '/blog/list' );
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