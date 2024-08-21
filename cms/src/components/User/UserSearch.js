// @ts-nocheck
import { Form, Input, Select } from 'antd';
import { useState } from "react";
import { useEffect } from "react";
import React from 'react';
import { useForm } from 'antd/lib/form/Form';

export const UserSearch = ( props ) =>
{
	const [ form ] = useForm();
	const [ status, setStatus ] = useState( [] );
	const [ type, setType ] = useState( [] );

	useEffect( () =>
	{
		setStatus( [
			{ value: 1, label: "Active" },
			{ value: -1, label: "Inactive" }
		] );

		setType( [
			{ value: "ADMIN", label: "ADMIN" },
			{ value: "CUSTOMER", label: "CUSTOMER" }
		] );
	}, [] )


	const submitForm = ( value ) =>
	{
		if ( value.first_name )
		{
			value.first_name = value.first_name.trim();
		}
		if ( value.last_name )
		{
			value.last_name = value.last_name.trim();
		}
		if ( value.email )
		{
			value.email = value.email.trim();
		}
		if ( value.phone_number )
		{
			value.phone_number = value.phone_number.trim();
		}
		if ( value.id )
		{
			value.id = value.id.trim();
		}
		props.getListData( { page: 1, page_size: props?.paging?.page_size, ...value } );
		props.setParams( value );
	}

	const resetForm = () =>
	{
		props.getListData( { page: 1, page_size: props?.paging?.page_size } );
		props.setParams( {
			id: null,
			first_name: null,
			last_name: null,
			email: null,
			phone_number: null,
			person_type: null
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
					<Form.Item name="email" label="Email" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập email' />
					</Form.Item>
				</div>
				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="first_name" label="First Name" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập giá trị' />
					</Form.Item>
				</div>
				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="last_name" label="Last Name" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập giá trị' />
					</Form.Item>
				</div>
				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="phone_number" label="Số điện thoại" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập giá trị' />
					</Form.Item>
				</div>
				
				<div className="col-md-3 mb-2">
					<Form.Item name="person_type" label="Loại tài khoản" className='mb-0 d-block'>
						<Select
							placeholder="Chọn loại tài khoản"
							style={ { width: '100%' } }
							options={ type }
						/>
					</Form.Item>
				</div>
			</div>

			<button type="submit" className="btn btn-primary" style={ { marginRight: 10, padding: '10px 10px' } }>
				<i className="nc-icon nc-zoom-split mr-2"></i>Tìm kiếm
			</button>

			<button type="button" className="btn btn-secondary" style={ { marginLeft: 10, padding: '10px 10px' } } onClick={ resetForm }>
				<i className="nc-icon nc-refresh-02 mr-2"></i>Hoàn tác
			</button>
		</Form>
	);
}