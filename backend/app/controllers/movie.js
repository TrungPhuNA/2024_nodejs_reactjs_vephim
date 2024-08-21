

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

		let sql =
			`SELECT m.*, GROUP_CONCAT(g.genre SEPARATOR ', ') as genres  FROM movie m 
				INNER JOIN movie_genre g ON m.id = g.movie_id WHERE TRUE 
		 `;
		if ( params?.category_id )
		{
			sql += ` AND LOWER(g.genre) LIKE '%${ params?.category_id?.toLowerCase() }%'`
		}
		if ( params?.name )
		{
			sql += ` AND LOWER(m.name) LIKE '%${ params?.name?.toLowerCase() }%'`
		}

		sql += ` GROUP BY m.id ORDER BY m.release_date DESC  LIMIT ${ limit } OFFSET ${ offset }`;

		console.log( sql );
		db.query( sql, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			let sqlTotal = `SELECT COUNT(*) as total FROM movie m 
			INNER JOIN movie_genre g ON m.id = g.movie_id WHERE TRUE `
			if ( params?.category_id )
			{
				sqlTotal += ` AND LOWER(g.genre) LIKE '%${ params?.category_id?.toLowerCase() }%'`
			}
			if ( params?.name )
			{
				sqlTotal += ` AND LOWER(m.name) LIKE '%${ params?.name?.toLowerCase() }%'`
			}
			db.query( sqlTotal, [], async ( err, total ) =>
			{
				if ( err ) return buildResponseException( res, 400, err );
				console.log( total );
				return buildResponse( res, {
					products: data,
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

exports.show = async ( req, res ) =>
{

	try
	{

		let id = req.params?.id;


		let sql =
			`SELECT m.*, GROUP_CONCAT(g.genre SEPARATOR ', ') as genres  FROM movie m 
					INNER JOIN movie_genre g ON m.id = g.movie_id WHERE m.id='${ id }' 
			 `;
		console.log( sql );
		db.query( sql, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );

			return buildResponse( res, {
				product: data[ 0 ],
			} )

		} );


	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};

exports.update = async ( req, res ) =>
	{
	
		try
		{
	
			let id = req.params?.id;
	
	
			let sql =
				`SELECT m.*, GROUP_CONCAT(g.genre SEPARATOR ', ') as genres  FROM movie m 
						INNER JOIN movie_genre g ON m.id = g.movie_id WHERE m.id='${ id }' 
				 `;
			console.log( sql );
			db.query( sql, [], async ( err, data ) =>
			{
				if ( err ) return buildResponseException( res, 400, err );
	
				return buildResponse( res, {
					product: data[ 0 ],
				} )
	
			} );
	
	
		} catch ( e )
		{
			return buildResponseException( res, 400, e );
		}
	};