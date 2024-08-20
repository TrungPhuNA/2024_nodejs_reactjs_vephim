// @ts-nocheck
import React, { useEffect, useState } from "react";
import
{
	Table
} from "reactstrap";
import Widget from "../../Widget/Widget.js";

import s from "../../../pages/tables/Tables.js";
import { customDate } from "../../../helpers/common/common.js";
import { Pagination } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { EMPTY_IMG } from "../../../helpers/constant/image.js";
import { PermissionSearch } from "./PermissionsSearch.js";
import { useDispatch } from "react-redux";
import { getGroup, getPermissions } from "../../../services/rolePermissionService.js";
import { toggleShowLoading } from "../../../redux/actions/common.js";
import Breadcrumbs from "../../Breadbrumbs/Breadcrumbs.js";
export const Permissions = ( props ) =>
{
	const [ listData, setListData ] = useState( [] );
	const [ paging, setPaging ] = useState( {
		page: 1,
		page_size: 20
	} );
	const [ params, setParams ] = useState( {} );
	const [ group, setGroup ] = useState( [] );
	const dispatch = useDispatch();

	useEffect( () =>
	{
		getListData( { ...paging, ...params } );
		// getConfigGroup();
	}, [] );

	const getListData = async ( filter ) =>
	{
		dispatch( toggleShowLoading( true ) );
		const response = await getPermissions( filter );
		if ( response )
		{
			setListData( response.permissions );
			setPaging( response.meta );
		} else
		{
			setListData( [] );
			setPaging( {
				page: 1,
				page_size: 20
			} )
		}
		dispatch( toggleShowLoading( false ) );
	}

	const getConfigGroup = async () =>
	{
		const response = await getGroup();
		if ( response )
		{
			setGroup( response );
		} else
		{
			setGroup( [] )
		}
	}

	const routes = [
		{
			name: 'Permission',
			route: '/setting/permission/list'
		},
		{
			name: 'Danh sách',
			route: ''
		}
	];
	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Permission" } />
			<Widget>
				<div className="p-5">
					<PermissionSearch
						listData={ listData }
						paging={ paging }
						params={ params }
						getListData={ getListData }
						setParams={ setParams }
						setPaging={ setPaging }
						setListData={ setListData }
						group={ group }
					/>
				</div>
			</Widget >
			<Widget>
				{/* <div className="p-3">
					<ProductSearch { ...props } />
				</div> */}
				<div className="widget-table-overflow p-5 mt-4">
					<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
						<thead>
							<tr>
								<th>#</th>
								<th className="text-nowrap">Tên</th>
								<th className="text-nowrap">Guard name</th>
								<th className="text-nowrap">Mô tả</th>
								<th className="text-nowrap">Nhóm</th>
								<th className="text-nowrap">Thời gian tạo</th>
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
											<td className="text-gray-900 text-break" style={ { minWidth: "100px" } }>
												{ item.group }
											</td>

											<td className="text-gray-900 text-nowrap">
												{ customDate( item.created_at, 'DD/MM/yyyy' ) }
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