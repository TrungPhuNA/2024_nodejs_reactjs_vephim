

const jwt = require( 'jsonwebtoken' );
const promisify = require( 'util' ).promisify;
const sign = promisify( jwt.sign ).bind( jwt );

const { buildResponseException, buildResponse, buildParamPaging } = require( "../common/common" );
const db = require( "../database/database" );

exports.getAll = async ( req, res ) =>
{

	try
	{

		let params = req.query;
		let offset = ( ( params?.page || 1 ) - 1 ) * ( params?.page_size || 10 );
		let limit = params?.page_size || 10;

		let sql = "SELECT DISTINCT genre FROM movie_genre WHERE TRUE ";
		if ( params?.name )
		{
			sql += ` AND LOWER(genre) LIKE '%${ params?.name?.toLowerCase() }%'`
		}
		sql += ` LIMIT ${ limit } OFFSET ${ offset }`;


		db.query( sql, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			db.query( "SELECT COUNT(DISTINCT genre) as total FROM movie_genre", [], async ( err, total ) =>
			{
				if ( err ) return buildResponseException( res, 400, err );
				console.log( total );
				return buildResponse( res, {
					categories: data,
					meta: {
						...buildParamPaging( params ),
						total: total?.length > 0 ? total[ 0 ]?.total : 0
					}
				} )
			} );

		} );


	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};


exports.getAll = async ( req, res ) =>
{

	try
	{

		let params = req.query;
		let offset = ( ( params?.page || 1 ) - 1 ) * ( params?.page_size || 10 );
		let limit = params?.page_size || 10;

		let sql = "SELECT DISTINCT genre FROM movie_genre WHERE TRUE ";
		if ( params?.name )
		{
			sql += ` AND LOWER(genre) LIKE '%${ params?.name?.toLowerCase() }%'`
		}
		sql += ` LIMIT ${ limit } OFFSET ${ offset }`;


		db.query( sql, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			db.query( "SELECT COUNT(DISTINCT genre) as total FROM movie_genre", [], async ( err, total ) =>
			{
				if ( err ) return buildResponseException( res, 400, err );
				console.log( total );
				return buildResponse( res, {
					categories: data,
					meta: {
						...buildParamPaging( params ),
						total: total?.length > 0 ? total[ 0 ]?.total : 0
					}
				} )
			} );

		} );


	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};