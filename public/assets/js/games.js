(async () => {
    try {
      let response = await fetch("assets/js/json/games.json");
      let games = await response.json();
      const gamesContain = document.getElementById("gamesContain");
  
      games.sort((a, b) => a.name.localeCompare(b.name));
  
      games.forEach((game) => {
        const gameDiv = document.createElement("div");
        gameDiv.className = "game";
  
        const img = document.createElement("img");
        img.src = game.img;
  
        const descDiv = document.createElement("div");
        descDiv.className = "desc";
  
        const h2 = document.createElement("h2");
        h2.textContent = game.name;
  
        const p = document.createElement("p");
        p.className = "description";
        p.textContent = game.desc;
  
        const button = document.createElement("button");
        button.textContent = "Launch";
        button.onclick = () => {
          launch(game.link);
        };
  
        descDiv.gameendChild(h2);
        descDiv.gameendChild(p);
        gameDiv.gameendChild(img);
        gameDiv.gameendChild(descDiv);
        gameDiv.gameendChild(button);
        gamesContain.gameendChild(gameDiv);
      });
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  })();
  
