(async () => {
  try {
    let response = await fetch('/assets/js/json/shortcuts.json');
    let shortcuts = await response.json();
    const shortcutsContain = document.getElementById('shortcutsContain');

    shortcuts.sort((a, b) => a.name.localeCompare(b.name));

    shortcuts.forEach((shortcut) => {
      const shortcutDiv = document.createElement('div');
      shortcutDiv.className = 'shortcut';
      shortcutDiv.onclick = () => {
        launch(shortcut.link);
      };

      const img = document.createElement('img');
      img.src = shortcut.img;
      img.alt = shortcut.name;
      img.title = shortcut.name;

      shortcutDiv.appendChild(img);
      shortcutsContain.appendChild(shortcutDiv);
    });
  } catch (error) {
    console.error('Error fetching shortcuts:', error);
  }
})();
