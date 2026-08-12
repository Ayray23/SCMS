import { useForm } from 'react-hook-form'

export default function AuthForm({ children, onSubmit, buttonLabel }) {
  const { handleSubmit } = useForm()
  return (
    <form className="space-y-5 rounded-3xl bg-slate-950/80 border border-slate-800 p-8 shadow-2xl shadow-slate-950/40" onSubmit={handleSubmit(onSubmit)}>
      {children}
      <button type="submit" className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500">
        {buttonLabel}
      </button>
    </form>
  )
}
