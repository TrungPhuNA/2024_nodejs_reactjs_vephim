// @ts-nocheck
import { Form, Input, Select, Switch, Table, Upload } from 'antd';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import React from 'react';
import Widget from '../Widget/Widget';
import { DEFAUT_IMG } from '../../helpers/constant/image';
import { useForm } from 'antd/lib/form/Form';
import { toSlug } from '../../helpers/common/common';
import { getCategoriesByFilter } from '../../services/categoryService';
import { DeleteOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { showProductDetail, submitFormProduct } from '../../services/productService';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { buildImage, timeDelay } from '../../services/common';
import { toggleShowLoading } from '../../redux/actions/common';
import moment from 'moment';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const initOptions = [ {
	key: "",
	value: ""
} ]
export const ProductForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ status, setStatus ] = useState( [] );
	const [ hot, setHot ] = useState( [] );
	const [ categories, setCategories ] = useState( [] );
	const [ files, setFiles ] = useState( [] );
	let [ attributes, setAttributes ] = useState( initOptions );
	const [ product, setProduct ] = useState( null );
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();
	const [ id, setId ] = useState( null );



	useEffect( () =>
	{
		setStatus( [
			{ value: 1, label: "Active" },
			{ value: -1, label: "Inactive" }
		] );
		getListCategories();
	}, [] );

	useEffect( () =>
	{

		if ( params.id )
		{
			setId( Number( params.id ) );
			getProduct( Number( params.id ) );
		}
	}, [ params.id ] );


	useEffect( () =>
	{
		if ( product )
		{
			// let file = [];
			// file.push( {
			// 	uid: file.length,
			// 	name: product?.avatar,
			// 	status: 'done',
			// 	path: product?.avatar,
			// 	url: buildImage( product.avatar ),
			// 	default: true
			// } );

			// if ( product?.product_images?.length > 0 )
			// {
			// 	file = product.product_images.reduce( ( newFile, item ) =>
			// 	{
			// 		if ( item )
			// 		{
			// 			newFile.push( {
			// 				uid: file.length,
			// 				name: item.name,
			// 				status: 'done',
			// 				path: item.path,
			// 				url: buildImage( item.path ),
			// 				default: true
			// 			} );
			// 		}
			// 		return newFile;
			// 	}, file )
			// }
			// setFiles( file )
			console.log( product.genres?.split( ', ' ) );
			let formValue = {
				name: product.name,
				genre: product.genres,
				language: product.language,
				synopsis: product.synopsis,
				directors: product.directors,
				rating: product.rating,
				duration: product.duration,
				top_cast: product.top_cast,
				release_date: product.release_date ? moment( product.release_date ).format( 'yyyy-MM-DD' ) : null,
				image_path: product?.image_path
			}
			form.setFieldsValue( formValue );
			let options = product?.options?.length > 0 ? product?.options : initOptions;
			setAttributes( options )
		}
	}, [ product ] )

	const getListCategories = async () =>
	{
		const result = await getCategoriesByFilter( { page: 1, page_size: 1000 }, dispatch );
		await timeDelay( 500 );
		dispatch( toggleShowLoading( false ) );
		if ( result )
		{
			let category = result.categories.reduce( ( newCate, item ) =>
			{
				if ( item )
				{
					newCate.push( {
						value: item.genre,
						label: item.genre
					} )
				}
				return newCate
			}, [] );
			console.log( category );
			setCategories( category );
		}
	}

	const getProduct = async ( id ) =>
	{
		await showProductDetail( id, setProduct );
	}

	const validateMessages = {
		required: '${label} không được để trống!',
		types: {
			email: '${label} không đúng định dạng email',
			number: '${label} không đúng định dạng số',
			maxLength: '${label} có độ dài không hợp lệ'
		},
		number: {
			range: '${label} trong khoảng ${min} - ${max}',
		},
	};

	const submitForm = async ( e ) =>
	{
		let valueAttributes = attributes?.filter( item => item.key !== "" && item.value !== "" )
		await submitFormProduct( id, files, { ...e, options: valueAttributes }, dispatch, history );
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
			let fileChoose = e?.fileList.map( item =>
			{
				if ( item.default ) return item;
				item.status = 'done';
				return item;
			} );
			setFiles( fileChoose );
		}
		return e?.fileList;
	}
	const routes = [
		{
			name: 'Phim',
			route: '/movie/list'
		},
		{
			name: id ? 'Cập nhật' : 'Tạo mới',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Phim" } />
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
							<Form.Item name="name" label="Tên phim"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input className='form-control' placeholder='Nhập giá trị' />
							</Form.Item>

							<Form.Item name="genre" label="Danh mục"
								rules={ [ { required: true } ] } className='d-block'>
								<Input className='form-control' placeholder='Nhập giá trị' />
								{/* <Select
									placeholder="Chọn danh mục"
									showSearch
									filterOption={ ( input, option ) => ( option?.label?.toLowerCase() ).includes( input?.toLowerCase() ) }

									style={ { width: '100%' } }
									options={ categories }
								/> */}
							</Form.Item>
							<Form.Item name="directors" label="Directors"
								rules={ [ { required: true } ] } className='d-block'>
								<Input className='form-control' placeholder='Nhập giá trị' />
								
							</Form.Item>
							<Form.Item name="image_path" label="Hình ảnh"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input className='form-control' placeholder='Nhập giá trị' />
							</Form.Item>
							{/* <Form.Item
								label="Hình ảnh"
								name="image"
								accept="images/**"
								className='d-block'
								valuePropName="fileList"
								fileList={ files }
								getValueFromEvent={ normFile }
							>
								<Upload action="/upload" listType="picture-card">
									{ files.length <= 5 && <div>
										<PlusOutlined />
										<div style={ { marginTop: 8 } }>Upload</div>
									</div> }
								</Upload>
							</Form.Item> */}

							<Form.Item name="synopsis" label="Mô tả"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input.TextArea rows={ 5 } className='form-control' placeholder='Mô tả' />
							</Form.Item>

							{/* <Form.Item name="content" label="Mô tả"
								rules={ [ { required: true } ] }
								className='d-block'>
								<CKEditor
									editor={ ClassicEditor }
									data={ form.getFieldValue( 'content' ) }
									onChange={ ( e, editor ) =>
									{
										form.setFieldValue( 'content', editor?.getData() || null )
									} }
								/>
							</Form.Item> */}
							<Form.Item name="top_cast" label="Diễn viên"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input  maxLength={30} className='form-control' placeholder='Nhập giá trị' />
							</Form.Item>
							<div className='row'>
								<div className='col-md-4'>
									<Form.Item name="duration" label="Thời lượng"
										rules={ [ { required: true } ] }
										className='d-block'>
										<Input className='form-control' maxLength={10} placeholder='Nhập giá trị' />
									</Form.Item>
								</div>
								<div className='col-md-4' >
									<Form.Item name="rating" label="Rating"
										rules={ [ { required: true } ] }
										className='d-block'>
										<Input type='number' className='form-control' max={10} placeholder='Nhập giá trị' />
									</Form.Item>
								</div>
								<div className='col-md-4'>
									<Form.Item name="release_date" label="Ngày chiếu"
										rules={ [ { required: true } ] }
										className=' d-block'>
										<Input className='form-control' type='date' placeholder='Chọn giá trị' />
									</Form.Item>
								</div>


							</div>

						</div >

						<div className='d-flex justify-content-center'>
							<button type="submit" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
								<i className="nc-icon nc-zoom-split mr-2"></i>{ !id && 'Tạo mới' || 'Cập nhật' }
							</button>

							{ !id && <button type="button" className="btn btn-secondary text-center" style={ { marginLeft: 10, padding: '10px 10px' } } onClick={ resetForm }>
								<i className="nc-icon nc-refresh-02 mr-2"></i> Hoàn tác
							</button> }
						</div>
					</Form >
				</Widget >
			</div >
		</>


	)
}