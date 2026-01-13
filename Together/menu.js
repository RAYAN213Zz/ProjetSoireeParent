document.addEventListener('DOMContentLoaded', function() {
    const menuNiveaux = document.getElementById('menu-niveaux');
    const totalNiveaux = 10;  // Nombre total de niveaux
    let niveauDebloque = parseInt(localStorage.getItem('niveauDebloque')) || 1;
  
    // Génère le menu des niveaux
    for (let i = 1; i <= totalNiveaux; i++) {
      const listItem = document.createElement('li');
      
      if (i <= niveauDebloque) {
        // Si le niveau est débloqué, on crée un lien vers ce niveau
        listItem.innerHTML = `<a href="niveau${i}.html">Niveau ${i}</a>`;
      } else {
        // Sinon, on indique que le niveau est verrouillé
        listItem.textContent = `Niveau ${i} (Verrouillé)`;
      }
  
      menuNiveaux.appendChild(listItem);
    }
  });
  