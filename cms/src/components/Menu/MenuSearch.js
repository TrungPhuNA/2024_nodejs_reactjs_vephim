// @ts-nocheck
import { Button, Form, Input, Select } from 'antd';
import { useState } from "react";
import { useEffect } from "react";
import React from 'react';
import { useForm } from 'antd/lib/form/Form';

export const MenuSearch = ( props ) =>
{
	const [ form ] = useForm();

	useEffect( () =>
	{
		
	}, [] )


	const submitForm = ( value ) =>
	{
		if ( value.name )
		{
			value.name = value.name.trim();
		}
		
		props.getDatasByFilter( { page: 1, page_size: props?.paging?.page_size, ...value } );
		props.setParams( value );
	}

	const resetForm = () =>
	{
		props.getDatasByFilter( { page: 1, page_size: props?.paging?.page_size } );
		props.setParams( {
			name: null,
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
					<Form.Item name="name" label="Tiêu đề" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập tiêu đề' />
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