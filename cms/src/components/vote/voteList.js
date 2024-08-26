import React, { useEffect, useState } from 'react';
import Widget from '../Widget/Widget';
import { Pagination, message } from 'antd';
import
{
	Button,
	Table
} from "reactstrap";
import { StarIcons } from './star';
import { useDispatch } from 'react-redux';
import { toggleShowLoading } from '../../redux/actions/common';
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { timeDelay } from '../../services/common';
import s from "../../pages/tables/Tables.js";
import { VOTE_SERVICE_CMS } from '../../services/voteService'
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs.js';
import { DeleteOutlined } from '@ant-design/icons';

export const PageVoting = () =>
{

	const [ paging, setPaging ] = useState( {
		page: 1,
		page_size: 10,
		total: 0
	} );

	const dispatch = useDispatch();
	const [ dataList, setDataList ] = useState( [] );

	useEffect( () =>
	{
		getDataList( { page: paging.page, page_size: paging.page_size } ).then( r => { } );
	}, [] );

	const getDataList = async ( filters ) =>
	{
		try
		{
			dispatch( toggleShowLoading( true ) );
			const response = await VOTE_SERVICE_CMS.getLists( filters );
			await timeDelay( 500 );
			if ( response?.status === 'success' || response?.status === 'success' )
			{
				setDataList( response?.data?.votes );
				setPaging( response?.data?.meta )
			}
			dispatch( toggleShowLoading( false ) );
		} catch ( error )
		{
			console.log( error );
			dispatch( toggleShowLoading( false ) );
		}

	}

	const handleDelete = async ( id ) =>
	{
		console.log( id );
		dispatch( toggleShowLoading( true ) );
		const response = await VOTE_SERVICE_CMS.delete( id );
		await timeDelay( 500 )
		if ( response?.status === 'success' || response?.status === 'success' )
		{
			message.success( 'Xóa đánh giá thành công!' );
			await getDataList( { page: 1, page_size: 10 } ).then( r => { } );
		} else
		{
			message.error( response?.message || 'Xóa đánh giá thất bại!' );
		}
		dispatch( toggleShowLoading( false ) );
	}
	const routes = [
		{
			name: 'Đánh giá',
			route: '/reviews'
		},
		{
			name: 'Danh sách',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Đánh giá" } />
			<Widget>
				<div className="widget-table-overflow p-5 mt-4">
					<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
						<thead>
							<tr>
								<th>#</th>
								<th>Khách hàng</th>
								<th>Sản phẩm</th>
								<th className='text-nowrap'>Điểm đánh giá</th>
								<th>Nội dung</th>
								<th className='text-center'>Thao tác</th>
							</tr>
						</thead>
						<tbody>
							{ dataList.length > 0 ? dataList.map( ( item, key ) =>
							{
								return (
									<tr key={ key }>
										<td className='align-middle'>{ key + 1 }</td>
										<td className='text-nowrap align-middle'>
											{ item?.user?.name || 'N/A' }
											<Link className={ '' }
												to={ `/vote/update/${ item.id }` } >

											</Link>
										</td>
										<td className='align-middle' style={ { maxWidth: '100px' } }>{ item?.product?.name || 'N/A' }</td>
										<td className='align-middle text-nowrap'>
											<StarIcons vote_number={ item?.number } />
										</td>
										<td className='text-break' style={ { maxWidth: '200px' } }>{ item.content }</td>
										<td className='align-middle d-flex justify-content-center'>
											<DeleteOutlined 
											className='text-danger text-center' 
											onClick={ () => handleDelete( item.id ) }>

											</DeleteOutlined>
										</td>
									</tr>
								)
							} )
								:
								<tr>
									<td className='text-center' colSpan={ 8 }>Không có dữ liệu</td>
								</tr>
							}

						</tbody>
					</Table>
				</div>
				{
					paging?.total > 0 &&
					<div className="mx-auto d-flex justify-content-center my-4">
						<Pagination
							onChange={ e =>
								getDataList( { ...paging, page: e } )
							}
							pageSize={ paging.page_size }
							defaultCurrent={ paging.page }
							total={ paging.total }
						/>
					</div>
				}
			</Widget>
		</>
	);
}
