import { DEFAULT_USER, DEFAUT_IMG } from "../helpers/constant/image";

export const getItem = ( key ) =>
{
	return localStorage.getItem( key ) || null;
}

export const setItem = ( key, value ) =>
{
	localStorage.setItem( key, value );
}

export const removeItem = ( key ) =>
{
	localStorage.removeItem( key );
}

export const setField = ( form, field, value, setForm ) =>
{
	setForm( {
		...form,
		[ field ]: value
	} );
};

export const buildFilter = ( values ) =>
{

	let params = {};
	if ( values != null )
	{
		delete values.total;
		delete values.total_pages;
		delete values.count;
		let arrCondition = Object.entries( values );

		params = arrCondition.reduce( ( param, item ) =>
		{
			if ( item[ 1 ] != null )
			{
				param = { ...param, ...buildItemParam( item[ 0 ], item[ 1 ], param ) }
			}
			return param;
		}, {} );
	}
	return params;
}

export const buildItemParam = ( key, value, params ) =>
{
	if ( key === 'page' && !value )
	{
		params[ 'page' ] = value;
	} else if ( value != null )
	{
		params[ `${ key }` ] = value;
	}
	return params;
}

export const timeDelay = async ( delay ) =>
{
	return new Promise( res => setTimeout( res, delay ) )
}


export const RESPONSE_API = async ( response, message, id = null, history, route = '' ) =>
{
	if ( response?.status === 'success' )
	{
		message.success( `${ id && 'Cập nhật' || 'Tạo mới' } successfully!`, 1 );
		await timeDelay( 500 );
		window.location.href = `/${ route }`;
	} else
		if ( response?.status === 'fail' && response?.data )
		{
			let error = Object.entries( response?.data ) || [];
			if ( error.length > 0 )
			{
				let error = Object.entries( response?.data ) || [];

				if ( error.length > 0 )
				{
					let messageError = error[ 0 ][ 1 ];
					message.error( messageError[ 0 ], 1 )
				}

			}
		} else
		{
			message.error( response.message || 'Error! Please try again', 1 );
		}
}

export const buildImage = ( img, is_user = false ) =>
{
	if ( img )
	{
		return process.env.REACT_APP_URL_UPLOAD + "/upload/" + img;

	}
	else return is_user ? DEFAULT_USER : DEFAUT_IMG;
}

export const onErrorImage = ( e ) =>
{
	e.currentTarget.src = DEFAUT_IMG;
}
export const onErrorUser = ( e ) =>
{
	e.currentTarget.src = DEFAULT_USER;
}

export const VALIDATE_FORM = {
	required: '${label} không được để trống!',
	types: {
		email: '${label} không đúng định dạng email',
		number: '${label} không đúng định dạng số',
	},
	number: {
		range: '${label} trong khoảng ${min} - ${max}',
	},
};