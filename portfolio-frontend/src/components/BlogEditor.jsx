import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Paper, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
  const theme = useTheme();
  const toolbarHoverBg = theme.palette.action && theme.palette.action.hover ? theme.palette.action.hover : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)');

  // Re-apply theme colors to the CKEditor instance when the MUI theme changes.
  // CKEditor inserts its own DOM and sometimes applies inline styles at init,
  // so we must update the editor & toolbar programmatically when theme updates.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    try {
      const root = editor.editing.view.document.getRoot();
      editor.editing.view.change((writer) => {
        writer.setStyle('background-color', theme.palette.background.paper, root);
        writer.setStyle('color', theme.palette.text.primary, root);
        writer.setStyle('caret-color', theme.palette.text.primary, root);
      });

      // Toolbar styling: available via the editor UI view
      const toolbarEl = editor.ui && editor.ui.view && editor.ui.view.toolbar && editor.ui.view.toolbar.element;
      if (toolbarEl) {
        toolbarEl.style.backgroundColor = theme.palette.background.default;
        toolbarEl.style.color = theme.palette.text.primary;
        // borderColor may not exist on palette; fallback to divider or a sensible shade
        toolbarEl.style.borderColor = theme.palette.divider || (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : '#e0e0e0');
      }

      // Apply styles directly to the editable DOM element as a fallback. Some CKEditor builds
      // inject inline styles or render through a shadowed view where view-writer styles do not
      // immediately reflect. Using the editable DOM node ensures colors/caret/background update.
      try {
        const editableEl = (editor.ui && typeof editor.ui.getEditableElement === 'function')
          ? editor.ui.getEditableElement()
          : null;

        if (editableEl) {
          editableEl.style.backgroundColor = theme.palette.background.paper;
          editableEl.style.color = theme.palette.text.primary;
          editableEl.style.caretColor = theme.palette.text.primary;
          // ensure headings/paragraphs inherit color
          editableEl.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach((n) => {
            n.style.color = theme.palette.text.primary;
          });
        } else {
          // Best-effort fallback: search for .ck-content inside the page
          document.querySelectorAll('.ck-content').forEach((el) => {
            el.style.backgroundColor = theme.palette.background.paper;
            el.style.color = theme.palette.text.primary;
            el.style.caretColor = theme.palette.text.primary;
          });
        }
      } catch (domErr) {
        // non-fatal
      }

      // Update any dropdown panels that CKEditor may render elsewhere in the DOM
      document.querySelectorAll('.ck-dropdown__panel').forEach((panel) => {
        panel.style.backgroundColor = theme.palette.background.paper;
        panel.style.color = theme.palette.text.primary;
      });
    } catch (e) {
      // non-fatal: if CKEditor internals change, ignore the failure
      // console.warn('Failed to reapply editor theme styles', e);
    }
  }, [theme.palette.mode, theme.palette.background.paper, theme.palette.background.default, theme.palette.text.primary, theme.palette.divider]);

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        // target CKEditor classes to make the editable area and toolbar follow MUI theme
        '& .ck-editor__editable_inline, & .ck-content': {
          backgroundColor: 'background.paper',
          color: 'text.primary',
          minHeight: editorHeight,
          caretColor: theme.palette.text.primary,
          // ensure paragraphs inherit color
          '& p': { color: 'text.primary' },
          '& h1, & h2, & h3, & h4, & h5, & h6': { color: 'text.primary' },
          '& a': { color: 'primary.main' },
        },
            '& .ck.ck-toolbar': {
              backgroundColor: 'background.default',
              borderColor: 'divider',
              color: 'text.primary',
            },
            // toolbar buttons/icons — improve hover/active contrast using theme.action.hover
            '& .ck.ck-toolbar .ck-button': {
              color: 'text.primary',
              backgroundColor: 'transparent',
              borderRadius: 1,
              transition: 'background-color 150ms ease',
            },
            // heading dropdown button (the toolbar button that opens heading options)
            '& .ck.ck-toolbar .ck-heading-dropdown .ck-button, & .ck.ck-toolbar .ck-dropdown__button': {
              color: 'text.primary',
            },
            // style the dropdown list items (heading options)
            '& .ck-dropdown__panel .ck-list__item': {
              backgroundColor: 'background.paper',
              color: 'text.primary',
            },
            '& .ck-dropdown__panel .ck-list__item:hover, & .ck-dropdown__panel .ck-list__item:focus': {
              backgroundColor: toolbarHoverBg,
              color: 'text.primary',
            },
            '& .ck.ck-button:hover, & .ck.ck-button:focus, & .ck.ck-button.ck-on': {
              backgroundColor: toolbarHoverBg,
              color: 'text.primary',
            },
            // ensure SVG icons inherit current color for proper contrast
            '& .ck.ck-button svg, & .ck.ck-toolbar svg': {
              fill: 'currentColor',
            },
            '& .ck.ck-button[disabled]': {
              opacity: 0.5,
            },
        // panel/tooltip styling
        '& .ck-dropdown__panel': {
          backgroundColor: 'background.paper',
          color: 'text.primary'
        }
      }}
    >
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
