

const jwt = require( 'jsonwebtoken' );
const promisify = require( 'util' ).promisify;
const sign = promisify( jwt.sign ).bind( jwt );

exports.login = async ( req, res ) =>
{
	try
	{
		const email = req.body.email.toLowerCase();
		const user = await User.findOne( { email: email } );
		if ( !user ) return res.status( 200 ).json( { message: 'Tài khoản không tồn tại', status: 400 } );

		const isPasswordValid = bcrypt.compareSync( req.body.password, user.password );
		if ( !isPasswordValid )
		{
			return res.status( 200 ).json( { message: 'Mật khẩu không chính xác', status: 400 } );
		}

		const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
		const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

		const dataForAccessToken = {
			email: user.email,
		};
		const accessToken = await this.generateToken(
			dataForAccessToken,
			accessTokenSecret,
			accessTokenLife,
		);
		if ( !accessToken )
		{
			return res
				.status( 401 )
				.send( { message: 'Đăng nhập không thành công, vui lòng thử lại.' } );
		}
		const response = {
			accessToken: accessToken,
			user: user
		}
		return res.status( 200 ).json( { data: response, status: 200 } );
	} catch ( e )
	{
		res.status( 404 )
		res.send( { message: e?.message } )
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