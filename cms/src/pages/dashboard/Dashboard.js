import React, { useEffect, useState } from "react";
import
{
	Col,
	Row,
	Table
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";


import s from "./Dashboard.module.scss";
import { useDispatch } from "react-redux";
import { DASHBOARD_SERVICE } from "../../services/dashboard.js";
import { Form, Select } from "antd";
import moment from "moment";
import PipeChartApex from "../uielements/charts/components/PieChart.js";
import ApexLineChart from "../uielements/charts/components/ApexLineChart.js";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs.js";
import { customNumber } from "../../helpers/common/common.js";


const Dashboard = () =>
{
	const [ checkboxes, setCheckboxes ] = useState( [ true, false ] );
	const [ optionMonth, setOptionMonth ] = useState( [] );
	const [ month, setMonth ] = useState( moment().month() );
	const [ dataRevenue, setDataRevenue ] = useState( [] );
	const [ dataDate, setDataDate ] = useState( [] );
	const [ isCheck, setIsCheck ] = useState( false );

	const toggleCheckbox = ( id ) =>
	{
		setCheckboxes( checkboxes => checkboxes
			.map( ( checkbox, index ) => index === id ? !checkbox : checkbox ) )
	}

	const [ data, setData ] = useState( null );


	const [ params, setParams ] = useState( {} )
	const dispatch = useDispatch();

	useEffect( () =>
	{
		getDashboard( {} );
		getTime()
	}, [] );

	const getTime = () =>
	{
		let arrayTime = [ ...Array( 12 ) ].reduce( ( newItem, item, index ) =>
		{
			let obj = {
				value: index + 1,
				label: `Tháng ${ index + 1 }`
			};
			newItem.push( obj );
			return newItem
		}, [] );
		setOptionMonth( arrayTime )
	}

	const getDashboard = async ( filter ) =>
	{
		setIsCheck( false );
		const response = await DASHBOARD_SERVICE.getByFilter( filter, setData, dispatch );
		if ( response?.status === 'success' )
		{
			let date = response?.data?.group_day?.map( item => item.day );
			let total = response?.data?.group_day?.map( item => item.total_price );
			setDataRevenue( total );
			setDataDate( date );
		}
		setIsCheck( true );


	}
	const routes = [
		{
			name: 'Dashboard',
			route: '/'
		},
	]
	return ( <>
		<Breadcrumbs routes={ routes } title={ "Dashboard" } />
		<Row>
			<Col className="pr-grid-col" xs={ 12 } lg={ 12 }>
				<Row className="gutter mb-4">
					<Col className="mb-4 mb-xl-0" xs={ 6 } sm={ 6 } xl={ 4 }>
						<Widget className="widget-p-sm bg-primary text-white">
							<div className={ s.smallWidget }>
								<div className="d-md-flex align-items-center justify-content-md-between">
									<p className="headline-2">Người dùng</p>
									<p className="headline-2">{customNumber(data?.total_customers || 0 , '.') } <i className="eva eva-people ml-2"></i></p>
								</div>
							</div>
						</Widget>
					</Col>
					<Col xs={ 6 } sm={ 6 } xl={ 4 }>
						<Widget className="widget-p-sm bg-warning text-white">
							<div className={ s.smallWidget }>
								<div className="d-md-flex align-items-center justify-content-md-between">
									<p className="headline-2">Doanh số</p>
									<p className="headline-2"> { customNumber(data?.total_amount || 0 , '.', 'đ')} <i className="eva eva-list ml-2"></i></p>
								</div>
							</div>
						</Widget>
					</Col>
					<Col xs={ 6 } sm={ 6 } xl={ 4 }>
						<Widget className="widget-p-sm bg-success text-white">
							<div className={ s.smallWidget }>
								<div className="d-md-flex align-items-center justify-content-md-between">
									<p className="headline-2">Số lượng vé đã đặt</p>
									<p className="headline-2"> { customNumber(data?.total_tickets || 0 , '.') } <i className="eva eva-layers ml-2"></i></p>
								</div>
							</div>
						</Widget>
					</Col>
				</Row>
				{
					data?.tickets?.length > 0 && <Col className="pr-grid-col px-0" xs={ 12 } md={ 6 }>
					<Widget>
						<div className="headline-2 p-3">Số lượng vé theo phim</div>
						<div className="widget-table-overflow p-3 mt-4">
							<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
								<thead>
									<tr>
										<th className="text-center">#</th>
										<th className="text-nowrap">Tên phim</th>
										<th className="text-nowrap">Số lượng vé đã bán</th>
									</tr>
								</thead>
								<tbody>
									{
										data?.tickets?.length > 0 && data?.tickets.map( ( item, key ) =>
										{
											return (
												< tr key={ key } className="table-product">
													<td className="text-gray-900 text-center">
														{item.movie_id}
													</td>
													
													<td className="text-gray-900">
														<span className="text-break" style={ { minWidth: '300px' } }>
															{ item.name }
														</span>
													</td>

													<td className="text-gray-900 text-right">
														<span className="text-break ">
															{ customNumber(item.tickets_per_movie || 0, '.', '') }
														</span>
													</td>
												</tr>
											)
										}
										) }
								</tbody>
							</Table>
						</div>
					</Widget >
				</Col>
				}
				
				{/* <div className="gutter">

					<Widget className="widget-p-lg">
						<div className="align-items-center row mb-3 p-2">
							<div className="headline-3 mb-3 col-2 font-weight-bold">Chọn tháng:</div>
							<Select
								placeholder="Chọn tháng"
								className="mb-4 col-3 w-100"
								size="large"
								defaultValue={ month + 1 }
								onChange={ ( e ) =>
								{
									getDashboard( { month: e } );
									setMonth( e );
								} }
								options={ optionMonth }
							/>
						</div>
						<Row className="gutter mb-4">
							<Col className="mb-4 mb-md-0" xs={ 12 } md={ 6 }>
								<h2 className="headline-2">Đặt vé</h2>
								<PipeChartApex className="pb-4" data={ data?.group_status } />
							</Col>
							<Col className="my-4 pr-0 mb-md-0" xs={ 12 } md={ 12 }>
								<h2 className="headline-2 mb-3">Số lượng vé</h2>

								<ApexLineChart className="pb-4" month={ month } isCheck={ isCheck } listDates={ dataDate } data={ dataRevenue } />
							</Col>

						</Row>
					</Widget>

				</div> */}

			</Col>
		</Row >
	</>
	)
}

export default Dashboard;
