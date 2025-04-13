'use client';

import CKEditorWrapper from "./CKEditorWrapper";
import DucoupledEditorBuild from "@ckeditor/ckeditor5-build-decoupled-document";


export default function DucoupledEditor() {
    return <CKEditorWrapper editor={DucoupledEditorBuild} title="DucoupledEitor 예제" isDucoupled={true} />
}