// Recover a retired worker on a missing tool URL without redirecting real 404s.
if (location.pathname.startsWith('/200/')) {
  import('/200/session.mjs?public=20261022').catch(() => {});
}
