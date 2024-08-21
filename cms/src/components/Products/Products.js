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
						<Link to="/movie/create" className="btn btn-info">
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
									<th className="text-center">#</th>
									<th className="text-nowrap">Hình ảnh</th>
									<th className="text-nowrap">Phim</th>
									<th className="text-nowrap">Ngôn ngữ</th>
									<th className="text-nowrap">Tóm tắt</th>
									<th className="text-nowrap">Rating</th>
									<th className="text-nowrap">Danh mục</th>
									<th className="text-nowrap">Thời lượng</th>
									<th className="text-nowrap">Top Cast</th>
									<th className="text-nowrap">Ngày chiếu</th>
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
														src={ buildImage( item.image_path ) }
														alt={ item.name } onError={ onErrorImage } />
												</td>
												<td className="text-gray-900">
													<div className="font-weight-bold " style={ { minWidth: "80px" } }>
														{ item?.name }
													</div>
												</td>
												<td className="text-gray-900">{ item?.language }</td>
												<td className="text-gray-900 text-break" >
													<p style={ { minWidth: "200px" } }>
														{ item?.synopsis }
													</p>
												</td>
												<td className="text-gray-900">{ item?.rating }</td>

												<td className="text-gray-900 text-break">
													<p style={ { minWidth: "200px" } }>
														{ item?.genres }
													</p>
												</td>

												<td className="text-gray-900">{ item?.duration }</td>
												<td className="text-gray-900 text-break">
													<p style={ { minWidth: "200px" } }>
														{ item?.top_cast }
													</p>
												</td>
												<td className="text-gray-900 text-nowrap">
													{ customDate( item.release_date, 'DD/MM/yyyy HH:mm:ss' ) }
												</td>
												<td>
													<div className="d-flex justify-content-center align-items-center">
														<Link to={ `/movie/edit/${ item.id }` } className="d-flex justify-content-center">
															<i className="eva eva-edit" style={ { fontSize: "16px", border: "1px solid" } }></i>
														</Link>
														<DeleteOutlined
															className="ml-2 cursor-pointer"
															onClick={ () =>
															{
																props.deleteById( item.id );
															} }
															style={ { fontSize: "16px", color: "red" } } />

														
													</div>
												</td>
											</tr>
										)
									}
									) }

								{
									( !props.products || props.products?.length <= 0 ) &&
									<tr>
										<td colSpan={ 11 } style={ { textAlign: "center", backgroundColor: '#ffff' } }>
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
