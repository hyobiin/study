'use client';

import CKEditorWrapper from "./CKEditorWrapper";
import InlineEditorBuild from "@ckeditor/ckeditor5-build-inline";

export default function InlineEditor() {
    return <CKEditorWrapper editor={InlineEditorBuild} title="CKEditor inline Editor" />;
}