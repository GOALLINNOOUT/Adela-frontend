"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import { Bold, Italic } from "@ckeditor/ckeditor5-basic-styles";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Heading } from "@ckeditor/ckeditor5-heading";
import {
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload
} from "@ckeditor/ckeditor5-image";
import { Link } from "@ckeditor/ckeditor5-link";
import { List } from "@ckeditor/ckeditor5-list";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { Base64UploadAdapter } from "@ckeditor/ckeditor5-upload";
import "ckeditor5/ckeditor5.css";

type BlogContentEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

export function BlogContentEditor({ value, onChange }: BlogContentEditorProps) {
  return (
    <div className="admin-rich-editor overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)]">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: "GPL",
          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Link,
            List,
            BlockQuote,
            Image,
            ImageCaption,
            ImageInsert,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Base64UploadAdapter
          ],
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "insertImage",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "|",
            "undo",
            "redo"
          ],
          image: {
            resizeUnit: "%",
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "|",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
              "|",
              "resizeImage"
            ],
            insert: {
              integrations: ["upload", "url"]
            }
          }
        }}
        onChange={(_, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}
