

const jwt = require( 'jsonwebtoken' );
const promisify = require( 'util' ).promisify;
const sign = promisify( jwt.sign ).bind( jwt );

const { buildResponseException, buildResponse, buildParamPaging } = require( "../common/common" );
const db = require( "../database/database" );
const movieService = require( "../services/movie" );



exports.getAll = async ( req, res ) =>
{

	try
	{

		let params = req.query;
		let offset = ( ( params?.page || 1 ) - 1 ) * ( params?.page_size || 10 );
		let limit = params?.page_size || 10;

		let sql =
			`	SELECT h.*, t.name as theatre_name, t.location as theatre_location 
				FROM hall h  
				INNER JOIN theatre t ON t.id = h.theatre_id 
				WHERE TRUE 
		 `;

		if ( req?.query?.name )
		{
			sql += ` AND LOWER(h.name) LIKE '%${ req?.query?.name?.trim()?.toLowerCase() }%'`
		}
		if ( req?.query?.theatre_name )
		{
			sql += ` AND LOWER(t.name) LIKE '%${ req?.query?.theatre_name?.trim()?.toLowerCase() }%'`
		}

		sql += ` ORDER BY h.id DESC  `;
		let query = sql + ` LIMIT ${ limit } OFFSET ${ offset }`
		console.log( query );
		db.query( query, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			let sqlTotal = `SELECT COUNT(*) as total FROM (${ sql }) as data `
			db.query( sqlTotal, [], async ( err, total ) =>
			{
				if ( err ) return buildResponseException( res, 400, err );
				console.log( total );
				return buildResponse( res, {
					rooms: data,
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
			`SELECT * FROM hall where id=${ id } `;
		console.log( sql );
		db.query( sql, [], async ( err, data ) =>
		{
			if ( err )
			{
				console.log( err );
				return buildResponseException( res, 400, err );
			}

			return buildResponse( res, data[ 0 ] )

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


		let sqlId =
			`SELECT m.*  FROM hall m  WHERE m.id='${ id }' 
					 `;
		console.log( sqlId );
		db.query( sqlId, async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			if ( data[ 0 ] )
			{
				let movie = { ...data[ 0 ], ...req?.body };
				let sqlUpdate =
					`UPDATE hall SET name='${ movie?.name }', 
						theatre_id='${ movie?.theatre_id }',
						total_seats='${ movie?.total_seats }'
						 WHERE id='${ id }'
					 `;
				db.query( sqlUpdate, async ( err, data ) =>
				{
					if ( err )
					{
						console.log( err );
						return buildResponseException( res, 400, err );
					}
					return buildResponse( res, {
						room: movie,
					} )
				} );
			} else
			{
				return buildResponseException( res, 400, { message: "Movie doesn't exist" } );
			}


		} );
	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};

exports.create = async ( req, res ) =>
{

	try
	{

		const name = req.body.name;
		const total_seats = req.body.total_seats;
		const theatre_id = req.body.theatre_id;


		const sql1 = `Insert into hall (name,total_seats,theatre_id)
  values
  (?,?,?)`;
		const sql2 = "SELECT LAST_INSERT_ID() as last_id";
		db.query(
			sql1,
			[
				name,
				total_seats,
				theatre_id
			],
			( err1, data1 ) =>
			{
				if ( err1 ) return res.json( err1 );

				db.query( sql2, async ( err2, data2 ) =>
				{
					if ( err2 ) return buildResponseException( res, 400, err2 );

					return buildResponse( res, data2[ 0 ] );
				} );
			}
		);


	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};

exports.getAllTheatre = async ( req, res ) =>
{

	try
	{

		let params = req.query;
		let offset = ( ( params?.page || 1 ) - 1 ) * ( params?.page_size || 10 );
		let limit = params?.page_size || 10;

		let sql =
			`	SELECT t.*, f.title, f.description, f.image_path 
					FROM theatre t  
					INNER JOIN features f ON t.id = f.theatre_id 
					WHERE TRUE 
			 `;

		if ( req?.query?.name )
		{
			sql += ` AND LOWER(t.name) LIKE '%${ req?.query?.name?.trim()?.toLowerCase() }%'`
		}
		if ( req?.query?.location )
		{
			sql += ` AND LOWER(t.location) LIKE '%${ req?.query?.location?.trim()?.toLowerCase() }%'`
		}

		sql += `  ORDER BY t.id DESC  `;
		let query = sql + ` LIMIT ${ limit } OFFSET ${ offset }`
		console.log( query );
		db.query( query, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			let sqlTotal = `SELECT COUNT(*) as total FROM (${ sql }) as data `
			db.query( sqlTotal, [], async ( err, total ) =>
			{
				if ( err ) return buildResponseException( res, 400, err );
				console.log( total );
				return buildResponse( res, {
					theatres: data,
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

exports.deleteById = async ( req, res ) =>
{

	try
	{
		let id = req.params?.id;
		let sqlId =
			`DELETE FROM hall where id='${ id }' 
					 `;
		db.query( sqlId, [], async ( err, data ) =>
		{
			console.log( sqlId );

			if ( err )
			{
				if ( err ) return buildResponseException( res, 400, err );

			}
			else
			{

				movieService.deleteGenre( req, res );
				movieService.deleteGenre( req, res );
				return buildResponse( res, {} );
			}
		} );


	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};

