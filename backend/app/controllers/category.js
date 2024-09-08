

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

		let sql = `SELECT 
		NULLIF(GROUP_CONCAT( movie_id SEPARATOR ','), '') AS movie_ids, genre  
		FROM movie_genre  WHERE TRUE 
		`;
		if ( params?.name )
		{
			sql += ` AND LOWER(genre) LIKE '%${ params?.name?.toLowerCase() }%'`
		}
		sql += ` GROUP BY genre LIMIT ${ limit } OFFSET ${ offset }`;


		console.log( sql );
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



exports.update = async ( req, res ) =>
{

	try
	{

		let name = req.body?.genre?.trim();
		let old_name = req.body?.old_name?.trim();
		let movie_ids = req.body?.movie_ids;
		if ( movie_ids != null && movie_ids?.trim() != '' )
		{
			let sql = `Delete from movie_genre  where genre='${ old_name }'`;
			db.query( sql, [], async ( err, data ) =>
			{

				if ( err )
				{
					console.log(err);
					if ( err ) return buildResponseException( res, 400, err );

				}
				else
				{
					let ids = movie_ids?.split( ',' );
					let sqlUpdate = `Insert into movie_genre(movie_id,genre) values `;
					ids?.forEach( ( element, index ) =>
					{
						if ( element?.trim() != '' )
						{
							if ( index < ids?.length - 1 )
							{
								sqlUpdate += `('${ element?.trim() }', '${name}'), `
							} else
							{
								sqlUpdate += ` ('${ element?.trim() }', '${name}') `
							}
						}
					} );
					console.log(sqlUpdate);
					db.query( sqlUpdate, [], async ( err1, data ) =>
					{

						if ( err1 )
						{
							console.log("err------> ", err1);
							if ( err1 ) return buildResponseException( res, 400, err1 );

						}
						else
						{
							return buildResponse( res, {} );
						}
					} );
				}
			} );


		} else
		{
			return buildResponseException( res, 400, { message: "Không tìm thấy danh mục" } );
		}

	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};


exports.deleteById = async ( req, res ) =>
{

	try
	{
		let movie_ids = req.body?.movie_ids;
		if ( movie_ids != null && movie_ids?.trim() != '' )
		{
			let ids = movie_ids?.split( ',' )?.map( ( item ) =>
			{
				return `'${ item }'`;
			} )
			let sqlId =
				`DELETE FROM movie_genre  where movie_id IN (${ ids }) 
					 `;
			db.query( sqlId, [], async ( err, data ) =>
			{

				if ( err )
				{
					if ( err ) return buildResponseException( res, 400, err );

				}
				else
				{
					return buildResponse( res, {} );
				}
			} );
		} else
		{
			return buildResponseException( res, 400, { message: "Không tìm thấy danh mục" } );
		}



	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};