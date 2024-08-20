import { toggleShowLoading } from "../redux/actions/common";
import { deleteMethod, getMethod, postMethod, putMethod } from "./apiService";
import { buildFilter, timeDelay } from "./common";

export const ROLE_SERVICE = {
	async getDataList ( params )
	{
		try
		{
			let filter = buildFilter( params );
			// dispatch( toggleShowLoading( true ) );
			const response = await getMethod( '/admin/role', filter );
			await timeDelay( 500 );
			if ( response?.status === 'success' )
			{
				return response?.data;

			}
			return null;


		} catch ( error )
		{
			console.log( error );
			// dispatch( toggleShowLoading( false ) )
			return null;
		}
	},
	async showData ( id, dispatch ) 
	{
		try
		{
			dispatch( toggleShowLoading( true ) );
			const response = await getMethod( `/admin/role/show/${ id }`, {} );
			await timeDelay( 1000 );
			dispatch( toggleShowLoading( false ) );
			if ( response?.status === 'success' )
			{
				return response?.data;
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
		return await postMethod( `/admin/role/store`, data );
	},

	async update ( id, data )
	{
		return await putMethod( `/admin/role/update/${ id }`, data );
	},

	async delete ( id )
	{
		return await deleteMethod( `/admin/role/delete/${ id }` );
	}
}

export const submitFormData = async ( id = null, form, dispatch, history ) =>
{
	try
	{
		dispatch( toggleShowLoading( true ) );
		let formValue = { ...form };
		let response;
		if ( id )
		{
			response = await ROLE_SERVICE.update( id, formValue );
		} else
		{
			response = await ROLE_SERVICE.create( formValue );
		}
		dispatch( toggleShowLoading( false ) );
		return response;
	} catch ( error )
	{
		dispatch( toggleShowLoading( false ) );
		return error;
	}
}

export const getPermissions = async ( params ) =>
{
	try
	{
		let filter = buildFilter( params );
		const response = await getMethod( '/admin/permission', filter );
		if ( response?.status === 'success' )
		{
			return response?.data;
		}
		return null;
	} catch ( error )
	{
		return null;
	}
}

export const getGroup = async (  ) =>
{
	try
	{
		const response = await getMethod( '/admin/permission/config-type', {} );
		if ( response?.status === 'success' )
		{
			return response?.data;
		}
		return null;
	} catch ( error )
	{
		return null;
	}
}