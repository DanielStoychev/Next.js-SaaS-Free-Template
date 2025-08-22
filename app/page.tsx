export default function HomePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <div className='container flex max-w-[64rem] flex-col items-center gap-4 text-center'>
        <h1 className='text-4xl font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-6xl'>
          Welcome to{' '}
          <span className='bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent'>
            SaaS Template
          </span>
        </h1>
        <p className='max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8'>
          A modern, production-ready SaaS template built with Next.js 14,
          TypeScript, and Tailwind CSS. Ready for your next big idea.
        </p>
        <div className='flex gap-4'>
          <button className='inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'>
            Get Started
          </button>
          <button className='inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'>
            Learn More
          </button>
        </div>
      </div>
    </main>
  )
}
