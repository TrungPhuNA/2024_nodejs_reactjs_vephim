// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Category, getCategoriesByFilter } from "../../services/categoryService";
import { Categories } from "../../components/Category/Category";
import { timeDelay } from "../../services/common";
import { toggleShowLoading } from "../../redux/actions/common";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs";
import { message } from "antd";

export const CategoryContainer = () =>
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
		const rs = await getCategoriesByFilter( filter, dispatch );
		await timeDelay( 1500 );
		
		dispatch( toggleShowLoading( false ) );
		if ( rs )
		{
			console.log(rs);
			setDatas( rs.categories );
			setPaging( rs.meta );
		}
	}
	console.log(datas);

	const routes = [
		{
			name: 'Danh mục',
			route: '/category'
		},
		{
			name: 'Danh sách',
			route: '/category/list'
		}
	];

	const deleteById = async (data) => {
		try {
			const response = await Category.delete(data);
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
	return ( <>
		<Breadcrumbs routes={routes} title={"Danh mục"} />
		<Categories
			datas={ datas }
			paging={ paging }
			deleteById={ deleteById }
			params={ params }
			getDatasByFilter={ getDatasByFilter }
			setParams={ setParams }
			setPaging={ setPaging }
			setDatas={ setDatas }
		/>
	</> )
};
