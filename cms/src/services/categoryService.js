import { message } from "antd";
import { toggleShowLoading } from "../redux/actions/common";
import { deleteMethod, getMethod, postMethod, putMethod } from "./apiService";
import { buildFilter, timeDelay } from "./common";
import uploadApi from "./upload";

export const getCategories = async ( params ) =>
{
	let filter = buildFilter( params );
	return await getMethod( '/admin/category', filter );
}

export const showCategory = async ( id, params ) =>
{
	return await getMethod( `/admin/category/show/${ id }`, params );
}

export const Category = {
	async create ( data )
	{
		return await postMethod( `/admin/category/store`, data );
	},

	async update ( id, data )
	{
		return await putMethod( `/admin/category/update/${ id }`, data );
	},

	async delete ( id )
	{
		return await deleteMethod( `/admin/category/delete/${ id }` );
	}
}


export const showCategoryDetail = async ( productId, setCategoryData ) =>
{
	try
	{

		const response = await showCategory( productId );
		if ( response?.status === 'success' )
		{
			setCategoryData( response?.data );
		} else
		{
			setCategoryData( null );
		}
	} catch ( error )
	{
		console.log( error );
		setCategoryData( null );
	}
}

export const getCategoriesByFilter = async ( params, dispatch ) =>
{
	try
	{
		dispatch( toggleShowLoading( true ) )
		const response = await getCategories( params );
		
		if ( response?.status === 'success' )
		{
			return response?.data;
		} else
		{
			return null;
		}
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
			response = await Category.update( id, formValue );
		} else
		{
			response = await Category.create( formValue );
		}
		if ( response?.status === 'success' )
		{
			message.success( `${id && 'Cập nhật' || 'Tạo mới'} category successfully!` );
			await timeDelay( 500 );
			history.push( '/category/list' );
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