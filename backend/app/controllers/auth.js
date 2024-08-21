

const jwt = require( 'jsonwebtoken' );
const promisify = require( 'util' ).promisify;
const sign = promisify( jwt.sign ).bind( jwt );

const { buildResponseException, buildResponse } = require( "../common/common" );
const db = require( "../database/database" );

exports.login = async ( req, res ) =>
{

	try
	{
		const email = req.body.email;
		const password = req.body.password;

		const sql = `SELECT * FROM person WHERE email=?`;
		console.log( sql );
		db.query( sql, [ email, password ], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 401, err );
			console.log( "data------> ", data );
			if ( data?.length === 0 )
			{

				return buildResponseException( res, 401, { message: "Lỗi, không tồn tại user!" } );
			}
			let user = data[ 0 ] || null
			const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
			const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

			const dataForAccessToken = {
				email: user?.email,
			};
			const accessToken = await this.generateToken(
				dataForAccessToken,
				accessTokenSecret,
				accessTokenLife,
			);
			return buildResponse( res, {
				user: user,
				token_info: {
					access_token:accessToken
				}
			} )
		} );


	} catch ( e )
	{
		return buildResponseException( res, 401, e );
	}
};

exports.generateToken = async ( payload, secretSignature, tokenLife ) =>
{
	try
	{
		return await sign(
			{
				payload,
			},
			secretSignature,
			{
				algorithm: 'HS256',
				expiresIn: tokenLife,
			},
		);
	} catch ( error )
	{
		console.log( `Error in generate access token:  + ${ error }` );
		return null;
	}
};