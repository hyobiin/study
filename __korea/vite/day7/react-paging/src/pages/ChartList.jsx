
import Chart from "../components/extras/Chart"

const ChartList = () => {
    return(
        <>
            <Chart
                width={160}
                height={160}
                option={{
                    chart: {
                        type: "bar",
                    },
                    colors: ['#556EE6', '#28a745', '#ffc107'], // 차트 색상
                    plotOptions: {
                        bar: {
                            columnWidth: '50%',
                        },
                    },
                    xaxis: {
                        categories: ['A', 'B', 'C', 'D'],
                    },
                }}
            />
        </>
    )
}

export default ChartList