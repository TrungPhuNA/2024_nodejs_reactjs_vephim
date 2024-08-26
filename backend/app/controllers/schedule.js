

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
			`SELECT id, movie_start_time, show_type, DATE_FORMAT(showtime_date, '%Y-%m-%d') as show_date, price_per_seat FROM showtimes WHERE TRUE 
		 `;


		if ( params?.showtime_date )
		{
			sql += ` AND showtime_date='${ params?.showtime_date }'`
		}
		if ( params?.show_type )
		{
			sql += ` AND LOWER(show_type) LIKE '%${ params?.show_type?.toLowerCase() }%'`
		}

		sql += ` ORDER BY id  DESC  `;
		let query = sql + ` LIMIT ${ limit } OFFSET ${ offset }`
		console.log( query );
		db.query( query, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			let sqlTotal = `SELECT COUNT(*) as total FROM (${ sql }) as data `
			if ( params?.showtime_date )
			{
				sql += ` AND showtime_date = '${ params?.showtime_date }'`
			}
			if ( params?.show_type )
			{
				sql += ` AND LOWER(show_type) LIKE '%${ params?.show_type?.toLowerCase() }%'`
			}
			db.query( sqlTotal, [], async ( err, total ) =>
			{
				if ( err ) return buildResponseException( res, 400, err );
				console.log( total );
				return buildResponse( res, {
					schedules: data,
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
			`SELECT  * FROM showtimes WHERE id='${ id }' 
			 `;
		console.log( sql );
		db.query( sql, async ( err, data ) =>
		{
			if ( err ) {
				console.log(err);
				return buildResponseException( res, 400, err );
			}

			return buildResponse( res, data[ 0 ] )

		} );


	} catch ( e )
	{
		console.log(e);
		return buildResponseException( res, 400, e );
	}
};

exports.update = async ( req, res ) =>
{

	try
	{

		let id = req.params?.id;


		let sqlId =
			`SELECT m.*  FROM movie m  WHERE m.id='${ id }' 
					 `;
		console.log( sqlId );
		db.query( sqlId, async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			if ( data[ 0 ] )
			{
				let movie = { ...data[ 0 ], ...req?.body };
				let sqlUpdate =
					`UPDATE showtimes SET movie_start_time='${ movie?.movie_start_time }', 
						show_type='${ movie?.show_type }',
						showtime_date='${ movie?.showtime_date }',
						price_per_seat='${ movie?.price_per_seat }'
						 WHERE id='${ id }'
					 `;
				console.log( sqlUpdate );
				db.query( sqlUpdate, async ( err, data ) =>
				{
					if ( err )
					{
						console.log( err );
						return buildResponseException( res, 400, err );
					}

					
					return buildResponse( res, {
						movie: movie,
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

		const movie_start_time = req.body.movie_start_time;
		const show_type = req.body.show_type;
		const showtime_date = req.body.showtime_date;
		const price_per_seat = req.body.price_per_seat;

		const sql1 = `Insert into showtimes (movie_start_time,show_type,showtime_date,price_per_seat)
  
  values
  (?,?,?,?)`;
		const sql2 = "SELECT LAST_INSERT_ID() as last_id";
		db.query(
			sql1,
			[
				movie_start_time,
				show_type,
				showtime_date,
				price_per_seat
				
			],
			( err1, data1 ) =>
			{
				if ( err1 ) return res.json( err1 );

				db.query( sql2, async ( err2, data2 ) =>
				{
					if ( err2 ) return buildResponseException( res, 400, err2 );
					return buildResponse( res, {
						product: data2[ 0 ],
					} );
					
				} );
			}
		);


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
				`DELETE FROM showtimes where id='${ id }' 
					 `;
			db.query( sqlId, [], async ( err, data ) =>
			{
				console.log( sqlId );
	
				if ( err )
				{
					if ( err ) return buildResponseException( res, 400, err );
	
				}
				else {
	
					return buildResponse( res, {} );
				}
			} );
	
	
		} catch ( e )
		{
			return buildResponseException( res, 400, e );
		}
	};