import { createInertiaApp } from '@inertiajs/react'
import { InertiaProgress } from '@inertiajs/progress';
import { createRoot } from 'react-dom/client'
import '../css/app.css'

InertiaProgress.init();

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})