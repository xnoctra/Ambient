(async () => {
  try {
    let response = await fetch('assets/js/json/apps.json');
    let apps = await response.json();
    const appsContain = document.getElementById('appsContain');

    apps.sort((a, b) => a.name.localeCompare(b.name));

    apps.forEach((app) => {
      const appDiv = document.createElement('div');
      appDiv.className = 'app';

      const img = document.createElement('img');
      img.src = app.img;

      const descDiv = document.createElement('div');
      descDiv.className = 'desc';

      const h2 = document.createElement('h2');
      h2.textContent = app.name;

      const p = document.createElement('p');
      p.className = 'description';
      p.textContent = app.desc;

      const button = document.createElement('button');
      button.textContent = 'Launch';
      button.onclick = () => {
        launch(app.link);
      };

      descDiv.appendChild(h2);
      descDiv.appendChild(p);
      appDiv.appendChild(img);
      appDiv.appendChild(descDiv);
      appDiv.appendChild(button);
      appsContain.appendChild(appDiv);
    });
  } catch (error) {
    console.error('Error fetching apps:', error);
  }
})();
