// @ts-nocheck
import React, { useState } from "react";
import
{
	Table
} from "reactstrap";
import Widget from "../Widget/Widget.js";

import s from "../../pages/tables/Tables.js";
import { customDate, customNumber } from "../../helpers/common/common.js";
import { ProductSearch } from "./ProductSearch.js";
import { Pagination } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { DEFAUT_IMG, EMPTY_IMG } from "../../helpers/constant/image.js";
import { buildImage, onErrorImage } from "../../services/common.js";
import { DeleteOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
export const Products = ( props ) =>
{
	const errorImg = ( e ) =>
	{
		e.currentTarget.src = DEFAUT_IMG;
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
	return (
		<>
			<Widget>
				<div className="p-5">
					<div className="mb-3">
						<Link to="/product/create" className="btn btn-info">
							<span className="d-flex align-items-center"><i className="eva eva-plus mr-2"></i> Thêm mới</span>
						</Link>
					</div>
					<ProductSearch { ...props } />
				</div>
			</Widget >
			<Widget>
				{/* <div className="p-3">
					<ProductSearch { ...props } />
				</div> */}
				<div className="widget-table-overflow p-5 mt-4">
					<div className="table-responsive">
						<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
							<thead>
								<tr>
									<th>#</th>
									<th className="text-nowrap">Hình ảnh</th>
									<th className="text-nowrap">Sản phẩm</th>
									<th className="text-nowrap">Số lượng</th>
									<th className="text-nowrap">Giá</th>
									<th className="text-nowrap">Phân loại</th>
									<th className="text-nowrap">Trạng thái</th>
									<th className="text-nowrap">Thời gian tạo</th>
									<th className="text-nowrap">Thao tác</th>
								</tr>
							</thead>
							<tbody>
								{
									props.products?.length > 0 && props.products.map( ( item, key ) =>
									{
										return (
											< tr key={ key } className="table-product">
												<td className="text-gray-900 text-center">{ ( props.paging.page - 1 ) * props.paging.page_size + ( key + 1 ) }</td>
												<td className="d-flex align-items-center">
													<img width="70" height="70"
														style={ { border: "0.5px solid gray", borderRadius: '5px' } }
														src={ buildImage( item.avatar ) } alt={ item.name } onError={ onErrorImage } />
												</td>
												<td className="text-gray-900">
													<div className="d-flex">
														<div className="font-weight-bold " style={ { minWidth: "80px" } }>Tên Sp: { item.hot == 1 ? <span className="text-danger">Hot</span> : '' }</div>
														<div className="ml-2 text-break" style={ { minWidth: '100px' } }>{ item.name }</div>
													</div>
													<div className="d-flex my-2">
														<div className="font-weight-bold" style={ { minWidth: "80px" } }>slug:</div>
														<div className="ml-2 text-break" style={ { minWidth: '100px' } }>{ item.slug }</div>
													</div>
												</td>
												<td className="text-gray-900">{ customNumber( item.number, '.', '' ) }</td>
												<td className="text-gray-900">{ customNumber( item.price, '.', 'đ' ) }</td>
												<td className="text-gray-900 text-break" style={ { minWidth: "100px" } }>{ item.category?.name || 'N/A' }</td>

												<td className="text-gray-900">{ genStatus( item.status ) }</td>
												<td className="text-gray-900 text-nowrap">
													{ customDate( item.created_at, 'DD/MM/yyyy' ) }
												</td>
												<td>
													<div className="d-flex justify-content-center align-items-center">
														<Link to={ `/product/edit/${ item.id }` } className="d-flex justify-content-center">
															<i className="eva eva-edit" style={ { fontSize: "16px", border: "1px solid" } }></i>
														</Link>
														<DeleteOutlined
															className="ml-2 cursor-pointer"
															onClick={ () =>
															{
																props.deleteById( item.id );
															} }
															style={ { fontSize: "16px", color: "red" } } />
															
														{/* {
															item.status == 1 ?
																<LockOutlined className="ml-3 cursor-pointer"
																	style={ { fontSize: "16px", color: "red" } }
																	onClick={ () =>
																	{
																		props.updateStatus( item );
																	} } />
																:
																<UnlockOutlined className="ml-3 cursor-pointer text-success"
																	style={ { fontSize: "16px" } }
																	onClick={ () =>
																	{
																		props.updateStatus( item );
																	} } />
														} */}
													</div>
												</td>
											</tr>
										)
									}
									) }

								{
									( !props.products || props.products?.length <= 0 ) &&
									<tr>
										<td colSpan={ 9 } style={ { textAlign: "center", backgroundColor: '#ffff' } }>
											<img className="text-center" src={ EMPTY_IMG } style={ { width: "300px", height: "300px" } } />
											<div style={ { color: "#9A9A9A" } }>Dữ liệu trống</div>
										</td>
									</tr>
								}


							</tbody>
						</Table>
					</div>
					{
						props.paging.total > 0 &&
						<div className="mx-auto d-flex justify-content-center my-4">
							<Pagination
								onChange={ e =>
									props.getProductsByFilters( { ...props.paging, page: e, ...props.params } )
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
