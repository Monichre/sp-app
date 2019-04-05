import React from "react"
import { Helmet } from "react-helmet"

export const AppMetaTags = () => (
  <Helmet>
    <html lang="en" />
    <body />
    // @ts-ignore
    <meta charset="utf-8" />
    <meta name="author" content="Soundpruf" />
    <link
      rel="shortcut icon"
      href={`http://${window.location.host}/blackLogoNoBg.png`}
    />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href={`http://${window.location.host}/manifest.json`} />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta
      name="description"
      content="Soundpruf is a new personalized dashboard for every serious music fan that connects directly to your favorite streaming platform account."
    />
    <title>
      Soundpruf. What music you listen to matters. Now you can prove it.
    </title>
    <meta
      property="description"
      content="Soundpruf is a new personalized dashboard for every serious music fan that connects directly to your favorite streaming platform account. Create, foster, and explore your unique listening record. Earn rewards when you stream emerging music. Fund the artists you believe in. Sign up today for early beta access!"
    />
    <meta property="image" content="https://www.app.soundpruf.com/logo-b.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="https://www.app.soundpruf.com" />
    <meta name="twitter:domain" content="https://www.app.soundpruf.com" />
    <meta name="twitter:title" content="Soundpruf Inc." />
    <meta
      name="twitter:description"
      content="Soundpruf is a new personalized dashboard for every serious music fan that connects directly to your favorite streaming platform account. Create, foster, and explore your unique listening record. Earn rewards when you stream emerging music. Fund the artists you believe in. Sign up today for early beta access!"
    />
    <meta name="twitter:creator" content="@soundpruf" />
    <meta
      name="twitter:image:src"
      content="https://www.app.soundpruf.com/logo-b.png"
    />
    <meta property="og:title" content="Soundpruf" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://www.app.soundpruf.com" />
    <meta
      property="og:image"
      content="https://www.app.soundpruf.com/logo-b.png"
    />
    <meta
      property="og:description"
      content="Soundpruf is a new personalized dashboard for every serious music fan that connects directly to your favorite streaming platform account. Create, foster, and explore your unique listening record. Earn rewards when you stream emerging music. Fund the artists you believe in. Sign up today for early beta access!"
    />
    <meta property="og:site_name" content="Soundpruf.com" />
    <meta
      property="article:tag"
      content="Soundpruf. What music you listen to matters. Now you can prove it."
    />
    <script>
      {`
      window["_fs_debug"] = false
      window["_fs_host"] = "fullstory.com"
      window["_fs_org"] = "JG1VY"
      window["_fs_namespace"] = "FS"
      ;(function(m, n, e, t, l, o, g, y) {
        if (e in m) {
          if (m.console && m.console.log) {
            m.console.log(
              'FullStory namespace conflict. Please set window["_fs_namespace"].'
            )
          }
          return
        }
        g = m[e] = function(a, b, s) {
          g.q ? g.q.push([a, b, s]) : g._api(a, b, s)
        }
        g.q = []
        o = n.createElement(t)
        o.async = 1
        o.src = "https://" + _fs_host + "/s/fs.js"
        y = n.getElementsByTagName(t)[0]
        y.parentNode.insertBefore(o, y)
        g.identify = function(i, v, s) {
          g(l, { uid: i }, s)
          if (v) g(l, v, s)
        }
        g.setUserVars = function(v, s) {
          g(l, v, s)
        }
        g.event = function(i, v, s) {
          g("event", { n: i, p: v }, s)
        }
        g.shutdown = function() {
          g("rec", !1)
        }
        g.restart = function() {
          g("rec", !0)
        }
        g.consent = function(a) {
          g("consent", !arguments.length || a)
        }
        g.identifyAccount = function(i, v) {
          o = "account"
          v = v || {}
          v.acctId = i
          g(o, v)
        }
        g.clearUserCookie = function() {}
      })(window, document, window["_fs_namespace"], "script", "user")`}
    </script>
    <script>
      {` ;(function(h, o, t, j, a, r) {
        h.hj =
          h.hj ||
          function() {
            ;(h.hj.q = h.hj.q || []).push(arguments)
          }
        h._hjSettings = { hjid: 1027795, hjsv: 6 }
        a = o.getElementsByTagName("head")[0]
        r = o.createElement("script")
        r.async = 1
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
        a.appendChild(r)
      })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=")`}
    </script>
  </Helmet>
)
