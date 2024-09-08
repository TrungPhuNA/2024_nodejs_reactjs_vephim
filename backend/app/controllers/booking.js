

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
			`SELECT ti.id, ti.price, ti.purchase_date, 
				NULLIF(m.name, '') as movie_name, 
				NULLIF(pe.first_name, '') as first_name,
				NULLIF(p.customer_email, '') as email,
				NULLIF(pe.last_name, '') as last_name,
				NULLIF(pe.phone_number, '') as phone_number,
				NULLIF(m.image_path, '') as image_path, 
				NULLIF(s.name, '') as seat_name, 
				NULLIF(h.name, '') as hall_name, 
				NULLIF(th.name, '') as theatre_name,
				NULLIF(sh.show_type, '') as show_type, 
				NULLIF(sh.movie_start_time, '') as movie_start_time, 
				sh.showtime_date, 
				th.location,
				ti.payment_id 
				FROM ticket ti 
				INNER JOIN movie m ON m.id = ti.movie_id 
				INNER JOIN seat s ON s.id = ti.seat_id 
				INNER JOIN payment p ON p.id = ti.payment_id 
				INNER JOIN person pe ON pe.email = p.customer_email 
				INNER JOIN hall h ON h.id = ti.hall_id 
				INNER JOIN theatre th ON th.id = h.theatre_id  
				INNER JOIN showtimes sh ON sh.id = ti.showtimes_id 
				WHERE TRUE 
		 `;
		if ( params?.movie_name )
		{
			sql += ` AND LOWER(g.genre) LIKE '%${ params?.category_id?.toLowerCase() }%'`
		}
		if ( params?.name )
		{
			sql += ` AND LOWER(m.name) LIKE '%${ params?.name?.toLowerCase() }%'`
		}

		sql += ` ORDER BY ti.id  DESC  `;
		let query = sql + ` LIMIT ${ limit } OFFSET ${ offset }`
		console.log( query );
		db.query( query, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			let sqlTotal = `SELECT COUNT(*) as total FROM (${ sql }) as data `
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
					orders: data,
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
					`UPDATE movie SET name='${ movie?.name }', 
						image_path='${ movie?.image_path }',
						language='${ movie?.language }',
						synopsis='${ movie?.synopsis }',
						rating='${ movie?.rating }',
						top_cast='${ movie?.top_cast }',
						release_date='${ movie?.release_date }',
						duration='${ movie?.duration }' WHERE id='${ id }'
					 `;
				console.log( sqlUpdate );
				db.query( sqlUpdate, async ( err, data ) =>
				{
					if ( err )
					{
						console.log( err );
						return buildResponseException( res, 400, err );
					}

					let directors = movie?.directors?.split( ',' );
					let genres = movie?.genres?.split( ',' );
					if ( directors?.length > 0 )
					{
						await movieService.createDirector( req, res, id )
					}
					console.log( genres );
					if ( genres?.length > 0 )
					{
						await movieService.createGenre( req, res, id )
					}
					console.log( movie );
					return buildResponse( res, {
						movie: movie,
					} )
				} );
			} else
			{
				return buildResponseException( res, 400, { message: "Movie doesn't exist" } );
			}


		} );
		// const sql = `Insert into movie_directors(movie_id,director)
		// values
		// (?,?)`;

		//   db.query(sql0, [email, password, "Admin"], (err, data) => {
		// 	  if (err) return res.json(err);

		// 	  if (data.length === 0) {
		// 		  return res.status(404).json({message: "Sorry, You are not Admin!"});
		// 	  }

		// 	  db.query(sql, [movieId, director], (err, data) => {
		// 		  if (err) return res.json(err);

		// 		  return res.json(data);
		// 	  });
		//   });



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
		const image_path = req.body.image_path;
		const language = req.body.language;
		const synopsis = req.body.synopsis;
		const rating = req.body.rating;
		const duration = req.body.duration;
		const top_cast = req.body.top_cast;
		const release_date = req.body.release_date;

		const sql1 = `Insert into movie (name,image_path,language,synopsis,rating,duration,top_cast,release_date)
  values
  (?,?,?,?,?,?,?,?)`;
		const sql2 = "SELECT LAST_INSERT_ID() as last_id";
		db.query(
			sql1,
			[
				name,
				image_path,
				language,
				synopsis,
				rating,
				duration,
				top_cast,
				release_date,
			],
			( err1, data1 ) =>
			{
				if ( err1 ) return res.json( err1 );

				db.query( sql2, async ( err2, data2 ) =>
				{
					if ( err2 ) return buildResponseException( res, 400, err2 );
					if ( data2[ 0 ]?.last_id )
					{
						let directors = req?.body?.directors?.split( ',' );
						let genres = req?.body?.genres?.split( ',' );
						if ( directors?.length > 0 )
						{
							await movieService.createDirector( req, res, data2[ 0 ]?.last_id )
						}
						console.log( genres );
						if ( genres?.length > 0 )
						{
							await movieService.createGenre( req, res, data2[ 0 ]?.last_id )
						}

					}
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
			`DELETE FROM ticket where id='${ id }' 
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