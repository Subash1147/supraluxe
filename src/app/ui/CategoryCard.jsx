import { Link } from 'react-router-dom'

export function CategoryCard({ title, subtitle, to, image }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300"
    >
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      <div className="relative flex min-h-[180px] flex-col justify-end p-5 sm:min-h-[220px]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">{subtitle}</p>
        <p className="mt-1 font-display text-xl font-black tracking-tight text-black sm:text-2xl">
          {title}
        </p>
        <p className="mt-3 inline-flex w-fit items-center rounded-full bg-black text-white px-3 py-1 text-xs font-bold shadow transition hover:bg-slate-900">
          Shop now
        </p>
      </div>
    </Link>
  )
}

