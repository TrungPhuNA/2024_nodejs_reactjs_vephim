// @ts-nocheck
import { Form, Input, Select, Switch, Upload } from 'antd';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import React from 'react';
import Widget from '../Widget/Widget';
import { DEFAUT_IMG } from '../../helpers/constant/image';
import { useForm } from 'antd/lib/form/Form';
import { toSlug } from '../../helpers/common/common';
import { PlusOutlined } from '@ant-design/icons';
import { submitFormProduct } from '../../services/productService';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { ROLE_SERVICE } from '../../services/rolePermissionService';
import { USER_SERVICE, submitFormUser } from '../../services/userService';
import { buildImage } from '../../services/common';
import moment from 'moment';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';
export const UserForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ status, setStatus ] = useState( [] );
	const [ roles, setRoles ] = useState( [] );
	const [ userType, setUserType ] = useState( [] );
	const [ files, setFiles ] = useState( [] );
	const [ data, setData ] = useState( null );
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();
	const [ id, setId ] = useState( null );

	useEffect( () =>
	{

		setUserType( [
			{ value: "Admin", label: "ADMIN" },
			{ value: "Customer", label: "KHÁCH HÀNG" }
		] );
		// getListRoles();
	}, [] );

	useEffect( () =>
	{
		if ( params.id )
		{
			setId(params.id );
			getData( params.id );
		}
	}, [ params.id ] );


	useEffect( () =>
	{
		if ( data )
		{

			let formValue = {
				first_name: data.first_name,
				email: data.email,
				last_name: data.last_name,
				account_balance: data.account_balance,
				person_type: data.person_type,
				phone_number: data.phone_number,
				// password: data.password,
			}
			form.setFieldsValue( formValue )
		}
	}, [ data ] );




	const getData = async ( id ) =>
	{
		const rs = await USER_SERVICE.showData( id, dispatch );
		console.log(rs);
		if ( rs )
		{
			setData( rs );
		} else
		{
			setData( null );
		}
	}

	const validateMessages = {
		required: '${label} không được để trống!',
		types: {
			email: '${label} không đúng định dạng email',
			number: '${label} không đúng định dạng số',
		},
		number: {
			range: '${label} trong khoảng ${min} - ${max}',
		},
	};

	const submitForm = async ( e ) =>
	{
		delete e.username;
		if ( e?.birthDay ) e.birthDay = moment( e.birthDay ).format( "YYYY-MM-DD HH:mm:ss" );
		await submitFormUser( id, files, e, dispatch, history );
	}

	const resetForm = () =>
	{
		form.resetFields();
	}

	const onFieldsChange = ( e ) =>
	{
		if ( e.length > 0 )
		{
			let value = typeof e[ 0 ].value == 'string' ? e[ 0 ].value : e[ 0 ].value;

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
			name: 'Người dùng',
			route: '/user/list'
		},
		{
			name: id ? 'Cập nhật' : 'Tạo mới',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Người dùng" } />
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



							<div className='row'>
								<div className='col-md-6 col-12'>
									<Form.Item name="first_name" label="Họ"
										rules={ [ { required: true } ] }
										className=' d-block'>
										<Input className='form-control' placeholder='Nhập giá trị'  />
									</Form.Item>
								</div>
								<div className='col-md-6 col-12'>
									<Form.Item name="last_name" label="Tên"
										rules={ [ { required: true } ] }
										className=' d-block'>
										<Input className='form-control' placeholder='Nhập giá trị'  />
									</Form.Item>
								</div>
								{/* <div className='col-12 col-md-6'>
								<Form.Item name="username" label="User name"
									className=' d-block'>
									<Input className='form-control' placeholder='Nhập dữ liệu' />
								</Form.Item>
							</div> */}
								<div className='col-12 col-md-6'>
									<Form.Item name="email" label="Email"
										rules={ [ { required: true } ] }
										className='d-block'>
										<Input className='form-control'  placeholder='Nhập email' />
									</Form.Item>
								</div>
								{ !id && <div className='col-12 col-md-6'>
									<Form.Item name="password" label="Mật khẩu"
										className='required d-block'>
										<Input.Password className='form-control' placeholder='Nhập mật khẩu' />
									</Form.Item>
								</div> }
								<div className='col-12 col-md-6'>
									<Form.Item name="phone_number" label="SĐT"
										className='required d-block'>
										<Input className='form-control' placeholder='Nhập số điện thoại' />
									</Form.Item>
								</div>
								<div className='col-12 col-md-6'>
									<Form.Item name="person_type" label="Loại tài khoản"
										rules={ [ { required: true } ] } className='d-block'>
										<Select
											placeholder="Chọn loại tài khoản"
											style={ { width: '100%' } }
											options={ userType }
										/>
									</Form.Item>
								</div>

								
							</div>
						</div>

						<div className='d-flex justify-content-center'>
							<button type="submit" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
								{ !id && 'Tạo mới' || 'Cập nhật' }
							</button>

							{ !id && <button type="button" className="btn btn-secondary text-center" style={ { marginLeft: 10, padding: '10px 10px' } } onClick={ resetForm }>
								Reset
							</button> }
						</div>
					</Form>
				</Widget >
			</div>
		</>
	)
}