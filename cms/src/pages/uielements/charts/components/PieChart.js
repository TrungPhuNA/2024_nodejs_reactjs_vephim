import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "react-apexcharts";


export default function PipeChartApex ( props )
{
	const [ seriesData, setSeriesData ] = useState( [] );
	const [ option, setOption ] = useState( {} );
	useEffect( () =>
	{
		let newData = [
			{ name: "Chờ duyệt", key: 1, value: 0, color: '#FFC405' },
			{ name: 'Đã duyệt', key: 2, value: 0, color: '#4D53E0' },
			{ name: "Hoàn thành", key: 3, value: 0, color: '#43BC13' },
			{ name: 'Hủy bỏ', key: 4, value: 0, color: '#FF5668' },
		]
		if ( props.data )
		{
			let data = newData.map( item =>
			{
				let status = props.data.find( e => e.status == item.key );
				if ( status ) item.value = status.total;
				return item;
			} );
			setSeriesData( data.map(item=> item.value ) );

			setOption( {
				chart: {
					width: 380,
					type: 'donut',
				},
				
				labels: data.map(item => `${item.name}(${item.value})`),
				responsive: [ {
					breakpoint: 480,
					options: {
						chart: {
							width: 200
						},
						legend: {
							show: true
						}
					}
				} ],
				tooltip: {

				},
				legend: {
					position: 'right',
				}
			} )
		}


	}, [ props.data ] );

	return (

		<ApexCharts
			options={ option }
			series={ seriesData }
			type="donut"
			height={ 300 }
		/>
	);
}
