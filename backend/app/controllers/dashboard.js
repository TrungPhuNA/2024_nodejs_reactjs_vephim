

const jwt = require( 'jsonwebtoken' );
const promisify = require( 'util' ).promisify;
const sign = promisify( jwt.sign ).bind( jwt );

const { buildResponseException, buildResponse, buildParamPaging } = require( "../common/common" );
const db = require( "../database/database" );
const bookingService = require( "../services/booking" );



exports.getAll = async ( req, res ) =>
{

	try
	{
		let params = req.query;
		let offset = ( ( params?.page || 1 ) - 1 ) * ( params?.page_size || 10 );
		let limit = params?.page_size || 10;
		
		const totalTicket = await bookingService.getTotalTicket();
		const totalUser = await bookingService.getTotalCustomer();
		const totalPayment = await bookingService.getTotalPayment();
		const ticketsData = await bookingService.totalTicketPerMovie();
		
		return buildResponse(res, {
			...totalTicket,
			...totalPayment,
			...totalUser,
			tickets: ticketsData,
		});
		

	} catch ( e )
	{
		return buildResponseException( res, 400, e );
	}
};




