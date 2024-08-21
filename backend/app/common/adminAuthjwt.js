const { verify } = require( "jsonwebtoken" );
const { buildResponseException } = require( "./common" );
const db = require( "../database/database" );

exports.roleGuards = async ( req, res, next ) =>
{
	// Lấy access token từ header
	// return next();
	try
	{

		const accessTokenFromHeader = req.headers.authorization?.replace('Bearer ', '');

		if ( !accessTokenFromHeader )
		{
			throw { code: 'LG0401', message: 'Không tìm thấy user!' };
		}


		const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

		const verified = await this.verifyToken(
			accessTokenFromHeader,
			accessTokenSecret,
		);

		console.log( 'verify admin-------> ', verified );

		if ( !verified )
		{
			throw { message: 'Vui lòng đăng nhập lại!', code: 'LG0401' };
		}
		const sql = `SELECT * FROM person WHERE LOWER(person_type)='admin' AND email=?`;
		db.query( sql, [ verified?.payload?.email ], async ( err, data ) =>
		{
			if ( err ) return buildResponseException( res, 401, err );
			if ( data?.length == 0 )
			{
				return buildResponseException( res, 401, { message: "Lỗi, không tồn tại user!" } );
			} else {

				return next();
			}
		})
		
	} catch ( error )
	{
		console.log( 'admin middleware error-------> ', error );
		return buildResponseException( res, "LG0401", error );
	}


};

exports.verifyToken = async ( token, secretKey ) =>
{
	try
	{
		return await verify( token, secretKey );
	} catch ( error )
	{
		console.log( `Error in verify access token:  + ${ error }` );
		console.log( `Error in verify access token:  + ${ token }` );
		console.log( `Error in verify access token:  + ${ secretKey }` );
		return null;
	}
};
