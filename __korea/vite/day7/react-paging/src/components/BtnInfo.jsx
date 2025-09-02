// react-pdf 라이브러리
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// react-pdf-viewer 라이브러리
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// PDF.js worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = new URL('/pdf.worker.mjs', import.meta.url).toString();


const PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

export default function BtnInfo() {
    const [numPages, setNumPages] = useState(null);

    const [scale, setScale] = useState(1.0); // react-pdf 속성

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 2번: iframe 방식 */}
            <div>
                <h3>2. iframe으로 PDF 보기</h3>
                <div style={{ height: '500px', border: '1px solid #ccc' }}>
                <iframe
                    src={PDF_URL}
                    title="iframe-pdf"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                />
                </div>
            </div>

            {/* 3번: react-pdf 직접 렌더링 */}
            <div>
                <h3>3. react-pdf 로 직접 렌더링</h3>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button onClick={() => setScale((prev) => Math.min(prev + 0.2, 3))}>확대 +</button>
                    <button onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.5))}>축소 -</button>
                    <span>배율: {(scale * 100).toFixed(0)}%</span>
                </div>
                <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}>
                <Document
                    file={PDF_URL}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => console.error('PDF 로드 실패: ', error)}
                >
                    {Array.from(new Array(numPages), (_, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={window.innerWidth > 768 ? 600 : 300}
                        scale={scale}
                    />
                    ))}
                </Document>
                </div>
            </div>

            {/* 4번: 새 탭 열기 */}
            <div>
                <h3>4. 새 창/탭으로 열기</h3>
                <button
                onClick={() =>
                    window.open(PDF_URL, '_blank', 'noopener,noreferrer')
                }
                >
                새 창에서 PDF 보기
                </button>
            </div>

            {/* 5번: react-pdf-viewer 사용 */}
            <div>
                <h3>5. react-pdf-viewer (기능 완성형)</h3>
                <div style={{ height: '500px', border: '1px solid #ccc' }}>
                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
                        <Viewer fileUrl={PDF_URL} plugins={[defaultLayoutPlugin()]} />
                    </Worker>
                </div>
            </div>
        </div>
    );
}