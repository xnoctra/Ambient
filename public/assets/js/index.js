async function launch(val) {
  if (localStorage.getItem("proxy") === "rammerhead") {
    try {
      const encodedUrl = await RammerheadEncode(val);
      sessionStorage.setItem("encodedUrl", encodedUrl);

      const browseSetting = localStorage.getItem("browse");
      const browseUrls = {
        go: "/search",
        norm: encodedUrl,
      };
      const urlToNavigate = browseUrls[browseSetting] || "/search";
      location.href = urlToNavigate;
    } catch (error) {
      location.href = "/error";
    }
  } else {
    if ("serviceWorker" in navigator) {
      let proxySetting = localStorage.getItem("proxy") || "uv";
      let swConfig = {
        uv: { file: "/search/sw.js", config: __uv$config }
      };

      // Use the selected proxy setting or default to 'uv'
      let { file: swFile, config: swConfigSettings } = swConfig[proxySetting];

      navigator.serviceWorker
        .register(swFile, { scope: swConfigSettings.prefix })
        .then((registration) => {
          console.log("ServiceWorker registration successful with scope: ", registration.scope);
          let url = val.trim();
          if (typeof ifUrl === "function" && !ifUrl(url)) {
            url = search(url);
          } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
            url = "https://" + url;
          }
          try {
            let encodedUrl = swConfigSettings.prefix + crypts.encode(url);
            sessionStorage.setItem("encodedUrl", encodedUrl);
            const browseSetting = localStorage.getItem("browse");
            const browseUrls = {
              go: "/search",
              norm: encodedUrl,
            };
            const urlToNavigate = browseUrls[browseSetting] || "/search";
            location.href = urlToNavigate;
          } catch (error) {
            location.href = "/error";
          }
        })
        .catch((error) => {
          console.error("ServiceWorker registration failed:", error);
        });
    }
  }
}