# Maintenance

## Routine Tasks
- Update `assets/data/courses.json` with new courses
- Replace Picsum URLs with curated images and update `srcset`
- Review accessibility with WAVE on key pages
- Re-run PageSpeed after changes; fix regressions

## SW Cache Updates
- When assets change, update `assets/js/sw.js` cache name and re-deploy

## Content Updates
- Blog posts: maintain meta description and canonical
- Add to `sitemap.xml` when new pages/posts are added

## Troubleshooting
- Header/footer not loading: check path `/components/...` and hosting base URL
- Courses empty: ensure `assets/data/courses.json` exists and valid JSON
- Hero backgrounds not loading: confirm `data-bg` URLs and HTTPS
- Service worker not registering: confirm HTTPS and file path `/assets/js/sw.js`

## Video Embeds
- Use YouTube embed URLs in the form `https://www.youtube-nocookie.com/embed/<id>?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=<origin>`
- Ensure iframes include `loading="lazy"`, `referrerpolicy="strict-origin-when-cross-origin"`, `allowfullscreen`, and `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`
- Include `assets/js/main.js` on pages with video content to normalize embeds and handle errors
- Avoid overlay elements that block clicks; overlays should not intercept pointer events
