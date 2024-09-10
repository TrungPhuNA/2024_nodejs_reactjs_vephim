const { buildResponseException, buildResponse, buildParamPaging } = require( "../common/common" );
const db = require( "../database/database" );


exports.deleteShownIn = async ( req, res ) =>
{

	try
	{

		let id = req.params?.id;
		let sqlId =
			`DELETE FROM shown_in where showtime_id='${ id }' 
						 `;
		db.query( sqlId, [], async ( err, data ) =>
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

	} catch ( e )
	{
		return {
			status: 'error',
			message: e?.message
		}
	}
};

exports.createShowIn = async (  id, data_movies ) =>
{

	try
	{
		let sqlId =
			`DELETE FROM shown_in where showtime_id='${ id }' `;
		console.log( "sqlId123-------> ", sqlId );
		db.query( sqlId, ( err, data ) =>
		{
			if ( err )
			{
				console.log("err--------> ", err);
			} else
			{
				let sql = `Insert into shown_in(showtime_id,movie_id,hall_id) values `;
				
				data_movies?.forEach( ( element, index ) =>
				{
					let data = data_movies.filter((e) => e.hall_id == element.hall_id && e.movie_id == element.movie_id);
					let check = data?.length >= 2 ? false: true;
					if ( element &&  check)
					{
						if ( index < data_movies?.length - 1 )
						{
							sql += ` (${ id }, '${ element.movie_id }', '${ element.hall_id }'), `
						} else
						{
							sql += ` (${ id }, '${ element.movie_id }', '${ element.hall_id }') `
						}
					}
				} );
				console.log(sql);
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
