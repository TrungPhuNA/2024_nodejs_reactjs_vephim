// @ts-nocheck
import { Form, Input, Select, Switch, Upload, message } from 'antd';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import React from 'react';
import Widget from '../Widget/Widget';
import { DEFAUT_IMG } from '../../helpers/constant/image';
import { useForm } from 'antd/lib/form/Form';
import { toSlug } from '../../helpers/common/common';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { showCategoryDetail, submitForms } from '../../services/categoryService';
import { buildImage } from '../../services/common';
import { toggleShowLoading } from '../../redux/actions/common';
import { MenuService, submitMenuForms } from '../../services/menuService';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';
export const MenuForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ files, setFiles ] = useState( [] );
	const [ data, setData ] = useState( null );
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();
	const [ id, setId ] = useState( null );

	useEffect( () =>
	{
		if ( params.id )
		{
			setId( params.id );
			getData( params.id );
		}
	}, [ params.id ] );


	useEffect( () =>
	{
		if ( data )
		{

			let formValue = {
				name: data.name,
			}
			form.setFieldsValue( formValue )

		}
	}, [ data ] )

	const getData = async ( id ) =>
	{
		try
		{
			dispatch( toggleShowLoading( true ) );
			const response = await MenuService.show( id, params );
			if ( response?.status === "success" )
			{
				setData( response?.data );
			} else
			{
				message.error( 'Not found data' )
			}
			dispatch( toggleShowLoading( false ) );
		} catch ( error )
		{
			message.error( 'Not found data' )
			dispatch( toggleShowLoading( false ) );
		}
	}

	const validateMessages = {
		required: '${label} is required!',
		types: {
			email: '${label} is not a valid email!',
			number: '${label} is not a valid number!',
		},
		number: {
			range: '${label} must be between ${min} and ${max}',
		},
	};

	const submitForm = async ( e ) =>
	{
		e.slug = toSlug(e.name)
		await submitMenuForms( id, files, e, dispatch, history );
	}

	const resetForm = () =>
	{
		form.resetFields();
	}

	const onFieldsChange = ( e ) =>
	{
		if ( e.length > 0 )
		{
			let value = typeof e[ 0 ].value === 'string' ? e[ 0 ].value : e[ 0 ].value;
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

	const normFile = ( e ) =>
	{
		if ( e?.fileList )
		{
			let fileChoose = e?.fileList;
			setFiles( fileChoose );
		}
		return e?.fileList;
	}
	const routes = [
		{
			name: 'Danh mục blog',
			route: '/menu'
		},
		{
			name: id ? 'Cập nhật' : 'Tạo mới',
			route: ''
		}
	];
	return <>
		<Breadcrumbs routes={ routes } title={ "Danh mục blog" } />
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
						<Form.Item name="name" label="Tiêu đề"
							rules={ [ { required: true } ] }
							className=' d-block'>
							<Input className='form-control' placeholder='Nhập tiêu đề' />
						</Form.Item>
					</div>

					<div className='d-flex justify-content-center'>
						<button type="submit" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
							{ !id && 'Tạo mới' || 'Cập nhật' }
						</button>

						{ !id && <button type="button" className="btn btn-secondary text-center" style={ { marginLeft: 10, padding: '10px 10px' } } onClick={ resetForm }>
							Làm mới
						</button> }
					</div>
				</Form>
			</Widget >
		</div>

	</>
}