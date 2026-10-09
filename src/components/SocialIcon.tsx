export function SocialIcon({ name }: { name: 'github' | 'linkedin' }) {
  return <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === 'github' ? <>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 0 0-1.5-3.78 5.07 5.07 0 0 0-.09-3.8s-1.18-.35-3.91 1.48a13.38 13.38 0 0 0-7 0C5.27.59 4.09.94 4.09.94A5.07 5.07 0 0 0 4 4.74a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22" />
    </> : <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10v7m4-7v7m0-4a3 3 0 0 1 6 0v4" />
      <circle cx="8" cy="7" r=".8" fill="currentColor" stroke="none" />
    </>}
  </svg>;
}
