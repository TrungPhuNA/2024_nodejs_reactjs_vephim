const db = require( "../database/database" );

exports.getTotalTicket = () =>
{
	return new Promise( ( resolve, reject ) =>
	{
		const sql = `SELECT COUNT(*) AS total_tickets FROM ticket`;

		db.query( sql, ( err, data ) =>
		{
			console.log( data );
			if ( err )
			{
				console.log( "total ticket----> ", err );
				return resolve( {
					total_tickets: 0
				} );
			}

			return resolve( data[ 0 ] );
		} );
	} );

}


exports.getTotalPayment = async () =>
{
	return new Promise( ( resolve, reject ) =>
	{
		const sql = `SELECT sum(amount) AS total_amount FROM payment`;

		db.query( sql, ( err, data ) =>
		{
			console.log( data );
			if ( err )
			{
				console.log( "total getTotalPayment----> ", err );
				return resolve( {
					total_amount: 0
				} );
			}

			return resolve( data[ 0 ] );
		} );
	} );

}


exports.getTotalCustomer = async () =>
{
	return new Promise( ( resolve, reject ) =>
	{
		const sql = `SELECT COUNT(*) AS total_customers FROM person WHERE person_type='Customer'`;

		db.query( sql, ( err, data ) =>
		{
			console.log( data );
			if ( err )
			{
				console.log( "total getTotalCustomer----> ", err );
				return resolve( {
					total_customers: 0
				} );
			}

			return resolve( data[ 0 ] );
		} );
	} )

}


exports.totalTicketPerMovie = async () =>
{
	return new Promise( ( resolve, reject ) =>
	{
		const sql = `SELECT M.name,T.movie_id,COUNT(*) AS tickets_per_movie 
	FROM ticket T JOIN movie M on T.movie_id = M.id \
	GROUP BY movie_id`;

		db.query( sql, ( err, data ) =>
		{
			console.log( data );
			if ( err )
			{
				console.log( "total ticket----> ", err );
				return resolve([]);
			}

			return resolve(data);
		} );
	} )
}