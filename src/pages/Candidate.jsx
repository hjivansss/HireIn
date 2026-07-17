import { useState, useRef } from 'react'
import { Upload, FileText, FolderArchive, CheckCircle, XCircle, X } from 'lucide-react'
import Navbar from '../components/navbar'
import Footer from '../components/Footer'

const ResumeUploadCard = () => {
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [uploaded, setUploaded] = useState(false)
  const inputRef = useRef()

  const validate = (fileList) => {
    const arr = Array.from(fileList)
    const invalid = arr.filter(f => !['.pdf','.doc','.docx'].some(ext => f.name.toLowerCase().endsWith(ext)))
    if (invalid.length) { setError(`Unsupported: ${invalid.map(f => f.name).join(', ')}`); return [] }
    setError(''); return arr
  }

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); const v = validate(e.dataTransfer.files); if (v.length) setFiles(p => [...p, ...v]) }
  const handleChange = (e) => { const v = validate(e.target.files); if (v.length) setFiles(p => [...p, ...v]); e.target.value = '' }
  const handleUpload = () => { if (!files.length) return; setUploaded(true); setTimeout(() => setUploaded(false), 3000) }
  const handleClear = () => { setFiles([]); setError(''); setUploaded(false) }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Resume Upload</h2>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 text-center transition-all duration-200
          ${dragging ? 'border-brand bg-brand/5' : 'border-slate-200 bg-slate-50 hover:border-brand hover:bg-brand/5'}`}
      >
        <Upload className={`h-6 w-6 transition-colors duration-200 ${dragging ? 'text-brand' : 'text-slate-400'}`} />
        <p className="text-sm text-slate-600">Drag & drop or <span className="font-medium text-brand">browse</span></p>
        <p className="text-xs text-slate-400">.pdf · .doc · .docx</p>
        <input ref={inputRef} type="file" multiple accept=".pdf,.doc,.docx" className="hidden" onChange={handleChange} />
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
          <XCircle className="h-4 w-4 text-red-500" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5 max-h-32 overflow-y-auto">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-3.5 w-3.5 shrink-0 text-brand" />
                <span className="truncate text-slate-700">{f.name}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setFiles(p => p.filter((_,j) => j !== i)) }} className="ml-2 text-slate-400 hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {uploaded && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <p className="text-xs text-emerald-700">Uploaded successfully!</p>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button onClick={handleUpload} disabled={!files.length}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed">
          <Upload className="h-4 w-4" /> Upload
        </button>
        <button onClick={handleClear}
          className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50">
          Clear
        </button>
      </div>
    </div>
  )
}

const LinkedInUploadCard = () => {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [uploaded, setUploaded] = useState(false)
  const inputRef = useRef()

  const validate = (f) => { if (!f.name.toLowerCase().endsWith('.zip')) { setError(`"${f.name}" is not a ZIP.`); return false } setError(''); return true }
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f && validate(f)) setFile(f) }
  const handleChange = (e) => { const f = e.target.files[0]; if (f && validate(f)) setFile(f); e.target.value = '' }
  const handleUpload = () => { if (!file) return; setUploaded(true); setTimeout(() => setUploaded(false), 3000) }
  const handleClear = () => { setFile(null); setError(''); setUploaded(false) }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand">
          <FolderArchive className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">LinkedIn ZIP</h2>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 text-center transition-all duration-200
          ${dragging ? 'border-brand bg-brand/5' : 'border-slate-200 bg-slate-50 hover:border-brand hover:bg-brand/5'}`}
      >
        <FolderArchive className={`h-6 w-6 transition-colors duration-200 ${dragging ? 'text-brand' : 'text-slate-400'}`} />
        <p className="text-sm text-slate-600">Drag & drop or <span className="font-medium text-brand">browse</span></p>
        <p className="text-xs text-slate-400">.zip only</p>
        <input ref={inputRef} type="file" accept=".zip" className="hidden" onChange={handleChange} />
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
          <XCircle className="h-4 w-4 text-red-500" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {file && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <FolderArchive className="h-4 w-4 shrink-0 text-brand" />
            <span className="truncate text-sm text-slate-700">{file.name}</span>
          </div>
          <button onClick={handleClear} className="ml-2 text-slate-400 hover:text-red-500">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {uploaded && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <p className="text-xs text-emerald-700">Imported successfully!</p>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button onClick={handleUpload} disabled={!file}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed">
          <Upload className="h-4 w-4" /> Import
        </button>
        <button onClick={handleClear}
          className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50">
          Clear
        </button>
      </div>
    </div>
  )
}

const Candidate = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">

        {/* Header — same pattern as Landing hero text */}
        <section className="bg-white border-b border-slate-200 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              For <span className="text-brand">Candidates</span>
            </h1>
            <p className="mt-3 text-slate-600 sm:text-lg">
              Upload your resume or LinkedIn export to join the talent pool.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">

          {/* Upload Cards — same grid as Landing 3-step cards */}
          <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr]">
            <ResumeUploadCard />

            {/* OR divider */}
            <div className="flex items-center justify-center py-2 md:flex-col md:py-0">
              <div className="h-px w-12 bg-slate-200 md:h-24 md:w-px" />
              <span className="mx-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-400 shadow-sm md:mx-0 md:my-3">
                OR
              </span>
              <div className="h-px w-12 bg-slate-200 md:h-24 md:w-px" />
            </div>

            <LinkedInUploadCard />
          </div>


        </section>
      </main>
      <Footer />
    </>
  )
}

export default Candidate
