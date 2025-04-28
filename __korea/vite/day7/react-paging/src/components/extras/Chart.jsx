import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import classNames from 'classnames';

const Chart = ({ series, options, type, width, height, className, ...props }) => {
	return (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<div className={classNames('apex-chart', className)} {...props}>
			<ReactApexChart
				options={{
                    colors: [
                      '#556EE6', // Primary color
                      '#D9D9D9', // Secondary color
                      '#28a745', // Success color
                      '#17a2b8', // Info color
                      '#ffc107', // Warning color
                      '#dc3545', // Danger color
                    ],
                    plotOptions: {
                        candlestick: {
                            colors: {
                            upward: '#28a745', // Success color
                            downward: '#dc3545', // Danger color
                            },
                        },
                        boxPlot: {
                            colors: {
                            upper: '#28a745', // Success color
                            lower: '#dc3545', // Danger color
                            },
                        },
                    },
                    ...options,
                }}
				series={series}
				type={type}
				width={width}
				height={height}
			/>
		</div>
	);
};
Chart.propTypes = {
	series: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
			PropTypes.shape({
				name: PropTypes.string,
				data: PropTypes.arrayOf(
					PropTypes.oneOfType([
						PropTypes.string,
						PropTypes.number,
						PropTypes.arrayOf(
							PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
						),
						PropTypes.shape({
							x: PropTypes.oneOfType([
								PropTypes.string,
								PropTypes.number,
								PropTypes.arrayOf(
									PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
								),
								PropTypes.object,
							]),
							y: PropTypes.oneOfType([
								PropTypes.string,
								PropTypes.number,
								PropTypes.arrayOf(
									PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
								),
								PropTypes.object,
							]),
						}),
					]),
				),
			}),
		]),
	).isRequired,
	options: PropTypes.shape({
		// eslint-disable-next-line react/forbid-prop-types
		annotations: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		chart: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		colors: PropTypes.array,
		// eslint-disable-next-line react/forbid-prop-types
		dataLabels: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		fill: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		grid: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		labels: PropTypes.array,
		// eslint-disable-next-line react/forbid-prop-types
		legend: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		markers: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		noData: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		plotOptions: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		responsive: PropTypes.array,
		// eslint-disable-next-line react/forbid-prop-types
		series: PropTypes.array,
		// eslint-disable-next-line react/forbid-prop-types
		states: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		stroke: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		subtitle: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		theme: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		title: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		tooltip: PropTypes.object,
		// eslint-disable-next-line react/forbid-prop-types
		xaxis: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
		// eslint-disable-next-line react/forbid-prop-types
		yaxis: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	}).isRequired,
	type: PropTypes.oneOf([
		'line',
		'area',
		'bar',
		'pie',
		'donut',
		'scatter',
		'bubble',
		'heatmap',
		'radialBar',
		'rangeBar',
		'candlestick',
		'boxPlot',
		'radar',
		'polarArea',
	]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	className: PropTypes.string,
};
Chart.defaultProps = {
	type: 'line',
	width: '100%',
	height: 'auto',
	className: null,
};

export default memo(Chart);