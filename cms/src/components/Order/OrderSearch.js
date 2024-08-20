// @ts-nocheck
import { Button, Form, Input, Select } from 'antd';
import { setField } from "../../services/common";
import { useState } from "react";
import { useEffect } from "react";
import React from 'react';
import { useForm } from 'antd/lib/form/Form';

export const OrderSearch = ( props ) =>
{
	const [ form ] = useForm();
	const [ status, setStatus ] = useState( [] );
	const [ shippingStatus, setShippingStatus ] = useState( [] );

	useEffect( () =>
	{
		setStatus( [
			{ value: 1, label: "Chờ duyệt" },
			{ value: 2, label: "Đã duyệt" },
			{ value: 3, label: "Hoàn thành" },
			{ value: 4, label: "Hủy bỏ" }
		] );
		setShippingStatus( [
			{ value: 1, label: "Chờ lấy hàng" },
			{ value: 2, label: "Đang giao" },
			{ value: 3, label: "Đã giao" },
			{ value: 4, label: 'Đã nhận hàng' },
		] );
	}, [] )


	const submitForm = ( value ) =>
	{
		let params = {};
		if ( value.name )
		{
			value.name = value.name.trim();
		}
		if ( value.id )
		{
			value.id = value.id.trim();
		}
		props.getOrdersByFilters( { ...props.paging, page: 1, ...value } );
		props.setParams( value );
	}

	const resetForm = () =>
	{
		props.getOrdersByFilters( { ...props.paging, page: 1 } );
		props.setParams( {
			id: null,
			product_name: null,
			receiver_name: null,
			status: null,
		} );
		form.resetFields();
	}
	return (
		<Form
			name='search product'
			form={ form }
			onFinish={ submitForm }
		>
			<div className="row mb-1">
				
				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="product_name" label="Tên sản phẩm" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập tên sản phẩm' />
					</Form.Item>
				</div>
				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="receiver_name" label="Tên người nhận" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập tên người nhận' />
					</Form.Item>
				</div>
				
				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="receiver_phone" label="SĐT người nhận" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập SĐT người nhận' />
					</Form.Item>
				</div>
				<div className="col-md-3 mb-2">
					<Form.Item name="status" label="Trạng thái" className='mb-0 d-block'>
						<Select
							placeholder="Chọn trạng thái"
							style={ { width: '100%' } }
							options={ status }
						/>
					</Form.Item>
				</div>
				<div className="col-md-3 mb-2">
					<Form.Item name="shipping_status" label="Trạng thái giao hàng" className='mb-0 d-block'>
						<Select
							placeholder="Chọn trạng thái giao hàng"
							style={ { width: '100%' } }
							options={ shippingStatus }
						/>
					</Form.Item>
				</div>
			</div>

			<button type="submit" className="btn btn-primary" style={ { marginRight: 10, padding: '10px 10px' } }>
				<i className="nc-icon nc-zoom-split mr-2"></i>Tìm kiếm
			</button>

			<button type="button" className="btn btn-secondary" style={ { marginLeft: 10, padding: '10px 10px' } } onClick={ resetForm }>
				<i className="nc-icon nc-refresh-02 mr-2"></i> Hoàn tác
			</button>
		</Form>
	);
}