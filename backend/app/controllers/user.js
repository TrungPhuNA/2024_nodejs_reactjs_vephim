

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

		let sql = "SELECT * FROM person WHERE TRUE ";
		if ( params?.first_name )
		{
			sql += ` AND LOWER(first_name) LIKE '%${ params?.first_name?.toLowerCase() }%'`
		}
		if ( params?.last_name )
		{
			sql += ` AND LOWER(last_name) LIKE '%${ params?.last_name?.toLowerCase() }%'`
		}
		if ( params?.person_type )
		{
			sql += ` AND LOWER(person_type) LIKE '%${ params?.person_type?.toLowerCase() }%'`
		}
		if ( params?.email )
		{
			sql += ` AND LOWER(email) LIKE '%${ params?.email?.toLowerCase() }%'`
		}
		if ( params?.phone_number )
		{
			sql += ` AND LOWER(phone_number) LIKE '%${ params?.phone_number?.toLowerCase() }%'`
		}
		sql += ` LIMIT ${ limit } OFFSET ${ offset }`;


		db.query( sql, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			db.query( "SELECT COUNT(DISTINCT(email)) as total FROM person", [], async ( err, total ) =>
			{
				if ( err ) return buildResponseException( res, 400, err );
				console.log( total );
				return buildResponse( res, {
					users: data,
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
			`SELECT * FROM person WHERE email='${ id }' 
			 `;
		console.log( sql );
		db.query( sql, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );

			return buildResponse( res, {
				user: data[ 0 ],
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
		let body = req.body;

		let sql =
			`SELECT * FROM person WHERE email='${ id }' 
			 `;
		db.query( sql, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			if ( data[ 0 ] )
			{
				let user = { ...data[ 0 ], body };
				let sqlUser =
					`UPDATE person SET first_name='${ user?.first_name }', 
					last_name='${ user?.last_name }',
					email='${ user?.email }',
					phone_number='${ user?.phone_number }',
					person_type='${ user?.person_type }',
					account_balance='${ user?.account_balance }' WHERE email='${ id }'
			 	`;
				db.query( sqlUser, [], async ( err, data ) =>
				{
					if ( err ) return buildResponseException( res, 400, err );
					return buildResponse( res, {
						user: user,
					} )
				} );
			} else
			{
				return buildResponseException( res, 400, { message: "Tài khoản không tồn tại" } );

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

		let body = req.body;

		let sql =
			`SELECT * FROM person WHERE email='${ body?.email || '' }' 
				 `;
		db.query( sql, [], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 400, err );
			if ( data[ 0 ] )
			{
				return buildResponseException( res, 400, { message: 'Email đã được sử dụng' } );


			} else
			{
				const email = req.body.email;
				const firstName = req.body.first_name;
				const lastName = req.body.last_name;
				const password = req.body.password;
				const phoneNumber = req.body.phone_number;

				const sqlUser = `INSERT INTO person 
				(email, first_name, last_name, password, phone_number, person_type) 
				VALUES (?, ?, ?, ?, ?, ?)`;
				
				db.query( sqlUser, [email, firstName, lastName, password, phoneNumber, body?.person_type || 'Customer'], async ( err, data ) =>
				{
					if ( err ) return buildResponseException( res, 400, err );
					
					return buildResponse( res, {
						user: body,
					} )
				} );

			}
		} );


	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};