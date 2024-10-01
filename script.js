// Variables globales
let expertMode = false; // Variable pour suivre l'état du mode Expert

// Fonction de démarrage d'une nouvelle partie complète (nouvelle cible et nouveaux nombres)
function startNewGame() {
    cible = getRandomInt(10, 50);
    nombres = generateNumbers();
    initialNombres = [...nombres];
    selectedNumbers = [];
    selectedOperator = "";
    operationsHistory = [];
    solutions = [];
    historyStack = [];
    usedOperators = new Set();
    saveState(); // Sauvegarde l'état initial
    updateDisplay();
    updateHistory();
    updateSolutions();
}

// Gestion du bouton "Mode Expert"
const expertModeButton = document.getElementById('expert-mode-button');
expertModeButton.addEventListener('click', () => {
    expertMode = !expertMode;
    expertModeButton.textContent = expertMode ? "Désactiver le Mode Expert" : "Activer le Mode Expert";
    startNewGame(); // Redémarrer une nouvelle partie pour appliquer les nouvelles règles
});

// Modification de la génération des nombres en fonction du mode Expert
function generateNumbers() {
    if (expertMode) {
        return [
            getRandomInt(-20, 50), // Nombres plus grands et négatifs
            getRandomInt(-20, 50),
            getRandomInt(-20, 50),
            getRandomInt(-20, 50),
            getRandomInt(-20, 50)
        ];
    } else {
        return [
            getRandomInt(1, 4),
            getRandomInt(1, 6),
            getRandomInt(1, 8),
            getRandomInt(1, 12),
            getRandomInt(1, 20)
        ];
    }
}

// Définition des opérations disponibles avec de nouvelles opérations pour le mode Expert
const operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => (b !== 0 && a % b === 0) ? a / b : null,
    "^": (a, b) => Math.pow(a, b), // Exponentiation
    "%": (a, b) => a % b // Modulo
};

// Points associés à chaque opérateur
const operatorPoints = {
    "+": 1,
    "-": 2,
    "*": 3,
    "/": 5,
    "^": 8,
    "%": 6
};

// Gérer l'affichage et l'activation des boutons d'opérateurs en fonction du mode Expert
function updateDisplay() {
    cibleElement.textContent = cible;

    hexNumbers.forEach((element, index) => {
        if (index < nombres.length) {
            element.textContent = nombres[index];
            element.style.pointerEvents = 'auto';
            element.onclick = () => selectNumber(index);
            element.classList.remove('selected');
        } else {
            element.textContent = "";
            element.style.pointerEvents = 'none';
            element.onclick = null;
            element.classList.remove('selected');
        }
    });

    selectedNum1.textContent = selectedNumbers.length > 0 ? nombres[selectedNumbers[0]] : "?";
    selectedNum2.textContent = selectedNumbers.length > 1 ? nombres[selectedNumbers[1]] : "?";
    selectedOp.textContent = selectedOperator !== "" ? selectedOperator : "?";

    opButtons.forEach(button => {
        const op = button.getAttribute('data-op');
        button.style.display = (expertMode || ["+", "-", "*", "/"].includes(op)) ? 'inline-block' : 'none';
    });
}

// Initialiser le jeu avec une nouvelle partie
startNewGame();
