// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCategoriesByFilter } from "../../services/categoryService";
import { Categories } from "../../components/Category/Category";
import { timeDelay } from "../../services/common";
import { toggleShowLoading } from "../../redux/actions/common";
import { SlidesPage } from "../../components/Slide/Slide";
import { SlideService, getDataByFilter } from "../../services/slideService";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs";
import { message } from "antd";

export const SlidesContainer = () =>
{

	const [ datas, setDatas ] = useState( [] );
	const [ paging, setPaging ] = useState( {
		page: 1,
		page_size: 10
	} );
	const [ params, setParams ] = useState( {} );
	const dispatch = useDispatch();

	useEffect( () =>
	{
		getDatasByFilter( paging );
	}, [] );

	const getDatasByFilter = async ( filter ) =>
	{
		dispatch( toggleShowLoading( true ) );
		const rs = await getDataByFilter( filter, dispatch );
		await timeDelay( 1000 );

		dispatch( toggleShowLoading( false ) );
		if ( rs )
		{
			setDatas( rs.slides );
			setPaging( rs.meta );
		}
	}

	const routes = [
		{
			name: 'Slide',
			route: '/slide/list'
		},
		{
			name: 'Danh sách',
			route: ''
		}
	];

	const deleteById = async (id) => {
		try {
			const response = await SlideService.delete(id);
			if(response?.status === 'success') {
				message.success('Xóa thành công');
				await getDatasByFilter({...paging, ...params});
			} else {
				message.error(response?.message);
			}

		} catch (error) {
			message.error(error?.message);
		}
	}

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Slide" } /> <SlidesPage
				datas={ datas }
				paging={ paging }
				params={ params }
				deleteById={ deleteById }
				getDatasByFilter={ getDatasByFilter }
				setParams={ setParams }
				setPaging={ setPaging }
				setDatas={ setDatas }
			/></> )
};
