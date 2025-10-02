import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Paper, Box } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ImageEditor from './ImageEditor';

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
  const [openEditor, setOpenEditor] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  return (
    <Paper elevation={4} sx={{ p: 2 }}>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, gap: 1 }}>
          <Button size="small" onClick={() => setOpenEditor(true)}>Upload & Edit Image</Button>
        </Box>
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
        <Dialog open={openEditor} onClose={() => setOpenEditor(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Upload & Edit Image</DialogTitle>
          <DialogContent>
            {!imageSrc ? (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setImageSrc(reader.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </Box>
            ) : (
              <ImageEditor
                src={imageSrc}
                onCancel={() => { setImageSrc(null); setOpenEditor(false); }}
                onComplete={(dataUrl) => {
                  // insert image into editor
                  try {
                    const editor = editorRef.current;
                    if (editor) {
                      editor.model.change(writer => {
                        const imageElement = editor.model.createElement('image', {
                          src: dataUrl
                        });
                        editor.model.insertContent(imageElement, editor.model.document.selection);
                      });
                    }
                  } catch (e) {
                    console.error('Failed to insert image into editor', e);
                  }
                  setImageSrc(null);
                  setOpenEditor(false);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Paper>
  );
};

BlogEditor.propTypes = {
  initialData: PropTypes.string,
  onChange: PropTypes.func,
};

export default BlogEditor;
