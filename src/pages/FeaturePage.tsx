import type { LucideIcon } from 'lucide-react'

type FeaturePageProps = {
  title: string
  description: string
  icon: LucideIcon
}

export function FeaturePage({ title, description, icon: Icon }: FeaturePageProps) {
  return (
    <div className="screen feature-screen">
      <header className="feature-header">
        <strong className="wordmark">Beacon</strong>
      </header>
      <section className="feature-empty" aria-labelledby="feature-title">
        <span className="feature-icon" aria-hidden="true"><Icon size={28} /></span>
        <small>NOT CONNECTED YET</small>
        <h1 id="feature-title">{title}</h1>
        <p>{description}</p>
      </section>
    </div>
  )
}
