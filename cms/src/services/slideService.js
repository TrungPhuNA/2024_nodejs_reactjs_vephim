import { message } from "antd";
import { toggleShowLoading } from "../redux/actions/common";
import { deleteMethod, getMethod, postMethod, putMethod } from "./apiService";
import { buildFilter, timeDelay } from "./common";
import uploadApi, { uploadFile } from "./upload";

export const getSlides = async ( params ) =>
{
	
}

export const show = async ( id, params ) =>
{
	return await getMethod( `/admin/slide/show/${ id }`, params );
}

export const SlideService = {
	async getList(params) {
		let filter = buildFilter( params );
		return await getMethod( '/admin/slide', filter );
	},
	async show(id) {
		return await getMethod( `/admin/slide/show/${ id }` );
	},
	async create ( data )
	{
		return await postMethod( `/admin/slide/store`, data );
	},

	async update ( id, data )
	{
		return await putMethod( `/admin/slide/update/${ id }`, data );
	},

	async delete ( id )
	{
		return await deleteMethod( `/admin/slide/delete/${ id }` );
	}
}


export const showData = async ( productId, setData ) =>
{
	try
	{

		const response = await SlideService.show( productId );
		if ( response?.status === 'success' )
		{
			setData( response?.data );
		} else
		{
			setData( null );
		}
	} catch ( error )
	{
		console.log( error );
		setData( null );
	}
}

export const getDataByFilter = async ( params, dispatch ) =>
{
	try
	{
		dispatch( toggleShowLoading( true ) )
		const response = await SlideService.getList( params );
		
		if ( response?.status === 'success' )
		{
			return response?.data;
		} else
		{
			return null;
		}
		dispatch( toggleShowLoading( false ) )
	} catch ( error )
	{
		dispatch( toggleShowLoading( false ) )
		return null;
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
			response = await SlideService.update( id, formValue );
		} else
		{
			response = await SlideService.create( formValue );
		}
		if ( response?.status === 'success' )
		{
			message.success( `${id && 'Cập nhật' || 'Tạo mới'} slide successfully!` );
			await timeDelay( 500 );
			history.push( '/slide/list' );
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