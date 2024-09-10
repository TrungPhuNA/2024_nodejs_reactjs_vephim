// @ts-nocheck
import { Form, Input, Select, Switch, Upload } from 'antd';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import React from 'react';
import Widget from '../Widget/Widget';
import { useForm } from 'antd/lib/form/Form';
import { customDate, toSlug } from '../../helpers/common/common';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';

import { toggleShowLoading } from '../../redux/actions/common';
import { DiscountService, submitDiscountForm } from '../../services/discountService';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';
import { getDataByFilter } from '../../services/slideService';
import { getProducts } from '../../services/productService';
import { DeleteOutlined } from '@ant-design/icons';
export const DiscountForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ status, setStatus ] = useState( [] );
	const [ rooms, setRooms ] = useState( [] );
	const [ movies, setMovies ] = useState( [] );
	const [ data, setData ] = useState( null );
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();
	const [ id, setId ] = useState( null );
	const [ dataMovie, setDataMovie ] = useState( [
		{
			hall_id: null,
			movie_id: null
		}
	] )

	useEffect( () =>
	{
		setStatus( [
			{ value: "3D", label: "3D" },
			{ value: "2D", label: "2D" }
		] );

		getListProducts();
		getListRoom();
	}, [] );

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
				movie_start_time: data.movie_start_time,
				show_type: data.show_type,
				status: data.status,

				showtime_date: data.showtime_date ? customDate( data.showtime_date, 'yyyy-MM-DD' ) : null,
				price_per_seat: data.price_per_seat || 0,
			}
			console.log( formValue );
			form.setFieldsValue( formValue );

			setDataMovie(data?.data_movies)

		}
	}, [ data ] )

	const getData = async ( id ) =>
	{
		try
		{
			dispatch( toggleShowLoading( true ) );

			const response = await DiscountService.show( id );
			if ( response?.status === 'success' )
			{
				setData( response?.data )
			}
			dispatch( toggleShowLoading( false ) );
		} catch ( error )
		{
			dispatch( toggleShowLoading( false ) );
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
		let data = { ...e };
		data.data_movies = dataMovie;
		await submitDiscountForm( id, data, dispatch, history );
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
			if ( e[ 0 ].name[ 0 ] === 'code' && value != '' && value != null )
			{
				form.setFieldsValue( { code: value.trim() } );
			}
			let fieldValue = {
				[ String( e[ 0 ].name[ 0 ] ) ]: value
			}
			form.setFieldsValue( fieldValue );
		}
	}

	const getListRoom = async () =>
	{
		const rs = await getDataByFilter( { page: 1, page_size: 10000000 }, dispatch );
		dispatch( toggleShowLoading( false ) );
		if ( rs )
		{
			let data = rs?.rooms?.map( ( item ) =>
			{
				item.value = item.id;
				item.label = item.name;
				return item;
			} )
			setRooms( data );
		}
	}

	const getListProducts = async () =>
	{
		const rs = await getProducts( { page: 1, page_size: 10000000 } );
		if ( rs?.status == 'success' )
		{
			let data = rs?.data?.products?.map( ( item ) =>
			{
				item.value = item.id;
				item.label = item.name;
				return item;
			} )
			setMovies( data );
		}
	}
	const routes = [
		{
			name: 'Lịch chiếu',
			route: '/schedule'
		},
		{
			name: id ? 'Cập nhật' : 'Tạo mới',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Lịch chiếu" } />
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
							<Form.Item name="movie_start_time" label="Thời gian"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input className='form-control' placeholder='Nhập giá trị' />
							</Form.Item>

							<div className='row'>
								<div className='col-12 col-md-6'>
									<Form.Item name="showtime_date" label="Ngày chiếu"
										rules={ [ { required: true } ] }
										className=' d-block'>
										<Input type='date' className='form-control' placeholder='Nhập mã' />
									</Form.Item>
								</div>
								<div className='col-12 col-md-6'>
									<Form.Item name="price_per_seat" label="Giá vé"
										rules={ [ { required: true } ] }
										className=' d-block'>
										<Input type="number" className='form-control' placeholder='Nhập giá trị' />
									</Form.Item>
								</div>

								<div className='col-12 col-md-6'>
									<Form.Item name="show_type" label="Thể loại"
										rules={ [ { required: true } ] } className='d-block'>
										<Select
											placeholder="Chọn giá trị"
											style={ { width: '100%' } }
											options={ status }
										/>
									</Form.Item>
								</div>

							</div>
							<div>
								<h5>Chọn phim và rạp</h5>
								{ dataMovie?.map( ( item, index ) =>
								{
									return <div className='row ' key={ index }>
										<div className='col-sm-5 col-12'>
											<Form.Item label="Tên rạp" className='d-block'>
												<Select
													placeholder="Chọn giá trị"
													showSearch
													value={item.hall_id}
													filterOption={ ( input, option ) => ( option?.label?.toLowerCase() ).includes( input?.toLowerCase() ) }
													onChange={ ( value ) =>
													{
														console.log( value );
														let newOptions = dataMovie.map( ( e, i ) =>
														{
															if ( index == i )
															{
																e.hall_id = value;
															}
															return e;
														} );
														setDataMovie( newOptions )
													} }
													style={ { width: '100%' } }
													options={ rooms }
												/>
											</Form.Item>
										</div>
										<div className='col-sm-5 col-12'>
											<Form.Item label="Phim" className='d-block'>
												<Select
													placeholder="Chọn giá trị"
													showSearch
													value={item.movie_id}
													onChange={ ( value ) =>
													{
														console.log( value );
														let newOptions = dataMovie.map( ( e, i ) =>
														{
															if ( index == i )
															{
																e.movie_id = value;
															}
															return e;
														} );
														setDataMovie( newOptions )
													} }
													filterOption={ ( input, option ) => ( option?.label?.toLowerCase() ).includes( input?.toLowerCase() ) }
													style={ { width: '100%' } }
													options={ movies }
												/>
											</Form.Item>
										</div>
										<div className='col-1 d-flex align-items-end'>
											<Form.Item label="" className='d-block'>
												<DeleteOutlined
													className="ml-2 cursor-pointer"
													onClick={ () =>
													{
														console.log( "data-------> ", dataMovie );
														let newOptions = dataMovie.filter( ( e, i ) => i != index );
														console.log( "new", newOptions );
														setDataMovie( newOptions )
													} }
													style={ { fontSize: "16px", color: "red" } } />
											</Form.Item>

										</div>

									</div>
								} )
								}
								<button type='button' className='btn btn-outline-primary d-flex align-items-center'

									onClick={ () =>
									{
										let newOptions = dataMovie.map( ( item ) => item );
										newOptions.push( {
											movie_id: null,
											hall_id: null
										} );
										setDataMovie( newOptions );
									} }>
									<i className="eva eva-plus" style={ { fontSize: '18px' } }></i>
								</button>
							</div>
						</div>

						<div className='d-flex justify-content-center'>
							<button type="submit" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
								{ !id && 'Create' || 'Update' }
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