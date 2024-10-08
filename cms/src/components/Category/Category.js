// @ts-nocheck
import React, { useState } from "react";
import
{
	Table
} from "reactstrap";
import Widget from "../Widget/Widget.js";

import s from "../../pages/tables/Tables.js";
import { customDate } from "../../helpers/common/common.js";
import { CategorySearch } from "./CategorySearch.js";
import { Pagination } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { DEFAUT_IMG, EMPTY_IMG } from "../../helpers/constant/image.js";
import { buildImage, onErrorImage } from "../../services/common.js";
import { DeleteOutlined } from "@ant-design/icons";
import { CategoryForm } from "./CategoryForm.js";

export const Categories = ( props ) =>
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

	const [ isShowModal, setIsShowModal ] = useState( false );
	const [ detail, setDetail ] = useState( null );

	return (
		<>
			<CategoryForm isShowModal={ isShowModal }
				detail={detail}
				setIsShowModal={setIsShowModal}
				setDetail={setDetail}
				param={props.param}
				paging={props.paging}
				getDatasByFilter={ props.getDatasByFilter }
			/>
			<Widget>
				<div className="p-5">
					{/* <div className="mb-3">
						<Link to="/category/create" className="btn btn-info">
							<span className="d-flex align-items-center"><i className="eva eva-plus mr-2"></i> Thêm mới</span>
						</Link>
					</div> */}
					<CategorySearch { ...props } />
				</div>
			</Widget >
			<Widget>
				<div className="widget-table-overflow p-5 mt-4">
					<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
						<thead>
							<tr>
								<th className="text-center">#</th>
								<th className="text-nowrap">Tên phân loại</th>
								{/* <th className="text-nowrap">Slug</th>
								<th className="text-nowrap">Trạng thái</th>
								<th className="text-nowrap">Thời gian tạo</th> */}
								<th className="text-nowrap text-center">Thao tác</th>
							</tr>
						</thead>
						<tbody>
							{
								props.datas?.length > 0 && props.datas.map( ( item, key ) =>
								{
									return (
										< tr key={ key } className="table-product">
											<td className="text-gray-900 text-center">{ ( props.paging.page - 1 ) * props.paging.page_size + ( key + 1 ) }</td>

											<td className="text-gray-900">
												<span className="text-break" style={ { minWidth: '100px' } }>
													{ item.genre }
												</span>
											</td>

											<td className="text-center">
												<div className="d-flex justify-content-center align-items-center">
													<div className="d-flex justify-content-center">
														<i className="eva eva-edit text-primary" 
														onClick={() => {
															setDetail(item);
															setIsShowModal(true)

														}}
														style={ { fontSize: "16px", border: "1px solid" } }></i>
													</div>
													<DeleteOutlined
														className="ml-2 cursor-pointer"
														onClick={ () =>
														{
															props.deleteById( { movie_ids: item?.movie_ids } );
														} }
														style={ { fontSize: "16px", color: "red" } } />


												</div>
											</td>
										</tr>
									)
								}
								) }

							{
								( !props.datas || props.datas?.length <= 0 ) &&
								<tr>
									<td colSpan={ 2 } style={ { textAlign: "center", backgroundColor: '#ffff' } }>
										<img className="text-center" src={ EMPTY_IMG } style={ { width: "300px", height: "300px" } } />
										<div style={ { color: "#9A9A9A" } }>Dữ liệu trống</div>
									</td>
								</tr>
							}

						</tbody>
					</Table>
					{
						props.datas && props.paging.total > 0 &&
						<div className="mx-auto d-flex justify-content-center my-4">
							<Pagination
								onChange={ e =>
									props.getDatasByFilter( { ...props.paging, page: e, ...props.params } )
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