(function() {
    const currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
    const unlockedLevel = parseInt(localStorage.getItem('niveauDebloque')) || 1;

    function checkUnlockedLevel(requiredLevel, redirectUrl) {
        if (unlockedLevel < requiredLevel) {
            alert("Ce niveau n'est pas encore débloqué !");
            window.location.href = redirectUrl;
        }
    }

    window.checkUnlockedLevel = checkUnlockedLevel; // Expose the function globally
})();
