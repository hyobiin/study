import { AutoSizer, CellMeasurer, CellMeasurerCache, MultiGrid } from 'react-virtualized';

function Table({ selectedRowIndex, setSelectedRowIndex }){

    // 테이블 헤더
    const pregColumns = [
        { name: '제목', key1: 'title', width: 300 },
        { name: '결재상태', key1: 'status', width: 120 },
        { name: '기안일', key1: 'date', width: 150 },
        { name: '출산 예정일', key1: 'pregDate', width: 150 },
        { name: '비고', key1: 'etc', width: 150 },
    ];

    // 테이블 데이터: 테스트 목업 데이터
    const pregTableData = [
        { title: '오나슬', status: '진행대기', date: '2025.04.29 (화)', pregDate: '2025.10.01 (월)', etc: '비고' },
        { title: '나진수', status: '결재완료', date: '2025.04.29 (화)', pregDate: '2025.10.02 (화)', etc: '' },
        { title: '김철수', status: '결재완료', date: '2025.04.29 (화)', pregDate: '2025.10.03 (수)', etc: '' },
    ];

    const TDCell = ({ cellData, columnIndex }) => {
        switch (pregColumns[columnIndex]?.name){
            case '제목':
                return (
                    <>
                        <div className='td_info'>
                            <span>임산부 대상자 신청</span>
                            <span className='flag'>모성보호</span>
                        </div>
                        <div className="user_info">
                            <span className='user_thumb'>{cellData?.charAt(0)}</span>
                            <span className='user_name'>{cellData}</span>
                            <span> | 직급</span>
                        </div>
                    </>
                );
            case '결재상태':
                return <div className={`flag_status ${cellData === '결재완료' ? 'done' : ''}`}>{cellData || ''}</div>;
            default:
                return <div>{cellData || ''}</div>
        }
    };

    const cellCache = new CellMeasurerCache({
        fixedWidth: true, // 고정 너비
        fixedHeight: false,
        defaultHeight: 80,
    });

    const cellRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
        const row = pregTableData[rowIndex - 1]; // 헤더 제외 데이터
        const column = pregColumns?.[columnIndex];
        const cellKey = column?.key1;
        const cellData = row?.[cellKey] ?? ''; // 값

        let styles = { ... style}

        return (
            <>
                {rowIndex === 0 && (
                    <CellMeasurer
                        key={`row-${rowIndex}-${columnIndex}`}
                        cache={cellCache}
                        columnIndex={columnIndex}
                        rowIndex={rowIndex}
                        parent={parent}
                        >
                        <div style={styles} className='custom_th'>
                            {column?.name ?? ''}
                        </div>
                    </CellMeasurer>
                )}
                {rowIndex > 0 && (
                    <CellMeasurer
                        key={`row-${rowIndex}-${columnIndex}`}
                        cache={cellCache}
                        columnIndex={columnIndex}
                        rowIndex={rowIndex}
                        parent={parent}
                    >
                        <div
                            style={styles}
                            className={`custom_td ${columnIndex === 0 ? 'td_title' : ''}`}
                            onClick={() => setSelectedRowIndex(rowIndex - 1)}
                        >
                            <TDCell
                                cellData={cellData}
                                columnIndex={columnIndex}
                            />
                        </div>
                    </CellMeasurer>
                )}
            </>
        );
    };

    // 페이지 출력
    return (
        <>
            <style>
                {`
                    .custom_column_wrap{}
                    .custom_thead{
                        border-bottom:1px solid #e7eef8;
                    }
                    .custom_th{
                        font-weight:bold;
                    }
                    .custom_tbody{
                        padding-top:0.8rem;
                    }
                    .custom_th,
                    .custom_td{
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        padding:0.5rem 2rem;
                    }

                    .flag_status{
                        padding:0.2rem 0.25rem;
                        border:1px solid #f35421;
                        border-radius:5px;
                        font-size:.9rem;
                        font-weight:600;
                        color:#f35421;

                        &.done{
                            border-color:#7f8388;
                            color:#7f8388;
                        }
                    }
                    .user_info{
                        display:flex;
                        align-items:center;
                        gap:.8rem;
                        margin-top:.5rem;
                    }
                    .user_thumb{
                        width:32px;
                        min-width:32px;
                        height:32px;
                        padding:6px;
                        border-radius:50%;
                        background:#dcd5fb;
                        color:#323232;
                        text-align:center;
                    }
                    .user_name{
                        font-weight:bold;
                    }
                    .flag{
                        padding:0 .25rem;
                        border:1px solid #fc622f;
                        border-radius:5px;
                        background:#ffe6dd;
                        font-size:.8rem;
                        color:#fc622f;
                    }
                    .td_info{
                        display:flex;
                        align-items:center;
                        gap:.8rem;
                    }
                    .td_title{
                        display:block;
                    }
                    .custom_td{
                        font-size:1rem;
                        cursor:pointer;
                    }
                `}
            </style>

            <div className='custom_column_wrap' style={{ height: 200 }}>
                {pregTableData?.length === 0
                    ? (
                        <div>신청 목록이 없습니다.</div>
                    ) : (
                    <AutoSizer disableHeight>
                        {({ width }) => (
                            <MultiGrid
                                cellRenderer={cellRenderer}
                                classNameTopRightGrid='custom_thead'
                                classNameBottomRightGrid='custom_tbody'
                                columnCount={pregColumns.length}
                                columnWidth={({ index }) => pregColumns[index].width}
                                height={200}
                                rowCount={pregTableData.length + 1} // 헤더 포함
                                rowHeight={({ index }) => cellCache.getRowHeight(index)}
                                width={width}
                                fixedRowCount={1} // 헤더 고정
                                fixedColumnCount={0} // 첫 번째 열 고정 x, 스크롤 가능
                            />
                        )}
                    </AutoSizer>
                    )
                }
            </div>
        </>
    );
}

export default Table;