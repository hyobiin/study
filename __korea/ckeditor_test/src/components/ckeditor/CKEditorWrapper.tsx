'use client';

import React, { useRef, useState, useEffect } from 'react';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface props{
    editor: any;
    title?: string;
    isDucoupled?: boolean;
}

export default function CKEditorWrapper({ editor, title = "CKEditor 예제", isDucoupled = false }: props) {
    const [content, setContent] = useState("<p>여기에 입력하세요</p>");
    const editorRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [editorInstance, setEditorInstance] = useState<any>(null);

    useEffect(() => {
        if(!isDucoupled) return;

        if(editorRef.current){
            editor.create(editorRef.current, {licenseKey: "GPL"})
            .then((editor: any) => {
                if(toolbarRef.current){
                    toolbarRef.current.appendChild(editor.ui.view.toolbar.element);
                }
                editor.setData(content);
                editor.model.document.on("change:data", () => {
                    setContent(editor.getData());
                })
                setEditorInstance(editor);
            })
        }

        // 컴포넌트가 삭제되었을 때 방어코드
        return () => {
            if(editorInstance) editorInstance.destory();
        };

    }, [isDucoupled]);

    return(
        <div className="p-4">
            <div>테스트</div>
            <h2 className='text-xl font-bold mb-2'>{title}</h2>

            {isDucoupled ? (
                    <>
                        <div ref={toolbarRef} className='mb-2 border rounded p-2 bg-gray-50' />
                        <div ref={editorRef} className='border p-2 min-h-[200px]' />
                    </>
                ):
                (
                    <CKEditor
                        editor={editor}
                        config={{
                        }}
                        data={content}
                        onChange={(_, editor) => {
                            setContent(editor.getData());
                        }}
                    />
                )
            }

            <textarea name="" id=""></textarea>
            <div className="mt-4 p-2 border rounded bg-gary-100">
                <h3 className="text-lg font-semibold">입력된 내용</h3>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
        </div>
    )
}