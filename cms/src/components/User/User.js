// @ts-nocheck
import React, { useState } from "react";
import
{
	Table
} from "reactstrap";
import Widget from "../Widget/Widget.js";

import s from "../../pages/tables/Tables.js";
import { customDate, customNumber } from "../../helpers/common/common.js";
import { Pagination } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { DEFAULT_USER, EMPTY_IMG } from "../../helpers/constant/image.js";
import { UserSearch } from "./UserSearch.js";
import { buildImage, onErrorImage, onErrorUser } from "../../services/common.js";
import { DeleteOutlined } from "@ant-design/icons";
export const UserCpn = ( props ) =>
{
	const errorImg = ( e ) =>
	{
		e.currentTarget.src = DEFAULT_USER;
	}

	const genStatus = ( status ) =>
	{
		switch ( status )
		{
			case 1: {
				return <div className="text-success">Active</div>
			}
			default: return <div className="text-warning">Inactive</div>
		}
	}

	const renderRole = ( roles ) =>
	{
		if ( roles && roles.length > 0 )
		{
			return roles.map( item =>
			{
				return (
					<span className="badge badge-info mr-2">{ item.guard_name }</span>
				)
			} )
		}
	}
	return (
		<>
			<Widget>
				<div className="p-5">
					<div className="mb-3">
						<Link to="/user/create" className="btn btn-info">
							<span className="d-flex align-items-center"><i className="eva eva-plus mr-2"></i> Thêm mới</span>
						</Link>
					</div>
					<UserSearch { ...props } />
				</div>
			</Widget >
			<Widget>
				<div className="widget-table-overflow p-5 mt-4">
					<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
						<thead>
							<tr>
								<th className="text-center">#</th>
								<th className="text-nowrap">Email</th>
								<th className="text-nowrap">First Name</th>
								<th className="text-nowrap">Last Name</th>
								<th className="text-nowrap">Số điện thoại</th>
								<th className="text-nowrap">Loại tài khoản</th>
								<th className="text-nowrap">Số dư ví</th>
								<th className="text-nowrap">Thao tác</th>
							</tr>
						</thead>
						<tbody>
							{
								props.listData?.length > 0 && props.listData.map( ( item, key ) =>
								{
									return (
										< tr key={ key } className="table-product">
											<td className="text-gray-900 text-center">{ ( props.paging.page - 1 ) * props.paging.page_size + ( key + 1 ) }</td>
											<td className="d-flex align-items-center">
												{item.email}
											</td>
											<td className="text-gray-900">
												{item.first_name}
											</td>
											<td className="text-gray-900">
												{ item.last_name }
											</td>
											<td className="text-gray-900">
												{ item.phone_number }
											</td>
											<td className="text-gray-900 text-nowrap ">
												{ item.person_type?.toLowerCase() == 'admin' ? "ADMIN" : "KHÁCH HÀNG" }
											</td>
											<td className="text-gray-900 text-nowrap">{ customNumber(item?.account_balance, '.', 'đ') }</td>
											
											<td>
												<div className="d-flex justify-content-center align-items-center">
													<Link to={ `/user/edit/${ item.email }` } className="d-flex justify-content-center">
														<i className="eva eva-edit" style={ { fontSize: "16px", border: "1px solid" } }></i>
													</Link>
													
												</div>
											</td>
										</tr>
									)
								}
								) }

							{
								( !props.listData || props.listData?.length <= 0 ) &&
								<tr>
									<td colSpan={ 8 } style={ { textAlign: "center", backgroundColor: '#ffff' } }>
										<img className="text-center" src={ EMPTY_IMG } style={ { width: "300px", height: "300px" } } />
										<div style={ { color: "#9A9A9A" } }>Dữ liệu trống</div>
									</td>
								</tr>
							}


						</tbody>
					</Table>
					{
						props.paging.total > 0 &&
						<div className="mx-auto d-flex justify-content-center my-4">
							<Pagination
								onChange={ e =>
									props.getListData( { ...props.paging, page: e, ...props.params } )
								}
								pageSize={ props.paging.page_size }
								defaultCurrent={ props.paging.page }
								total={ props.paging.total }
							/>
						</div>
					}
				</div>

			</Widget >
		</>

	)
}