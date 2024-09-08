

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


exports.deleteById = async ( req, res ) =>
{

	try
	{
		let movie_ids = req.body?.movie_ids;
		if ( movie_ids != null && movie_ids?.trim() != '' )
		{
			let ids = movie_ids?.split(',')?.map((item) => {
				return `'${item}'`;
			})
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
		} else {
			return buildResponseException( res, 400, {message: "Không tìm thấy danh mục"} );
		}



	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};