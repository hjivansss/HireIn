import { useState, useEffect, useRef } from 'react'
import { Upload, FileText, FolderArchive, CheckCircle, XCircle, X, Briefcase, Calendar, Layers, ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '../components/navbar'
import Footer from '../components/Footer'
import { uploadResume } from '../api/resume_api'
import { uploadLinkedinZip } from '../api/linkedin_api'
import { getCandidateJDs } from '../api/jd_api'

/* ─── Resume Upload Card ─────────────────────────────────── */
const ResumeUploadCard = () => {
  const [file, setFile] = useState(null)      // single file only
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [uploaded, setUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()

  const validate = (f) => {
    if (!['.pdf', '.doc', '.docx'].some(ext => f.name.toLowerCase().endsWith(ext))) {
      setError(`Unsupported: ${f.name}`)
      return false
    }
    setError('')
    return true
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (uploading) return
    const f = e.dataTransfer.files[0]
    if (f && validate(f)) { setUploaded(false); setFile(f) }
  }

  const handleChange = (e) => {
    if (uploading) return
    const f = e.target.files[0]
    if (f && validate(f)) { setUploaded(false); setFile(f) }
    e.target.value = ''
  }

  const handleUpload = async () => {
    if (!file || uploading) return
    setUploading(true)
    setUploaded(false)
    setError('')
    try {
      await uploadResume(file)
      setUploaded(true)
      setFile(null)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => { setFile(null); setError(''); setUploaded(false) }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Resume Upload</h2>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => { if (!uploading) inputRef.current.click() }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 text-center transition-all duration-200
          ${dragging ? 'border-brand bg-brand/5' : 'border-slate-200 bg-slate-50 hover:border-brand hover:bg-brand/5'}`}
      >
        <Upload className={`h-6 w-6 transition-colors duration-200 ${dragging ? 'text-brand' : 'text-slate-400'}`} />
        <p className="text-sm text-slate-600">Drag & drop or <span className="font-medium text-brand">browse</span></p>
        <p className="text-xs text-slate-400">.pdf · .doc · .docx</p>
        <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleChange} disabled={uploading} />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
          <XCircle className="h-4 w-4 shrink-0 text-red-500" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Selected file */}
      {file && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-3.5 w-3.5 shrink-0 text-brand" />
            <span className="truncate text-sm text-slate-700">{file.name}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleClear() }} disabled={uploading}
            className="ml-2 text-slate-400 hover:text-red-500 disabled:opacity-40">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Loading */}
      {uploading && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-xs text-blue-700">Uploading resume... Please wait.</p>
        </div>
      )}

      {/* Success */}
      {uploaded && !uploading && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-xs text-emerald-700">Uploaded successfully! You can upload another.</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <button onClick={handleUpload} disabled={!file || uploading}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed">
          {uploading
            ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Uploading...</>
            : <><Upload className="h-4 w-4" /> Upload</>}
        </button>
        <button onClick={handleClear} disabled={uploading}
          className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
          Clear
        </button>
      </div>
    </div>
  )
}

/* ─── LinkedIn ZIP Upload Card ───────────────────────────── */
const LinkedInUploadCard = () => {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [uploaded, setUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()

  const validate = (f) => {
    if (!f.name.toLowerCase().endsWith('.zip')) {
      setError(`"${f.name}" is not a ZIP.`)
      return false
    }
    setError('')
    return true
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (uploading) return
    const f = e.dataTransfer.files[0]
    if (f && validate(f)) { setUploaded(false); setFile(f) }
  }

  const handleChange = (e) => {
    if (uploading) return
    const f = e.target.files[0]
    if (f && validate(f)) { setUploaded(false); setFile(f) }
    e.target.value = ''
  }

  const handleUpload = async () => {
    if (!file || uploading) return
    setUploading(true)
    setUploaded(false)
    setError('')
    try {
      await uploadLinkedinZip(file)
      setUploaded(true)
      setFile(null)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => { setFile(null); setError(''); setUploaded(false) }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand">
          <FolderArchive className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">LinkedIn ZIP</h2>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => { if (!uploading) inputRef.current.click() }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 text-center transition-all duration-200
          ${dragging ? 'border-brand bg-brand/5' : 'border-slate-200 bg-slate-50 hover:border-brand hover:bg-brand/5'}`}
      >
        <FolderArchive className={`h-6 w-6 transition-colors duration-200 ${dragging ? 'text-brand' : 'text-slate-400'}`} />
        <p className="text-sm text-slate-600">Drag & drop or <span className="font-medium text-brand">browse</span></p>
        <p className="text-xs text-slate-400">.zip only</p>
        <input ref={inputRef} type="file" accept=".zip" className="hidden" onChange={handleChange} disabled={uploading} />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
          <XCircle className="h-4 w-4 shrink-0 text-red-500" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Selected file */}
      {file && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <FolderArchive className="h-4 w-4 shrink-0 text-brand" />
            <span className="truncate text-sm text-slate-700">{file.name}</span>
            <span className="shrink-0 text-xs text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleClear() }} disabled={uploading}
            className="ml-2 text-slate-400 hover:text-red-500 disabled:opacity-40">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Loading */}
      {uploading && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-xs text-blue-700">Importing LinkedIn ZIP... Please wait.</p>
        </div>
      )}

      {/* Success */}
      {uploaded && !uploading && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-xs text-emerald-700">Imported successfully!</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <button onClick={handleUpload} disabled={!file || uploading}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed">
          {uploading
            ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Importing...</>
            : <><Upload className="h-4 w-4" /> Import</>}
        </button>
        <button onClick={handleClear} disabled={uploading}
          className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
          Clear
        </button>
      </div>
    </div>
  )
}

const BrowseJobs = () => {
  const [jds, setJds] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCandidateJDs()
      .then(data => setJds(data))
      .catch(() => setJds([]))
      .finally(() => setLoading(false))
  }, [])

  const displayed = showAll ? jds : jds.slice(0, 3)

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-5 w-40 rounded bg-slate-100 mb-3" />
          <div className="h-4 w-full rounded bg-slate-100 mb-2" />
          <div className="h-4 w-3/4 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )

  if (!jds.length) return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <Briefcase className="mx-auto h-10 w-10 text-slate-200 mb-3" />
      <p className="font-medium text-slate-500">No open positions yet</p>
      <p className="mt-1 text-sm text-slate-400">Check back soon</p>
    </div>
  )

  return (
    <div className="space-y-4">
      {displayed.map((jd, i) => (
        <div key={i}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-brand/30">

          {/* Role title */}
          <h3 className="text-lg font-bold text-slate-900">{jd.job_role || 'Open Position'}</h3>

          {/* Meta info */}
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {jd.employment_type && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" /> {jd.employment_type}
              </span>
            )}
            {jd.experience_required && (
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> {jd.experience_required}
              </span>
            )}
            {jd.location && <span>📍 {jd.location}</span>}
            {jd.created_at && (
              <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(jd.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Skills badges */}
          {(jd.required_skills || []).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {jd.required_skills.map((s, j) => (
                <span key={j} className="rounded-full bg-brand/10 px-3 py-0.5 text-xs font-medium text-brand">
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Full original JD text */}
          {jd.original_text && (
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              {jd.original_text}
            </p>
          )}

          {/* Key responsibilities */}
          {(jd.key_responsibilities || []).length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {jd.key_responsibilities.map((r, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Show more / less button */}
      {jds.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600 transition-all hover:border-brand hover:text-brand"
        >
          {showAll
            ? <><ChevronUp className="h-4 w-4" /> Show Less</>
            : <><ChevronDown className="h-4 w-4" /> Show All {jds.length} Positions</>}
        </button>
      )}
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────── */
const Candidate = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
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
          <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr]">
            <ResumeUploadCard />

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
        {/* Open Positions */}
<section className="mx-auto max-w-7xl px-6 pb-16">
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-slate-900">Available Jobs</h2>
    <p className="mt-1 text-sm text-slate-500">
      Browse available roles and upload your resume above to apply.
    </p>
  </div>
  <BrowseJobs />
</section>
      </main>
      <Footer />
    </>
  )
}
export default Candidate