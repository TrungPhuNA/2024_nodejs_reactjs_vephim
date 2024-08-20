import axios from "axios";

const uploadApi = {

	async uploadFile ( files )
	{
		try
		{
			let avatar = null;
			if ( files.length > 0 && files[ 0 ] )
			{
				if ( !files[ 0 ].default )
				{
					const formData = new FormData();
					formData.append( 'file', files[ 0 ].originFileObj );
					const res = await axios.post( `${ process.env.REACT_APP_URL_UPLOAD }/upload/image`,
						formData, { headers: { 'Accept': 'multipart/form-data' } } );
					let data = res.data;
					console.log(data);
					if ( data?.status === 'success' )
					{
						avatar = data?.data?.filename;
					}
				} else
				{
					avatar = files[0].path
				}
			}
			return avatar;

		} catch ( error )
		{
			return null;
		}

	},

	async uploadMultiFile ( files )
	{
		try
		{
			let fileImg = [];
			if ( files?.length > 0 )
			{
				for ( let [ index, item ] of files.entries() )
				{
					if ( index > 0 )
					{
						if ( !item.default )
						{
							const formData = new FormData();
							formData.append( 'file', item.originFileObj );
							const res = await axios.post( `${ process.env.REACT_APP_URL_UPLOAD }/upload/image`,
								formData, { headers: { 'Accept': 'multipart/form-data' } } );
							let data = res.data;
							console.log(data);
							if ( data?.status === 'success' )
							{
								fileImg.push({
									name: data?.data?.filename,
									path: data?.data?.filename
								});
							}
						} else {
							fileImg.push( {
								name: item.name || item.url,
								path: item.path
							} );
						}
					}

				}
			}
			return fileImg;

		} catch ( error )
		{
			return [];
		}

	},



}

export default uploadApi;