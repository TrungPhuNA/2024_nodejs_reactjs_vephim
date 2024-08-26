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
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { showData, SlideService, submitForms } from '../../services/slideService';
import { buildImage } from '../../services/common';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';
export const SlideForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ listData, setListData ] = useState( [] );
	const [ files, setFiles ] = useState( [] );
	const [ data, setData ] = useState( null );
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();
	const [ id, setId ] = useState( null );

	useEffect( () =>
	{
		getDataTheatres()
	}, [] );

	useEffect( () =>
	{
		if ( params.id )
		{
			setId( Number( params.id ) );
			getData( Number( params.id ) );
		}
	}, [ params.id ] );


	useEffect( () =>
	{
		if ( data )
		{
			
			let formValue = {
				name: data.name,
				theatre_id: data.theatre_id,
				total_seats: data.total_seats,
			}
			form.setFieldsValue( formValue )

		}
	}, [ data ] )

	const getData = async ( id ) =>
	{
		await showData( id, setData );
	}
	const getDataTheatres = async (  ) =>
	{
		const response = await SlideService.getListTheatres({page: 1, page_size:10000});
		console.log(response);
		if(response?.status == 'success') {
			let data =response?.data?.theatres?.map((item) => {
				item.value = item.id;
				item.label = item.name;
				return item;
			});
			setListData(data);
		}
	}

	const validateMessages = {
		required: '${label} không được để trống!',
		types: {
			email: '${label} không đúng định dạng email',
			number: '${label} không đúng định dạng số',
			min: '${label} lớn hơn 0',
		},
		number: {
			range: '${label} trong khoảng ${min} - ${max}',
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
			setFiles( e?.fileList );
		}
		return e?.fileList;
	}

	const routes = [
		{
			name: 'Phòng chiếu',
			route: '/room/list'
		},
		{
			name: id ? 'Cập nhật' : 'Tạo mới',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Phòng chiếu" } />
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
							<Form.Item name="name" label="Tên phòng"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input className='form-control' maxLength={10} placeholder='Nhập giá trị' />
							</Form.Item>

							<Form.Item name="total_seats" label="Số lượng vé"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input type='number' min={ 0 } className='form-control' placeholder='Nhập giá trị' />
							</Form.Item>

							<Form.Item name="theatre_id" label="Rạp chiếu phim"
								rules={ [ { required: true } ] } className='d-block'>
								<Select
									placeholder="Chọn giá trị"
									style={ { width: '100%' } }
									options={ listData }
								/>
							</Form.Item>



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
			</div></>

	)
}