import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "react-apexcharts";

const series = [

];

const chartSettings = {

};

export default function ApexLineChart ( props )
{
	const [ seriesData, setSeriesData ] = useState( [] );
	const [ option, setOption ] = useState( {} );
	console.log(props);
	useEffect( () =>
	{
		let newData = [ {
			name: 'Revenues',
			data: props.data
		} ]
		setSeriesData( newData );

		if ( props.listDates?.length > 0 )
		{
			setOption( {
				dataLabels: {
					enabled: false,
				},
				stroke: {
					curve: "smooth",
					width: 2,
				},
				xaxis: {
					type: "datetime",
					categories: props.listDates.map( item => moment(item).utc(true).format('DD-MM-yyyy') ),
					labels: {
						style: {
							colors: "#6B859E",
							opacity: 0.7,
						},
						show: true,
						format: 'DD-MM-yyyy'
					},
				},
				label: {
					format: 'DD-MM-yyyy'
				},


				yaxis: {
					labels: {
						style: {
							colors: [ "#6B859E" ],
							opacity: 0.7,
						},
					},
				},
				tooltip: {
					x: {
						show: true,
						format: 'DD-MM'
					},
				},
				fill: {
					type: "gradient",
					gradient: {
						shadeIntensity: 1,
						opacityFrom: 0.7,
						opacityTo: 1,
						stops: [ 40, 90, 100 ]
					}
				},
				colors: [ "#FFC405", "#4D53E0", "#43BC13", "#FF5668" ],
				chart: {
					toolbar: {
						show: true,
					},
				},
				legend: {
					show: true,
					horizontalAlign: "center",
				},
			} )
		}
	}, [ props.isCheck ] );
	return (

		<>
			{ props?.data?.length > 0 && <ApexCharts
				options={ option }
				series={ seriesData }
				type="area"
				height={ 300 }
			/> }
			
		</>
	);
}
