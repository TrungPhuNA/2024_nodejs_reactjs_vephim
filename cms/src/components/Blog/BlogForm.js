// @ts-nocheck
import { Form, Input, Select, Switch, Upload } from 'antd';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import React from 'react';
import Widget from '../Widget/Widget';
import { useForm } from 'antd/lib/form/Form';
import { toSlug } from '../../helpers/common/common';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { submitForms } from '../../services/blogService';
import { buildImage, getItem } from '../../services/common';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BlogService } from '../../services/blogService';
import { toggleShowLoading } from '../../redux/actions/common';
import { MenuService } from '../../services/menuService';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';
export const BlogForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ status, setStatus ] = useState( [] );
	const [ files, setFiles ] = useState( [] );
	const [ data, setData ] = useState( null );
	const [ menu, setMenu ] = useState( [] );
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();
	const [ id, setId ] = useState( null );

	useEffect( () =>
	{
		setStatus( [
			{ value: 1, label: "Active" },
			{ value: 0, label: "Inactive" }
		] );
		getDatasByFilter();
	}, [] );

	useEffect( () =>
	{
		if ( params.id )
		{
			setId( params.id );
			getData( params.id );
		} else
		{
			form.setFieldValue( 'author_name', getItem( 'full_name' ) );
			form.setFieldValue( 'author_email', getItem( 'email' ) );
			form.setFieldValue( 'author_avatar', getItem( 'avatar' ) );
		}
	}, [ params.id ] );


	useEffect( () =>
	{
		if ( data )
		{
			let file = [];
			file.push( {
				uid: file.length,
				name: data.avatar,
				status: 'done',
				url: buildImage( data.avatar ),
				default: true
			} );
			let formValue = {
				title: data.title,
				content: data.content,
				menu_id: data.menu_id,
				tags: data.tags,
				title: data.title,
				description: data.description,
				status: data.status || 0,
				slug: data.slug,
				author_avatar: data.author_avatar,
				author_email: data.author_email,
				author_name: data.author_name,
				image: file
			}
			setFiles( file )
			form.setFieldsValue( formValue )

		}
	}, [ data ] )

	const getData = async ( id ) =>
	{
		try
		{

			dispatch( toggleShowLoading( true ) )
			const response = await BlogService.show( id );

			if ( response?.status === "success" )
			{
				setData( response?.data )
			}
			dispatch( toggleShowLoading( false ) );
		} catch ( error )
		{
			dispatch( toggleShowLoading( false ) );
		}
	}

	const getDatasByFilter = async ( filter ) =>
	{
		try
		{

			dispatch( toggleShowLoading( true ) )
			const response = await MenuService.getList( params );

			if ( response?.status === "success" )
			{
				let menuData = response.data?.menus.reduce( ( newCate, item ) =>
				{
					if ( item )
					{
						newCate.push( {
							value: item.id,
							label: item.name
						} )
					}
					return newCate
				}, [] );
				setMenu( menuData )
			}
			dispatch( toggleShowLoading( false ) );
		} catch ( error )
		{
			dispatch( toggleShowLoading( false ) );
		}
	}

	const validateMessages = {
		required: '${label} Không được để trống!',
		types: {
			email: '${label} Không đúng định dạng email!',
			number: '${label} Không đúng định dạng số!',
		},
		number: {
			range: '${label} must be between ${min} and ${max}',
		},
	};

	const submitForm = async ( e ) =>
	{
		await submitForms( id, files, e, dispatch, history );
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
			if ( e[ 0 ].name[ 0 ] === 'title' && value != '' )
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
			name: 'Blog',
			route: '/blog'
		},
		{
			name: id ? 'Cập nhật' : 'Tạo mới',
			route:''
		}
	];
	return <>
		<Breadcrumbs routes={ routes } title={ "Blog" } />

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
						<Form.Item name="title" label="Tiêu đề"
							rules={ [ { required: true } ] }
							className=' d-block'>
							<Input className='form-control' placeholder='Nhập tiêu đề' />
						</Form.Item>

						<Form.Item name="slug" label="Slug"
							rules={ [ { required: true } ] }
							className=' d-block'>
							<Input className='form-control' placeholder='Nhập slug' />
						</Form.Item>
						<Form.Item
							label="Hình ảnh"
							name="image"
							accept="images/**"
							className='d-block'
							valuePropName="fileList"
							fileList={ files }
							getValueFromEvent={ normFile }
						>
							<Upload action="/upload" listType="picture-card">
								{ files.length < 1 && <div>
									<PlusOutlined />
								</div> }
							</Upload>
						</Form.Item>

						<div className='row'>
							<div className='col-12 col-md-6'>
								<Form.Item name="author_name" label="Tên tác giả"
									rules={ [ { required: true } ] }
									className=' d-block'>
									<Input className='form-control' placeholder='Nhập tên tác giả' />
								</Form.Item>
							</div>

							<div className='col-12 col-md-6'>
								<Form.Item name="author_email" label="Email tác giả"
									rules={ [ { required: true } ] }
									className=' d-block'>
									<Input className='form-control' placeholder='Nhập email tác giả' />
								</Form.Item>
							</div>
							<div className='col-12 col-md-6'>
								<Form.Item name="menu_id" label="Danh mục"
									rules={ [ { required: true } ] } className='d-block'>
									<Select
										placeholder="Chọn danh mục"
										style={ { width: '100%' } }
										options={ menu }
									/>
								</Form.Item>
							</div>

							<div className='col-12 col-md-6'>
								<Form.Item name="status" label="Trạng thái"
									rules={ [ { required: true } ] } className='d-block'>
									<Select
										placeholder="Chọn trạng thái"
										style={ { width: '100%' } }
										options={ status }
									/>
								</Form.Item>
							</div>
						</div>

						<Form.Item name="tags" label="Tags"
							className=' d-block'>
							<Input className='form-control' placeholder='Nhập tags' />
						</Form.Item>

						<Form.Item name="description" label="Mô tả ngắn"
							rules={ [ { required: true } ] }
							className=' d-block'>
							<Input.TextArea rows={ 5 } className='form-control' placeholder='Mô tả ngắn' />
						</Form.Item>

						<Form.Item name="content" label="Mô tả"

							className='d-block'>
							<CKEditor
								editor={ ClassicEditor }
								data={ form.getFieldValue( 'content' ) }
								onChange={ ( e, editor ) =>
								{
									form.setFieldValue( 'content', editor?.getData() || null )
								} }
							/>
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