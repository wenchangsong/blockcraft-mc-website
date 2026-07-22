import { useRef, useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react'
import api from '../api/axios.js'

const RichTextEditor = forwardRef(function RichTextEditor({ initialValue = '' }, ref) {
  const editorRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    heading: null,
    color: null,
  })

  useImperativeHandle(ref, () => ({
    getHTML: () => editorRef.current?.innerHTML || '',
    getText: () => editorRef.current?.innerText || '',
    setHTML: (html) => { if (editorRef.current) editorRef.current.innerHTML = html },
  }))

  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = initialValue
    }
  }, [])

  const refreshState = useCallback(() => {
    setActive({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      heading: document.queryCommandValue('formatBlock'),
      color: document.queryCommandValue('foreColor'),
    })
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', refreshState)
    return () => document.removeEventListener('selectionchange', refreshState)
  }, [refreshState])

  const exec = (command, value) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    refreshState()
  }

  const handleImageUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files[0]
      if (!file) return
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('image', file)
        const res = await api.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        exec('insertImage', res.data.data.url)
      } catch {
        alert('Image upload failed')
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }

  const btnClass = (name) => `rte-btn${active[name] ? ' active' : ''}`

  return (
    <div className="rte-container">
      <div className="rte-toolbar">
        <button type="button" className={btnClass('bold')} onClick={() => exec('bold')} title="Bold"><b>B</b></button>
        <button type="button" className={btnClass('italic')} onClick={() => exec('italic')} title="Italic"><i>I</i></button>
        <button type="button" className={btnClass('underline')} onClick={() => exec('underline')} title="Underline"><u>U</u></button>
        <button type="button" className={btnClass('strikeThrough')} onClick={() => exec('strikeThrough')} title="Strikethrough"><s>S</s></button>
        <span className="rte-sep" />
        <button type="button" className={`rte-btn${active.heading === 'h2' ? ' active' : ''}`} onClick={() => exec('formatBlock', '<h2>')} title="Heading">H2</button>
        <button type="button" className={`rte-btn${active.heading === 'h3' ? ' active' : ''}`} onClick={() => exec('formatBlock', '<h3>')} title="Subheading">H3</button>
        <button type="button" className={`rte-btn${active.heading === 'p' || !active.heading ? ' active' : ''}`} onClick={() => exec('formatBlock', '<p>')} title="Paragraph">P</button>
        <span className="rte-sep" />
        <button type="button" className="rte-btn" onClick={() => exec('fontSize', '4')} title="Large text">A+</button>
        <button type="button" className="rte-btn" onClick={() => exec('fontSize', '3')} title="Normal text">A</button>
        <button type="button" className="rte-btn" onClick={() => exec('fontSize', '2')} title="Small text">A-</button>
        <span className="rte-sep" />
        <button type="button" className={`rte-btn${active.color === '#ffd700' ? ' active' : ''}`} onClick={() => exec('foreColor', '#ffd700')} title="Gold" style={{ color: '#ffd700' }}>T</button>
        <button type="button" className={`rte-btn${active.color === '#44b544' ? ' active' : ''}`} onClick={() => exec('foreColor', '#44b544')} title="Green" style={{ color: '#44b544' }}>T</button>
        <button type="button" className={`rte-btn${active.color === '#3ab3da' ? ' active' : ''}`} onClick={() => exec('foreColor', '#3ab3da')} title="Blue" style={{ color: '#3ab3da' }}>T</button>
        <button type="button" className={`rte-btn${active.color === '#ff5555' ? ' active' : ''}`} onClick={() => exec('foreColor', '#ff5555')} title="Red" style={{ color: '#ff5555' }}>T</button>
        <button type="button" className={`rte-btn${active.color === '#c0c0c0' ? ' active' : ''}`} onClick={() => exec('foreColor', '#c0c0c0')} title="Silver" style={{ color: '#c0c0c0' }}>T</button>
        <span className="rte-sep" />
        <button type="button" className="rte-btn" onClick={handleImageUpload} disabled={uploading} title="Insert Image">
          {uploading ? '...' : '🖼'}
        </button>
      </div>
      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Write your article here..."
      />
    </div>
  )
})

export default RichTextEditor
