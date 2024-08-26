// @ts-nocheck
import React, { useEffect, useState } from "react";
import
{
	Table
} from "reactstrap";
import Widget from "../../Widget/Widget.js";

import s from "../../../pages/tables/Tables.js";
import { customDate } from "../../../helpers/common/common.js";
import { Pagination, message } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { EMPTY_IMG } from "../../../helpers/constant/image.js";
import { useDispatch } from "react-redux";
import { ROLE_SERVICE } from "../../../services/rolePermissionService.js";
import { toggleShowLoading } from "../../../redux/actions/common.js";
import { DeleteOutlined } from "@ant-design/icons";
import Breadcrumbs from "../../Breadbrumbs/Breadcrumbs.js";
export const Roles = ( props ) =>
{
	const [ listData, setListData ] = useState( [] );
	const [ paging, setPaging ] = useState( {
		page: 1,
		page_size: 10
	} );
	const [ params, setParams ] = useState( {} );
	const dispatch = useDispatch();

	useEffect( () =>
	{
		getListData( { ...paging, ...params } );
	}, [] );

	const getListData = async ( filter ) =>
	{
		dispatch( toggleShowLoading( true ) );
		const response = await ROLE_SERVICE.getDataList( filter );
		if ( response )
		{
			setListData( response.roles );
			setPaging( response.meta );
		} else
		{
			setListData( [] )
		}
		dispatch( toggleShowLoading( false ) );
	}

	const deleteData = async ( id ) =>
	{
		try
		{
			const rs = await ROLE_SERVICE.delete( id );
			if ( rs && rs.status === 'success' )
			{
				message.success( 'Xóa thành công!' );
				await getListData( { page: 1, page_size: 10 } );

			} else
			{
				message.error( rs.message );
			}
		} catch ( error )
		{
			message.error( error.message );
		}
	}

	const routes = [
		{
			name: 'Role',
			route: '/setting/role'
		},
		{
			name: 'Danh sách',
			route: '/setting/role/list'
		}
	];
	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Role" } />
			<Widget>
				<div className="px-5 pt-5">
					<Link to="/setting/role/create" className="btn btn-info">
						<span className="d-flex align-items-center"><i className="eva eva-plus mr-2"></i> Thêm mới</span>
					</Link>
				</div>
				<div className="widget-table-overflow p-5 mt-4">
					<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
						<thead>
							<tr>
								<th>#</th>
								<th className="text-nowrap">Tên</th>
								<th className="text-nowrap">Guard name</th>
								<th className="text-nowrap">Mô tả</th>
								<th className="text-nowrap">Phân quyền</th>
								<th className="text-nowrap">Thời gian tạo</th>
								<th className="text-nowrap">Thao tác</th>
							</tr>
						</thead>
						<tbody>
							{
								listData?.length > 0 && listData.map( ( item, key ) =>
								{
									return (
										< tr key={ key } className="table-product">
											<td className="text-gray-900 text-center">{ ( paging.page - 1 ) * paging.page_size + ( key + 1 ) }</td>

											<td className="text-gray-900">
												{ item.name }
											</td>
											<td className="text-gray-900">{ item.guard_name }</td>
											<td className="text-gray-900">
												<span className="text-break" style={ { maxWidth: '200px' } }>{ item.description }</span>
											</td>
											<td className="text-gray-900 text-break" style={ { minWidth: "200px" } }>
												{ item.permissions && item.permissions.map( ( per, key ) =>
												{
													return (
														<>
															<span className="" key={ key }>{ per.name } </span>
															<span>{ key < item.permissions.length - 1 ? ', ' : '' }</span>
														</>
													)
												} )
												}
											</td>

											<td className="text-gray-900 text-nowrap">
												{ customDate( item.created_at, 'DD/MM/yyyy' ) }
											</td>
											<td>

												<div className="d-flex">
													<Link to={ `/setting/role/edit/${ item.id }` } className="d-flex justify-content-center">
														<i className="eva eva-edit" style={ { fontSize: "16px", border: "1px solid" } }></i>
													</Link>
													{/* <DeleteOutlined onClick={ () => deleteData( item.id ) } 
													className="mx-2" style={ { fontSize: "16px" } } /> */}
												</div>
											</td>

										</tr>
									)
								}
								) }

							{
								( !listData || listData?.length <= 0 ) &&
								<tr>
									<td colSpan={ 9 } style={ { textAlign: "center", backgroundColor: '#ffff' } }>
										<img className="text-center" src={ EMPTY_IMG } style={ { width: "300px", height: "300px" } } />
										<div style={ { color: "#9A9A9A" } }>Dữ liệu trống</div>
									</td>
								</tr>
							}


						</tbody>
					</Table>
					{
						paging.total > 0 &&
						<div className="mx-auto d-flex justify-content-center my-4">
							<Pagination
								onChange={ e =>
									getListData( { ...paging, page: e, ...params } )
								}
								pageSize={ paging.page_size }
								defaultCurrent={ paging.page }
								total={ paging.total }
							/>
						</div>
					}
				</div>

			</Widget >
		</>

	)
}