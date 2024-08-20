import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import s from "../Charts.module.scss";
import Dot from "../../../../components/Dot/Dot";

const chartsSettings = {
	donut: {
		data: [
			{ name: "Chờ duyệt", key: 0, value: 0, color: '#FFC405' },
			{ name: 'Đã duyệt', key: 1, value: 0, color: '#4D53E0' },
			{ name: "Hoàn thành", key: 2, value: 0, color: '#43BC13' },
			{ name: 'Hủy bỏ', key: 3, value: 0, color: '#FF5668' },
		],
	}
};

const RechartsPieChart = ( props ) =>
{

	const [ data, setData ] = useState( chartsSettings.donut.data );
	useEffect( () =>
	{
		if ( props.data )
		{
			let newData = chartsSettings.donut.data.map(item => {
				let status = props.data.find(e => e.status == item.key);
				if(status) item.value = status.total;
				return item;
			});
			setData(newData);
		}
	}, [ props.data ] )
	return (
		<div style={ { height: "316px" } } className="d-md-flex">
			<div className={ s.donutLabels + ' align-items-start' }>
				{ data.map( ( entry, index ) => (
					<div key={ uuidv4() } className={ s.label }>
						<Dot color={ entry.color } />
						<span className="body-3 ml-2">{ entry.name  + `(${entry.value})`} </span>
					</div>
				) ) }
			</div>
			<ResponsiveContainer width="100%" height={ 200 }>
				<PieChart >
					<Pie
						data={ data }
						innerRadius={ 50 }
						outerRadius={ 80 }
						fill="gradient"
						// tooltipType=""
						
						dataKey="value"
					>
						{ data.map( ( entry, index ) => (
							<Cell key={ `cell-${ index }` } fill={ entry.color } />
						) ) }
					</Pie>
				</PieChart>
			</ResponsiveContainer>
			
		</div>
	)
};

export default RechartsPieChart;
