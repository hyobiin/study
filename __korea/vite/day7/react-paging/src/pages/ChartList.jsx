
import Chart from "../components/extras/Chart"

const ChartList = () => {
    return(
        <>
            <p>라인 차트 (default props)</p>
            <Chart
                width={160}
                height={160}
                options={{
                    chart: { type: "bar" },
                    colors: ['#556EE6', '#28a745', '#ffc107'],
                    plotOptions: {
                        bar: { columnWidth: '50%' },
                    },
                    xaxis: { categories: ['A', 'B', 'C', 'D'] },
                }}
                series={[{ name: "데이터", data: [10, 20, 30, 40] }]}
            />

            <p>Bar 차트</p>
            <Chart
                width={160}
                height={160}
                type={'bar'}
                options={{
                    chart: { type: "bar" },
                    colors: ['#556EE6', '#28a745', '#ffc107'],
                    plotOptions: {
                        bar: { columnWidth: '50%' },
                    },
                    xaxis: { categories: ['A', 'B', 'C', 'D'] },
                    series: { name: "데이터", data: [10, 20, 30, 40] },
                    lable: {label: ['A', 'B', 'C', 'D'] },
                }}
            />

            <p>area 차트</p>
            <Chart
                width={160}
                height={160}
                type={'area'}
                options={{
                    chart: { type: "bar" },
                    colors: ['#556EE6', '#28a745', '#ffc107'],
                    plotOptions: {
                        bar: { columnWidth: '50%' },
                    },
                    xaxis: { categories: ['A', 'B', 'C', 'D'] },
                }}
                series={[{ name: "데이터", data: [10, 20, 30, 40] }]}
            />

            <p>pie 차트</p>
            <Chart
                width={160}
                height={160}
                type={'pie'}
                options={{
                    chart: { type: "bar" },
                    colors: ['#556EE6', '#28a745', '#ffc107'],
                    plotOptions: {
                        bar: { columnWidth: '50%' },
                    },
                    xaxis: { categories: ['A', 'B', 'C', 'D'] },
                }}
                series={[{ name: "데이터", data: [10, 20, 30, 40] }]}
            />
        </>
    )
}

export default ChartList