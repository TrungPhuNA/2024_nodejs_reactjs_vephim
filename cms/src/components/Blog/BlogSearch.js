// @ts-nocheck
import { Button, Form, Input, Select } from 'antd';
import { useState } from "react";
import { useEffect } from "react";
import React from 'react';
import { useForm } from 'antd/lib/form/Form';

export const BlogSearch = ( props ) =>
{
	const [ form ] = useForm();
	const [ status, setStatus ] = useState( [] );
	const [ hot, setHot ] = useState( [] );

	useEffect( () =>
	{
		setStatus( [
			{ value: 1, label: "Active" },
			{ value: 0, label: "Inactive" }
		] );

	}, [] )


	const submitForm = ( value ) =>
	{
		if ( value.title )
		{
			value.title = value.title.trim();
		}
		if ( value.id )
		{
			value.id = value.id.trim();
		}
		props.getDatasByFilter( { page: 1, page_size: props?.paging?.page_size, ...value } );
		props.setParams( value );
	}

	const resetForm = () =>
	{
		props.getDatasByFilter( { page: 1, page_size: props?.paging?.page_size } );
		props.setParams( {
			id: null,
			title: null,
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
				<div className="col-md-4 col-12 mb-2 form-group">
					<Form.Item name="title" label="Tiêu đề" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập tiêu đề' />
					</Form.Item>
				</div>
				<div className="col-md-4 col-12 mb-2">
					<Form.Item name="status" label="Trạng thái" className='mb-0 d-block'>
						<Select
							placeholder="Chọn trạng thái"
							style={ { width: '100%' } }
							options={ status }
						/>
					</Form.Item>
				</div>
			</div>

			<button type="submit" className="btn btn-primary" style={ { marginRight: 10, padding: '10px 10px' } }>
				<i className="nc-icon nc-zoom-split mr-2"></i>Tìm kiếm
			</button>

			<button type="button" className="btn btn-secondary" style={ { marginLeft: 10, padding: '10px 10px' } } onClick={ resetForm }>
				<i className="nc-icon nc-refresh-02 mr-2"></i>Làm mới
			</button>
		</Form>
	);
}