<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="title" content="Ambient" />
    <meta name="description" content="The better way to browse." />
    <link rel="icon" type="image/x-icon" href="/public/assets/imgs/logo.png" />
    <title>Ambient</title>
    <!-- Critical CSS -->
    <link rel="stylesheet" href="assets/css/global.css" />
    <link rel="stylesheet" href="assets/css/theme/default.css" />
    <!-- Non-critical CSS -->
    <link rel="stylesheet" href="assets/css/rays.css" />
    <link rel="stylesheet" href="assets/css/nav.css" />
  </head>

  <body>
    <div class="container">
      <div class="raysContain">
        <div class="rays"></div>
      </div>
      <nav>
        <img src="assets/imgs/logo.png" alt="logo" />
        <div class="flex">
          <a href="/">Home</a>
          <a href="/g">Games</a>
          <a href="/a">Apps</a>
          <a href="/ai">AI</a>
        </div>
        <i data-lucide="settings"></i>
      </nav>

      <!-- PAGE CONTENT GOES HERE -->

    </div>
    <script src="assets/js/index.js"></script>
    <!-- UV Files -->
    <script src="/search/bundle.js"></script>
    <script src="/search/config.js"></script>
    <!-- DO NOT REMOVE -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
      lucide.createIcons();
    </script>
    <!-- DO NOT REMOVE -->
    <!-- IF PAGE IS USING UV APPLY SCRIPT BELOW -->
    <script>
      const form = document.getElementById('uv-form');
      const address = document.getElementById('searchbar');
      const searchEngine = document.getElementById('uv-search-engine');
      const error = document.getElementById('uv-error');
      const errorCode = document.getElementById('uv-error-code');
      const input = document.querySelector('input');

      // crypts class definition
      class crypts {
        static encode(str) {
          return encodeURIComponent(
            str
              .toString()
              .split('')
              .map((char, ind) => (ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char))
              .join('')
          );
        }

        static decode(str) {
          if (str.charAt(str.length - 1) === '/') {
            str = str.slice(0, -1);
          }
          return decodeURIComponent(
            str
              .split('')
              .map((char, ind) => (ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char))
              .join('')
          );
        }
      }

      function search(input) {
        input = input.trim();
        const searchTemplate = localStorage.getItem('engine') || 'https://google.com/search?q=%s';

        try {
          return new URL(input).toString();
        } catch (err) {
          try {
            const url = new URL(`http://${input}`);
            if (url.hostname.includes('.')) {
              return url.toString();
            }
            throw new Error('Invalid hostname');
          } catch (err) {
            return searchTemplate.replace('%s', encodeURIComponent(input));
          }
        }
      }
      if ('serviceWorker' in navigator) {
        var proxySetting = 'uv';
        let swConfig = {
          uv: { file: '/search/sw.js', config: __uv$config },
        };

        let { file: swFile, config: swConfigSettings } = swConfig[proxySetting];

        navigator.serviceWorker
          .register(swFile, { scope: swConfigSettings.prefix })
          .then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            form.addEventListener('submit', async (event) => {
              event.preventDefault();
              let encodedUrl = swConfigSettings.prefix + crypts.encode(search(address.value));
              sessionStorage.setItem('encodedUrl', encodedUrl);
              location.href = '/search';
            });
          })
          .catch((error) => {
            console.error('ServiceWorker registration failed:', error);
          });
      }
    </script>
    <!-- IF PAGE IS USING UV APPLY SCRIPT ABOVE -->
  </body>
</html>