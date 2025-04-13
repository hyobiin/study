'use client';

import CKEditorWrapper from "./CKEditorWrapper";
import BallonEditorBuild from "@ckeditor/ckeditor5-build-balloon";

export default function BllonEditor() {
    return <CKEditorWrapper editor={BallonEditorBuild} title="CKEditor ballon Editor" />;
}