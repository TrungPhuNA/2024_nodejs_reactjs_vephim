// @ts-nocheck
import React, { useEffect, useState } from "react";
import
{
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Table,
	UncontrolledDropdown
} from "reactstrap";
import Widget from "../Widget/Widget.js";
import { SmallDashOutlined } from '@ant-design/icons';
import { connect, useDispatch } from "react-redux";
import { customDate, customNumber } from "../../helpers/common/common.js";
import { Pagination, message } from "antd";
import { EMPTY_IMG } from "../../helpers/constant/image.js";
import { ContactSearch } from "./ContactSearch.js";
import { INIT_PAGING } from "../../helpers/constant/value.js";
import { toggleShowLoading } from "../../redux/actions/common.js";
import { buildFilter, timeDelay } from "../../services/common.js";
import { CONTACT_SERVICE } from "../../services/contactService.js";
import { useHistory } from "react-router-dom";
import Breadcrumbs from "../Breadbrumbs/Breadcrumbs.js";

export const ContactPage = () =>
{

	const [ open, setOpen ] = useState( false );
	const [ params, setParams ] = useState( {
		name: null,
		email: null,
		title: null
	} );
	const [ paging, setPaging ] = useState( INIT_PAGING );
	const [ data, setData ] = useState( [] );

	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		getDataList({...paging, ...params})
	}, [])

	const getDataList = async (filters) => {
		try {
			const params = buildFilter(filters);
			const paramSearch = new URLSearchParams( params ).toString();
			history.replace( { search: paramSearch } );
			dispatch(toggleShowLoading(true));

			const response = await CONTACT_SERVICE.getList(params);
			await timeDelay(500)
			dispatch(toggleShowLoading(false));
			if(response?.status === 'success') {
				setData(response?.data?.results);
				setPaging(response?.data?.meta);
			}
			
 		} catch (error) {
			dispatch(toggleShowLoading(false));
			message.error(error?.message);
		}
	}
	

	const routes = [
		{
			name: 'Liên hệ',
			route: '/contact'
		},
		{
			name: 'Danh sách',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Liên hệ" } />
			<Widget>
				<div className="p-5">
					<ContactSearch 
						params={params}
						paging={paging}
						setParams={setParams}
						setPaging={setPaging}
						getDataList={getDataList}
					/>
				</div>
			</Widget >
			<Widget>

				<div className="widget-table-overflow p-5 mt-4">
					<Table className={ `table-striped table-bordered table-hover mb-9` } responsive>
						<thead>
							<tr>
								<th>#</th>
								<th className="text-nowrap">Tiêu đề</th>
								<th className="text-nowrap">Tên</th>
								<th className="text-nowrap">Email</th>
								<th className="">Nội dung</th>
								<th className="">Thời gian tạo</th>
							</tr>
						</thead>
						<tbody>
							{
								data?.length > 0 && data.map( ( item, key ) =>
								{
									return (
										< tr key={ key } className="table-product">
											<td>{ (paging.page - 1) * paging.page_size + key + 1 }</td>
											<td>
												{item.title}
											</td>
											<td >{ item.name}</td>
											<td >{ item.email }</td>
											<td className="text-break">{item.content }</td>
											<td className="text-center">{ customDate(item.created_at, 'DD/MM/yyyy HH:mm') }</td>
											
										</tr>
									)
								}
								) }

							{
								( !data || data?.length <= 0 ) &&
								<tr>
									<td colSpan={ 9 } style={ { textAlign: "center", backgroundColor: '#ffff' } }>
										<img className="text-center" src={ EMPTY_IMG } style={ { width: "300px", height: "300px" } } />
										<div style={ { color: "#9A9A9A" } }>Dữ liệu trống</div>
									</td>
								</tr>
							}
						</tbody>
					</Table>
					{
						paging.total > 0 &&
						<div className="mx-auto d-flex justify-content-center my-4">
							<Pagination
								onChange={ e =>
									getDataList( { page: e,page_size: paging.page_size, ...params } )
								}
								pageSize={ paging.page_size }
								defaultCurrent={ paging.page }
								total={ paging.total }
							/>
						</div>
					}
				</div>

			</Widget >
		</>

	)
}