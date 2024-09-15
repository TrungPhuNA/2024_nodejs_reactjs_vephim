


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
			`SELECT m.*, GROUP_CONCAT(DISTINCT d.director SEPARATOR ', ') AS directors, 
				GROUP_CONCAT(DISTINCT g.genre SEPARATOR ', ') as genres  FROM movie m 
				INNER JOIN movie_genre g ON m.id = g.movie_id 
				INNER JOIN movie_directors d ON m.id = d.movie_id 
				WHERE TRUE 
		 `;
		if ( params?.category_id )
		{
			sql += ` AND LOWER(g.genre) LIKE '%${ params?.category_id?.toLowerCase() }%'`
		}
		if ( params?.name )
		{
			sql += ` AND LOWER(m.name) LIKE '%${ params?.name?.toLowerCase() }%'`
		}

		sql += ` GROUP BY m.id  ORDER BY m.release_date DESC  LIMIT ${ limit } OFFSET ${ offset }`;

		console.log( sql );
		db.query( sql, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			let sqlTotal = `SELECT COUNT(*) as total FROM movie m 
			INNER JOIN movie_genre g ON m.id = g.movie_id 
			INNER JOIN movie_directors d ON m.id = d.movie_id WHERE TRUE `
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
			`SELECT m.*, GROUP_CONCAT(DISTINCT d.director SEPARATOR ', ') AS directors, 
				GROUP_CONCAT(DISTINCT g.genre SEPARATOR ', ') as genres  FROM movie m 
				INNER JOIN movie_genre g ON m.id = g.movie_id 
				INNER JOIN movie_directors d ON m.id = d.movie_id 
				WHERE m.id='${ id }' 
			 `;
		console.log( sql );
		db.query( sql, async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			if ( data?.length > 0 && data[ 0 ] )
			{
				return buildResponse( res, data[ 0 ] )
			}
			return buildResponseException( res, 400, "Movie doesn't exist" );

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

		const response = await this.show( req, res );
		if ( response?.status == 'success' )
		{
			let movie = { ...response?.data, ...req?.body };
			let sqlUpdate =
				`UPDATE movie SET name='${ movie?.name }', 
						 image_path='${ movie?.image_path }',
						 language='${ movie?.language }',
						 synopsis='${ movie?.synopsis }',
						 rating='${ movie?.rating }',
						 top_cast='${ movie?.top_cast }',
						 release_date='${ movie?.release_date }',
						 duration='${ movie?.duration }' WHERE email='${ id }'
					  `;
			db.query( sqlUpdate, [], async ( err, data ) =>
			{
				if ( err ) return buildResponseException( res, 400, err );
				let directors = movie?.directors?.split( ',' );
				let genres = movie?.genres?.split( ',' );
				// if ( directors?.length > 0 )
				// {
				// 	await movieService.createDirector( req, res )
				// }
				// if ( genres?.length > 0 )
				// {
				// 	await movieService.createGenre( req, res )
				// }
				return buildResponse( res, {
					product: movie,
				} );
			} );
		} else
		{
			return buildResponseException( res, 400, response?.message );
		}
	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};

exports.deleteGenre = async ( req, res ) =>
{

	try
	{

		let id = req.params?.id;
		let sqlId =
			`DELETE FROM movie_genre where movie_id='${ id }' 
				 `;
		db.query( sqlId, [], async ( err, data ) =>
		{
			console.log( sqlId );

			if ( err )
			{
				console.log( err );
				return {
					status: 'error',
					message: err?.message
				}
			}
			else return {
				status: 'success'
			}
		} );

	} catch ( e )
	{
		return {
			status: 'error',
			message: e?.message
		}
	}
};

exports.deleteDirector = async ( req, res ) =>
{

	try
	{

		let id = req.params?.id;
		let sqlId =
			`DELETE FROM movie_directors where movie_id='${ id }' 
					 `;
		console.log( sqlId );
		db.query( sqlId, [], async ( err, data ) =>
		{
			console.log( err );
			if ( err )
			{
				console.log( err );
				return {
					status: 'error',
					message: err?.message
				}
			}
			else return {
				status: 'success'
			}

		} );

	} catch ( e )
	{
		return {
			status: 'error',
			message: e?.message
		}
	}
};

exports.createDirector = async ( req, res, id ) =>
{

	try
	{
		let directors = req?.body?.directors?.split(',');
		let sqlId =
			`DELETE FROM movie_directors where movie_id='${ id }' 
					 `;
		console.log( "sqlId-------> ", sqlId );
		db.query( sqlId,  ( err, data ) =>
		{
			console.log(data);
			if ( err )
			{
				console.error( "update movie_directors------> ", err );

			} else
			{
				let sql = `Insert into movie_directors(movie_id,director) values `;
				directors?.forEach( ( element, index ) =>
				{
					if ( element?.trim() != '' )
					{
						if ( index < directors?.length - 1 )
						{
							sql += ` (${ id }, '${ element?.trim() }'), `
						} else
						{
							sql += ` (${ id }, '${ element?.trim() }') `
						}
					}
				} );
				db.query( sql, ( err, data ) =>
				{
					if ( err )
					{
						console.log( err );
						return {
							status: 'error',
							message: err?.message
						}
					}
					else return {
						status: 'success'
					}

				} );
			}

		} );

	} catch ( e )
	{
		return {
			status: 'error',
			message: e?.message
		}

	}
};

exports.createGenre = async ( req, res, id ) =>
{

	try
	{
		let directors = req?.body?.genre?.split(',');
		let sqlId =
			`DELETE FROM movie_genre where movie_id='${ id }' 
					 `;
		console.log( "sqlId-------> ", sqlId );
		db.query( sqlId,  ( err, data ) =>
		{
			console.log(data);
			if ( err )
			{
				console.error( "update genre------> ", err );

			} else
			{
				let sql = `Insert into movie_genre(movie_id,genre) values `;
				directors?.forEach( ( element, index ) =>
				{
					if ( element?.trim() != '' )
					{
						if ( index < directors?.length - 1 )
						{
							sql += ` (${ id }, '${ element?.trim() }'), `
						} else
						{
							sql += ` (${ id }, '${ element?.trim() }') `
						}
					}
				} );
				db.query( sql, ( err, data ) =>
				{
					if ( err )
					{
						console.log( err );
						return {
							status: 'error',
							message: err?.message
						}
					}
					else return {
						status: 'success'
					}

				} );
			}

		} );

	} catch ( e )
	{
		return {
			status: 'error',
			message: e?.message
		}

	}
};



