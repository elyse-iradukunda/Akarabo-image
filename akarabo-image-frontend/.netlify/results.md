The frontend project and its Netlify configuration were inspected; no source files were changed.

Findings: the frontend is a Vite + React app using React Router (`react-router-dom`). Its build script (`tsc -b && vite build`) writes to `dist`, which matches the site's configured base directory (`akarabo-image-frontend`), build command (`npm run build`) and publish directory (`dist`). `public/_redirects` already exists and Vite copies everything in `public/` into `dist`, so the SPA rewrite (`/* /index.html 200`) is included in the published output. A root-level `netlify.toml` also sets the same base, publish directory and `/*` → `/index.html` rewrite. Because the base directory is `akarabo-image-frontend`, Netlify looks for `netlify.toml` there first, so the root file probably isn't used; the site settings and `_redirects` already cover what it does.

The current live deploy was created through the API in about 8 seconds and no framework was detected. That points to files uploaded without a real Vite build (for example the source folder rather than `dist`), which would leave no `index.html` at the site root and cause the "Page Not Found" error. This was not confirmed from the build logs, and the frontend API config was not checked for leftover `localhost` URLs.

Still to do:
- Trigger a fresh Git-based deploy of the `dev` branch from the Netlify dashboard (Deploys → Trigger deploy → Clear cache and deploy) so Netlify runs `npm run build` and publishes `dist`.
- In Site configuration → Environment variables, add `VITE_API_BASE_URL` and `VITE_CLIENT_PHOTOS_URL` with the production values. `VITE_PORT` only matters for local development. Don't commit `.env` files.
- After the deploy, open `/` and a few deep links directly in the browser and refresh them to confirm they load.
