'use client';

import CKEditorWrapper from "./CKEditorWrapper";
import ClassicEditorBuild from "@ckeditor/ckeditor5-build-classic";

export default function ClassicEditor() {
    return <CKEditorWrapper editor={ClassicEditorBuild} title="CKEditor Classic Editor" />;
}