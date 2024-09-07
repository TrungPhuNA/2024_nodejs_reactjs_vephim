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
				{/* <div className="p-5">
					<OrderSearch { ...props } />
				</div> */}
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
									<th className="text-nowrap text-right">Giá vé</th>
									<th className="text-nowrap text-center">Thông tin phim</th>
									<th className="text-nowrap text-center">Ghế</th>
									<th className="text-nowrap text-center">Thông tin rạp</th>
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
												<td>{ ( props.paging.page - 1 ) * props.paging.page_size + ( key + 1 ) }</td>
												<td>
													<span className="font-weight-bold">Họ và tên:</span><span> { item.last_name + ' ' + item.first_name } <br /></span>
													<span className="font-weight-bold">SĐT:</span><span> { item.phone_number } <br /></span>
													<span className="font-weight-bold">Email:</span><span> { item.email } <br /></span>
												</td>
												<td className="text-right">{ customNumber( item.price, ',', '₫' ) }</td>
												<td >
													<ul style={{minWidth: '200px'}}>
														<li>
															<div className="d-flex justify-content-between">
																<p className="text-nowrap mr-3  ">Tên phim: </p> 
																<p className="font-weight-bold">{ item.movie_name }</p>
															</div>
														</li>
														<li>
															<div className="d-md-flex justify-content-between">
																<p className="text-nowrap mr-3  ">Phòng: </p> 
																<p className="font-weight-bold">{ item.hall_name }</p>
															</div>
														</li>
													</ul>
												</td>
												<td className="text-center">{ item.seat_name }</td>
												<td >
													<ul>
														<li>
															<div className="d-md-flex justify-content-between">
																<p className="text-nowrap  mr-3 ">Tên rạp: </p> <p className="font-weight-bold">{ item.theatre_name }</p>
															</div>
														</li>
														<li>
															<div className="d-md-flex justify-content-between">
																<p className="text-nowrap  mr-3 ">Địa chỉ: </p> <p className="font-weight-bold">{ item.location }</p>
															</div>
														</li>

													</ul>
												</td>

												<td className="text-center text-nowrap">
													{item.movie_start_time} - { customDate( item.showtime_date, 'DD/MM/yyyy' ) }
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
															<DropdownItem onClick={() => props.deleteById(item.id)} className="text-nowrap pt-2">
																Xóa
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
						props.paging?.total > 0 &&
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