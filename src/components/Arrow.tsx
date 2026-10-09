export function Arrow({ external = false, className = '' }: { external?: boolean; className?: string }) {
  return <svg className={`arrow ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {external ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h16m-7-7 7 7-7 7" />}
  </svg>;
}
