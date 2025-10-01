import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Paper, Box } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// A small upload adapter that converts images to base64 so the editor can show them.
// For production, replace with a server endpoint that stores images (e.g., Cloudinary).
function Base64UploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return {
      upload: async () => {
        const file = await loader.file;
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({ default: reader.result });
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });
      }
    };
  };
}

const BlogEditor = ({ initialData = '', onChange, editorHeight = '500px' }) => {
  const editorRef = useRef(null);

  return (
    <Paper elevation={4} sx={{ p: 2 }}>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        <CKEditor
          editor={ClassicEditor}
          config={{
            extraPlugins: [Base64UploadAdapterPlugin],
            toolbar: [
              'heading', '|', 'bold', 'italic', 'underline', 'link', 'bulletedList', 'numberedList', 'blockQuote',
              '|', 'insertTable', 'mergeTableCells', 'tableColumn', 'tableRow', 'mergeTableCells',
              '|', 'imageUpload', 'undo', 'redo'
            ],
            table: {
              contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties' ],
              // enable table resizing plugin if build supports it
            },
            image: {
              toolbar: [ 'imageTextAlternative', 'imageStyle:full', 'imageStyle:side' ]
            }
          }}
          data={initialData}
          onReady={(editor) => {
            editorRef.current = editor;
            try {
              // Set a comfortable minimum height for the editable area so the box looks like a Word-style document.
              editor.editing.view.change((writer) => {
                writer.setStyle('min-height', String(editorHeight), editor.editing.view.document.getRoot());
              });
            } catch (e) {
              // fail silently — this is non-critical styling
              console.warn('Failed to set editor min-height', e);
            }
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            if (typeof onChange === 'function') onChange(data);
          }}
        />
      </Box>
    </Paper>
  );
};

BlogEditor.propTypes = {
  initialData: PropTypes.string,
  onChange: PropTypes.func,
};

export default BlogEditor;
