// @ts-nocheck
import { Button, Form, Input, Select } from 'antd';
import { useState } from "react";
import { useEffect } from "react";
import React from 'react';
import { useForm } from 'antd/lib/form/Form';

export const SlideSearch = ( props ) =>
{
	const [ form ] = useForm();
	const [ status, setStatus ] = useState( [] );
	const [ hot, setHot ] = useState( [] );

	useEffect( () =>
	{
		setStatus( [
			{ value: 1, label: "Active" },
			{ value: -1, label: "Inactive" }
		] );

		setHot( [
			{ value: 1, label: "Hot" },
			{ value: -1, label: "Not hot" }
		] );
	}, [] )


	const submitForm = ( value ) =>
	{
		if ( value.name )
		{
			value.name = value.name.trim();
		}
		if ( value.id )
		{
			value.id = value.id.trim();
		}
		props.getDatasByFilter( { page: 1, page_size: 10, ...value } );
		props.setParams( value );
	}

	const resetForm = () =>
	{
		props.getDatasByFilter( { page: 1, page_size: 10 } );
		props.setParams( {
			id: null,
			name: null,
			category_id: null,
			status: null,
			hot: null
		} );
		form.resetFields();
	}
	return (
		<Form
			name='search'
			form={ form }
			onFinish={ submitForm }
		>
			<div className="row mb-1">
				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="id" label="id" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập Id' />
					</Form.Item>
				</div>
				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="name" label="Tên" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập tên' />
					</Form.Item>
				</div>
				{/* <div className="col-md-3 mb-2">
					<Form.Item name="status" label="Trạng thái" className='mb-0 d-block'>
						<Select
							placeholder="Chọn trạng thái"
							style={ { width: '100%' } }
							options={ status }
						/>
					</Form.Item>
				</div>
				<div className="col-md-3 mb-2">
					<Form.Item name="hot" label="Hot" className='mb-0 d-block'>
						<Select
							placeholder="Chọn trạng thái nổi bật"
							style={ { width: '100%' } }
							options={ hot }
						/>
					</Form.Item>
				</div> */}
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