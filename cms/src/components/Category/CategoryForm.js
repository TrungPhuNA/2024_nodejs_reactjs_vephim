// @ts-nocheck
import { Form, Input, message, Modal, Select, Switch, Upload } from 'antd';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import React from 'react';
import Widget from '../Widget/Widget';
import { DEFAUT_IMG } from '../../helpers/constant/image';
import { useForm } from 'antd/lib/form/Form';
import { toSlug } from '../../helpers/common/common';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Category, showCategoryDetail, submitForms } from '../../services/categoryService';
import { buildImage, timeDelay } from '../../services/common';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';
import { toggleShowLoading } from '../../redux/actions/common';
export const CategoryForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ data, setData ] = useState( null );
	const dispatch = useDispatch();


	useEffect( () =>
	{
		if ( props.detail )
		{
			let formValue = {
				genre: props.detail?.genre,
				movie_ids: props.detail?.movie_ids
			}

			form.setFieldsValue( formValue )

		}
	}, [ props.detail ] )

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
		let data = {
			...props.detail,
			old_name: props?.detail?.genre,
			genre: e?.genre
		}
		dispatch( toggleShowLoading( true ) );
		const response = await Category.update(  data );
		dispatch( toggleShowLoading( false ) );
		if ( response?.status === 'success' )
		{
			message.success( `Cập nhật thành công!` );
			await timeDelay( 500 );
			props.setIsShowModal( false );
			props.setDetail( null );
			props.getDatasByFilter( { ...props.params, ...props.paging } )
		} else if ( response?.status === 'fail' && response?.data )
		{
			let error = Object.entries( response?.data ) || [];
			if ( error.length > 0 )
			{
				let messageError = error.reduce( ( newMessage, item ) =>
				{
					newMessage[ `${ item[ 0 ] }` ] = item[ 1 ][ 0 ];
					return newMessage
				}, {} );
				message.error( messageError )
			}
		} else
		{
			message.error( response.message || 'Error! Please try again' );
		}
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
		}
		return e?.fileList;
	}

	return (
		<>
			<Modal title="Cập nhật danh mục"
				open={ props.isShowModal } centered
				onCancel={ () =>
				{
					props.setIsShowModal( false );
					props.setDetail( null );
				} }
				footer={null} 

			>
				<Form
					name='nest-messages form'
					form={ form }
					onFinish={ submitForm }
					onFieldsChange={ onFieldsChange }
					validateMessages={ validateMessages }
				>
					<div className='mb-3'>
						<Form.Item name="genre" label="Tên danh mục"
							rules={ [ { required: true } ] }
							className=' d-block'>
							<Input className='form-control' placeholder='Nhập dữ liệu' />
						</Form.Item>
					</div>
					<div className='d-flex justify-content-center'>
						
						<button type="submit" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
							{ 'Cập nhật' }
						</button>
					</div>
				</Form>
			</Modal>
		</>


	)
}