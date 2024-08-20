// @ts-nocheck
import { Form, Input, Select, message } from 'antd';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import React from 'react';
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import Widget from '../Widget/Widget';
import { useForm } from 'antd/lib/form/Form';
import { customNumber, toSlug } from '../../helpers/common/common';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { getOrderById, updateOrder } from '../../services/orderService';
import { Table } from 'reactstrap';
import { toggleShowLoading } from '../../redux/actions/common';
import { buildImage, onErrorImage } from '../../services/common';
import { PAYMENT_STATUS, PAYMENT_TYPE } from '../../helpers/constant/value';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';

export const OrderForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ orderInfo, setOrderInfo ] = useState();
	const dispatch = useDispatch();
	const params = useParams();
	const [ id, setId ] = useState( null );
	const [ status, setStatus ] = useState();
	const [ shippingStatus, setShippingStatus ] = useState();
	const [ totalDiscount, setTotalDiscount ] = useState( 0 );
	const [ totalPrice, setTotalPrice ] = useState( 0 );

	const [ transactions, setTransactions ] = useState( [] );
	const isView = props.location?.pathname?.includes( 'view' );

	useEffect( () =>
	{
		setStatus( [
			{ value: 1, label: 'Chờ duyệt' },
			{ value: 2, label: 'Đã duyệt' },
			{ value: 3, label: 'Hoàn thành' },
			{ value: 4, label: 'Hủy bỏ' },
		] );

		setShippingStatus( [
			{ value: 1, label: 'Chờ giao hàng' },
			{ value: 2, label: 'Đang giao' },
			{ value: 3, label: 'Đã giao' },
			{ value: 4, label: 'Đã nhận hàng' },
		] )
	}, [] );

	useEffect( () =>
	{
		if ( params.id )
		{
			setId( Number( params.id ) );
			getOrderInfo( Number( params.id ) );
		}
	}, [ params.id ] );

	useEffect( () =>
	{
		if ( orderInfo )
		{
			form.setFieldsValue( {
				receiver_name: orderInfo.receiver_name,
				receiver_email: orderInfo.receiver_email,
				receiver_phone: orderInfo.receiver_phone,
				receiver_address: orderInfo.receiver_address,
				status: orderInfo.status,
				shipping_status: orderInfo.shipping_status,
				payment_type: Number( orderInfo?.payment_type || 0 ),
				payment_status: Number( orderInfo?.payment_status || 0 ),
				note: orderInfo.note
			} );
			setTotalDiscount( orderInfo.total_discount )
			setTotalPrice( orderInfo.total_price );
			setTransactions( orderInfo.transactions )
		}
	}, [ orderInfo ] );

	const getOrderInfo = async ( id ) =>
	{
		await getOrderById( id, setOrderInfo, dispatch );
	}

	const validateMessages = {
		required: '${label} không được để trống!',
		types: {
			email: '${label} không đúng định dạng email',
			number: '${label} không đúng định dạng số',
			min: '${label} không đúng định dạng!',
			max: '${label} không đúng định dạng!',
		},
		number: {
			range: '${label} trong khoảng ${min} - ${max}',
		},
	};

	const submitForm = async ( e ) =>
	{
		dispatch( toggleShowLoading( true ) );
		const response = await updateOrder( id, e );
		dispatch( toggleShowLoading( false ) );

		if ( response?.status === 'success' )
		{
			message.success( 'Cập nhật đơn hàng thành công!' );
			window.location.href = '/order'
		} else
		{
			message.error( response?.message );
		}
	}

	const onFieldsChange = ( e ) =>
	{
		if ( e?.length > 0 )
		{
			let value = typeof e[ 0 ].value == 'string' ? e[ 0 ].value : e[ 0 ].value;
			if ( e[ 0 ].name[ 0 ] === 'name' && value != '' )
			{
				let slug = toSlug( value );
				form.setFieldsValue( { slug: slug } );
			}
			let fieldValue = {
				[ String( e[ 0 ].name[ 0 ] ) ]: value
			}
			form.setFieldsValue( fieldValue );
		}
	}
	const routes = [
		{
			name: 'Đơn hàng',
			route: '/order/list'
		},
		{
			name: !isView ? 'Cập nhật' : 'Chi tiết',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Đơn hàng" } />
			<div className="w-75 mx-auto">
				<Widget>
					<Form
						className='p-3'
						name='nest-messages form'
						form={ form }
						onFinish={ submitForm }
						onFieldsChange={ onFieldsChange }
						validateMessages={ validateMessages }
					>
						<div className='mb-3'>

							<Form.Item name="receiver_name" label="Tên người nhận"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input className='form-control' readOnly={ isView } placeholder='Nhập tên người nhận' />
							</Form.Item>

							<div className='row'>
								<div className='col-md-6'>
									<Form.Item name="receiver_phone" label="Số điện thoại"
										rules={ [ { required: true, min: 10, max: 12 } ] }
										className=' d-block'>
										<Input className='form-control' readOnly={ isView } placeholder='Nhập số điện thoại' />
									</Form.Item>
								</div>
								<div className='col-md-6'>
									<Form.Item name="receiver_email" readOnly={ isView } label="Email người nhận"
										rules={ [ { required: true, type: 'email' } ] }
										className=' d-block'>
										<Input className='form-control' type='email' readOnly={ isView } placeholder='Nhập email' />
									</Form.Item>
								</div>
							</div>

							<Form.Item name="receiver_address" label="Địa chỉ"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input className='form-control' readOnly={ isView } placeholder='Nhập địa chỉ' />
							</Form.Item>

							<div className='row'>
								<div className='col-md-6'>
									<Form.Item name="status" label="Trạng thái"
										rules={ [ { required: true } ] }
										className=' d-block'>
										<Select
											placeholder="Chọn trạng thái"
											disabled={ isView }
											style={ { width: '100%' } }
											options={ status }
										/>
									</Form.Item>
								</div>
								<div className='col-md-6'>
									<Form.Item name="shipping_status" label="Trạng thái giao hàng"
										rules={ [ { required: true } ] }
										className=' d-block'>
										<Select
											placeholder="Chọn trạng thái giao hàng"
											disabled={ isView }
											style={ { width: '100%' } }
											options={ shippingStatus }
										/>
									</Form.Item>
								</div>
							</div>

							<div className="widget-table-overflow mt-4">
								<Table className={ `table-striped table-bordered table-hover mb-9` } responsive>
									<thead>
										<tr>
											<th>STT</th>
											<th>Hình ảnh</th>
											<th>Tên sản phẩm</th>
											<th className='text-right'>Giá gốc</th>
											<th className='text-right'>Số lượng</th>
											<th className='text-right'>Tổng</th>
										</tr>
									</thead>
									<tbody>
										{ transactions?.length > 0 &&
											transactions.map( ( item, index ) => 
											{
												return (
													<tr key={ index }>
														<td className='text-center'>{ index + 1 }</td>
														<td>{
															<img style={ { border: "1px solid", borderRadius: "10px" } } src={ buildImage( item.avatar ) }
																alt={ item.avatar } width={ 100 }
																height={ 100 } onError={ onErrorImage } />
														}</td>
														<td className='text-break' style={ { maxWidth: "200px" } }>{ item.name }</td>
														<td className='text-right'>{ customNumber( item.price, ',', 'đ' ) }</td>
														<td className='text-right'>{ item.quantity }</td>
														<td className='text-right'>{ customNumber( item.total_price, ',', 'đ' ) }</td>
													</tr>
												);
											}
											)
										}

									</tbody>
								</Table>
							</div>

							<Form.Item name="note" label="Ghi chú"
								className=' d-block'>
								<Input.TextArea rows={ 5 } readOnly={ isView } className='form-control' placeholder='Ghi chú' />
							</Form.Item>
							<div className='row'>
								<div className='col-12 col-md-6 '>
									<Form.Item name="payment_type" label="Hình thức thanh toán"
										className='d-block'>
										<Select
											placeholder="Hình thức thanh toán"
											disabled={ isView }
											style={ { width: '100%' } }
											options={ PAYMENT_TYPE }
										/>
									</Form.Item>
								</div>

								<div className='col-12 col-md-6 '>
									<Form.Item name="payment_status"
										label="Trạng thái thanh toán" className='d-block'>

										<Select
											placeholder="Chọn trạng thái thanh toán"
											disabled={ isView }
											style={ { width: '100%' } }
											options={ PAYMENT_STATUS }
										/>
									</Form.Item>
								</div>

							</div>
							<div className='row'>
								<div className='col-md-6 mb-0 d-flex'>
									<h5 className='font-weight-normal'>Giảm giá:</h5>
									<h5 className='ml-2 font-italic'>{ customNumber( totalDiscount, ',', 'đ' ) }</h5>
								</div>

								<div className='col-md-6 mb-0 d-flex'>
									<h5 className='font-weight-normal'>Tổng giá:</h5>
									<h5 className='ml-2 font-italic'>{ customNumber( totalPrice, ',', 'đ' ) }</h5>
								</div>
							</div>

						</div>

						<div className='d-flex justify-content-center'>
							{ isView ?
								<button type="button" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
									<Link className="text-white" to="/order"><i className="nc-icon nc-zoom-split mr-2"></i>Quay lại</Link>
								</button> :
								<button type="submit" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
									<i className="nc-icon nc-zoom-split mr-2"></i>Cập nhật
								</button>
							}


						</div>
					</Form>
				</Widget >
			</div>
		</>

	)
}