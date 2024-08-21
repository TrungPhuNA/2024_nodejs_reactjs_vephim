exports.buildResponseException = ( res, status, error ) =>
{
	return res.status( 200 ).json( { status: "error", message: error?.message, data: error, code: status } )
}

exports.buildResponse = ( res, response ) =>
{
	return res.status( 200 ).json( { status: "success", data: response, message: "successfully!" } )
}

exports.buildParamPaging = ( queryParam ) =>
	{
		return {
			page: queryParam?.page || 1,
			page_size: queryParam?.page_size || 10,
		}
	}