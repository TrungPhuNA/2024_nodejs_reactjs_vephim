// @ts-nocheck
import React from "react";
import
{
	Table
} from "reactstrap";
import Widget from "../Widget/Widget.js";

import s from "../../pages/tables/Tables.js";
import { customDate, customNumber } from "../../helpers/common/common.js";
import { Pagination } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { DEFAUT_IMG, EMPTY_IMG } from "../../helpers/constant/image.js";
import { buildImage, onErrorImage } from "../../services/common.js";
import { DeleteOutlined } from '@ant-design/icons'
import { DiscountSearch } from "./DiscountSearch.js";
export const Discount = ( props ) =>
{

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

	
	return (
		<>
			<Widget>
				<div className="p-5">
					<div className="mb-3">
						<Link to="/discount/create" className="btn btn-info">
							<span className="d-flex align-items-center"><i className="eva eva-plus mr-2"></i> Create</span>
						</Link>
					</div>
					<DiscountSearch { ...props } />
				</div>
			</Widget >
			<Widget>
				<div className="widget-table-overflow p-5 mt-4">
					<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
						<thead>
							<tr>
								<th>#</th>
								<th className="text-nowrap">Tiêu đề</th>
								<th className="text-nowrap">Code</th>
								<th className="text-nowrap">Giá</th>
								<th className="text-nowrap">Trạng thái</th>
								<th className="text-nowrap text-center">Thao tác</th>
							</tr>
						</thead>
						<tbody>
							{
								props.dataList?.length > 0 && props.dataList.map( ( item, key ) =>
								{
									return (
										< tr key={ key } className="table-product">
											<td className="text-gray-900 text-center">{ ( props.paging.page - 1 ) * props.paging.page_size + ( key + 1 ) }</td>
											
											<td className="text-gray-900">
												<span className="text-break" style={ { minWidth: '100px' } }>{ item.name }</span>
											</td>
											<td className="text-gray-900">
												<span className="text-break" style={ { minWidth: '100px' } }>{ item.code }</span>
											</td>
											<td className="text-gray-900">
												<span className="text-break" style={ { minWidth: '100px' } }>{ customNumber(item.price, ',', 'đ') }</span>
											</td>
											<td className="text-gray-900">{ genStatus( item.status ) }</td>

											<td>
												<div className="d-flex justify-content-center align-items-center">
													<Link to={ `/discount/edit/${ item.id }` } className="d-flex justify-content-center">
														<i className="eva eva-edit" style={ { fontSize: "16px", border: "1px solid" } }></i>
													</Link>
													{/* <DeleteOutlined
														className="ml-2 cursor-pointer"
														onClick={ () =>
														{
															props.deleteById( item.id );
														} }
														style={ { fontSize: "16px", color: "red" } } /> */}
												</div>

											</td>
										</tr>
									)
								}
								) }

							{
								( !props.dataList || props.dataList?.length <= 0 ) &&
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
						props.paging.total > 0 &&
						<div className="mx-auto d-flex justify-content-center my-4">
							<Pagination
								onChange={ e =>
									props.getList( { ...props.paging, page: e, ...props.params } )
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