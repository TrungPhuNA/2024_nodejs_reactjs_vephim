// @ts-nocheck
import React, { useEffect, useState } from "react";
import
{
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Table,
	UncontrolledDropdown
} from "reactstrap";
import Widget from "../Widget/Widget.js";
import Icon, { SmallDashOutlined } from '@ant-design/icons';

import s from "../../pages/tables/Tables.js";
import { customDate, customNumber } from "../../helpers/common/common.js";
import { OrderSearch } from "./OrderSearch.js";
import { Pagination } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { EMPTY_IMG } from "../../helpers/constant/image.js";

export const Orders = ( props ) =>
{

	const [ open, setOpen ] = useState( false );

	const dropdownOpen = () =>
	{
		setOpen( !open );
	}

	const genStatus = ( status ) =>
	{
		if ( status === 1 ) return <div className="badge bg-warning">Chờ duyệt</div>;
		else if ( status === 2 ) return <div className="badge bg-primary">Đã duyệt</div>;
		else if ( status === 3 ) return <div className="badge bg-success">Hoàn thành</div>;
		else return <div className="badge bg-danger">Hủy bỏ</div>;
	}

	const genPaymentStatus = ( status ) =>
	{

		if ( status === 1 ) return <div className="badge bg-success">Đã thanh toán</div>;
		return <div className="badge bg-primary">Chưa thanh toán</div>;
	}

	const genPaymentType = ( status ) =>
	{

		if ( status === 1 ) return <div className="text-success">Thanh toán online</div>;
		return <div className="text-primary">Tiền mặt</div>;
	}

	const genShippingStatus = ( status ) =>
	{
		if ( status === 1 ) return <div className="badge bg-warning">Chờ lấy hàng</div>;
		else if ( status === 2 ) return <div className="badge bg-primary">Đang giao</div>;
		else if ( status === 4 ) return <div className="badge bg-success">Đã nhận hàng</div>;

		else return <div className="badge bg-success">Đã giao</div>;
	}

	return (
		<>
			<Widget>
				<div className="p-5">
					<OrderSearch { ...props } />
				</div>
			</Widget >
			<Widget>

				<div className="widget-table-overflow p-5 mt-4">
					<h5>Total: { props.paging.total }</h5>
					<div className="table-responsive">
						<Table className={ `table-striped table-bordered table-hover mb-9` } responsive>
							<thead>
								<tr>
									<th>#</th>
									<th className="text-nowrap">Khách hàng</th>
									<th className="text-nowrap text-right">Tổng giá</th>
									<th className="text-nowrap text-right">Tổng giảm giá</th>
									<th className="text-nowrap text-center">Trạng thái</th>
									<th className="text-nowrap text-center">Hình thức thanh toán</th>
									<th className="text-nowrap text-center">Trạng thái thanh toán</th>
									<th className="text-nowrap text-center">Trạng thái giao hàng</th>
									<th className="text-nowrap text-center">Thời gian</th>
									<th className="text-nowrap text-center">Thao tác</th>
								</tr>
							</thead>
							<tbody>
								{
									props.orders?.length > 0 && props.orders.map( ( item, key ) =>
									{
										return (
											< tr key={ key } className="table-product">
												<td>{ item.code || item.id }</td>
												<td>
													<span className="font-weight-bold">Tên tài khoản:</span><span> { item.receiver_name } <br /></span>
													<span className="font-weight-bold">SĐT:</span><span> { item.receiver_phone } <br /></span>
												</td>
												<td className="text-right">{ customNumber( item.total_price, ',', '₫' ) }</td>
												<td className="text-right">{ customNumber( item.total_discount, ',', '₫' ) }</td>
												<td className="text-center">{ genStatus( item.status ) }</td>
												<td className="text-center">{ genPaymentType( item.payment_type ) }</td>
												<td className="text-center">{ genPaymentStatus( item.payment_status ) }</td>
												<td className="text-center">{ genShippingStatus( item.shipping_status ) }</td>
												<td className="text-center">
													<div className="d-flex justify-content-between text-nowrap">
														<p className="mr-2">Tạo: </p>
														<p >{ customDate( item.created_at, 'DD/MM/yyyy' ) }</p>
													</div>
													<div className="d-flex justify-content-between text-nowrap">
														<p className="mr-2">Cập nhật: </p>
														<p >{ customDate( item.updated_at, 'DD/MM/yyyy' ) }</p>
													</div>
												</td>
												<td className="text-center">

													<UncontrolledDropdown group>
														<DropdownToggle className="p-0" style={ { border: 'none', borderRadius: 'unset', background: 'none' } }>
															<SmallDashOutlined />
														</DropdownToggle>
														<DropdownMenu className="p-0">
															<DropdownItem href={ `view/${ item.id }` } className="text-nowrap pt-2">
																Chi tiết
															</DropdownItem>
															<DropdownItem href={ `edit/${ item.id }` } className="text-nowrap pt-2">
																Chỉnh sửa
															</DropdownItem>

														</DropdownMenu>
													</UncontrolledDropdown>
												</td>
											</tr>
										)
									}
									) }

								{
									( !props.orders || props.orders?.length <= 0 ) &&
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
									props.getOrdersByFilters( { ...props.paging, page: e, ...props.params } )
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