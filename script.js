// Définition des opérations mathématiques disponibles
const operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => (b !== 0 && a % b === 0) ? a / b : null // Division entière seulement
};

// Points associés à chaque opérateur
const operatorPoints = {
    "+": 1,
    "-": 2,
    "*": 3,
    "/": 5
};

// Variables globales
let nombres = [];
let initialNombres = [];
let cible = 0;
let selectedNumbers = [];
let selectedOperator = "";
let operationsHistory = [];
let solutions = [];
let historyStack = [];
let usedOperators = new Set();

// Initialisation des éléments DOM
const cibleElement = document.getElementById('cible');
const hexNumbers = Array.from(document.getElementsByClassName('hex-number'));
const selectedNum1 = document.getElementById('selected-num1');
const selectedNum2 = document.getElementById('selected-num2');
const selectedOp = document.getElementById('selected-op');
const calculateButton = document.getElementById('calculate-button');
const newGameButton = document.getElementById('new-game-button');
const nextStudentButton = document.getElementById('next-student-button');
const undoButton = document.getElementById('undo-button');
const magicButton = document.getElementById('magic-button');
const historyElement = document.getElementById('history');
const solutionsBody = document.getElementById('solutions-body');

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

// Fonction de démarrage pour un nouvel élève (même cible, mêmes solutions, nouveaux nombres)
function nextStudent() {
    nombres = [...initialNombres];
    selectedNumbers = [];
    selectedOperator = "";
    operationsHistory = [];
    historyStack = [];
    usedOperators = new Set();
    saveState(); // Sauvegarde l'état initial pour le nouvel élève
    updateDisplay();
    updateHistory();
    // Les solutions restent affichées
}

// Fonction pour générer un ensemble de 5 nombres aléatoires
function generateNumbers() {
    return [
        getRandomInt(1, 4),
        getRandomInt(1, 6),
        getRandomInt(1, 8),
        getRandomInt(1, 12),
        getRandomInt(1, 20)
    ];
}

// Fonction pour générer un entier aléatoire entre min et max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sauvegarde l'état actuel du jeu dans l'historique
function saveState() {
    const state = {
        nombres: [...nombres],
        selectedNumbers: [...selectedNumbers],
        selectedOperator,
        operationsHistory: [...operationsHistory],
        usedOperators: new Set(usedOperators)
    };
    historyStack.push(state);
}

// Met à jour l'affichage des nombres, de la cible et des sélections
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

    // Réinitialise les sélections visuelles
    hexNumbers.forEach(element => element.classList.remove('selected'));

    // Met à jour l'affichage des sélections en fonction des valeurs actuelles
    if (selectedNumbers.length > 0) {
        const index1 = selectedNumbers[0];
        selectedNum1.textContent = nombres[index1];
        hexNumbers[index1].classList.add('selected');
    } else {
        selectedNum1.textContent = "?";
    }

    if (selectedNumbers.length > 1) {
        const index2 = selectedNumbers[1];
        selectedNum2.textContent = nombres[index2];
        hexNumbers[index2].classList.add('selected');
    } else {
        selectedNum2.textContent = "?";
    }

    selectedOp.textContent = selectedOperator !== "" ? selectedOperator : "?";

    // Mettre à jour la classe 'selected-op' pour l'opérateur sélectionné
    opButtons.forEach(button => {
        if (button.getAttribute('data-op') === selectedOperator) {
            button.classList.add('selected-op');
        } else {
            button.classList.remove('selected-op');
        }
    });
}

// Sélectionne ou désélectionne un nombre lorsqu'on clique dessus
function selectNumber(index) {
    const selectedIndex = selectedNumbers.indexOf(index);
    if (selectedIndex !== -1) {
        // Si le nombre est déjà sélectionné, on le désélectionne
        selectedNumbers.splice(selectedIndex, 1);
    } else if (selectedNumbers.length < 2) {
        // Si moins de deux nombres sont sélectionnés, on ajoute le nombre
        selectedNumbers.push(index);
    } else {
        // Remplacer le premier nombre sélectionné par le nouveau
        selectedNumbers[0] = selectedNumbers[1];
        selectedNumbers[1] = index;
    }
    updateDisplay(); // Met à jour l'affichage après la sélection ou désélection
}

// Sélectionne ou désélectionne un opérateur lorsqu'on clique dessus
const opButtons = Array.from(document.getElementsByClassName('op-button'));
opButtons.forEach(button => {
    button.addEventListener('click', () => {
        const op = button.getAttribute('data-op');
        if (selectedOperator === op) {
            // Si l'opérateur est déjà sélectionné, on le désélectionne
            selectedOperator = "";
        } else {
            selectedOperator = op;
        }
        updateDisplay();
    });
});

// Gérer le clic sur le bouton "Calculer"
calculateButton.addEventListener('click', () => {
    if (selectedNumbers.length === 2 && selectedOperator !== "") {
        const index1 = selectedNumbers[0];
        const index2 = selectedNumbers[1];

        const nombre1 = nombres[index1];
        const nombre2 = nombres[index2];

        if (!operations[selectedOperator]) {
            alert("Veuillez sélectionner une opération valide.");
            return;
        }

        if (selectedOperator === "/" && (nombre2 === 0 || nombre1 % nombre2 !== 0)) {
            alert("Division impossible. Assurez-vous que le dividende est divisible par le diviseur sans reste.");
            return;
        }

        let resultatOperation = operations[selectedOperator](nombre1, nombre2);

        if (resultatOperation === null) {
            alert("Opération non valide.");
            return;
        }

        if (!Number.isInteger(resultatOperation)) {
            alert("Le résultat n'est pas un nombre entier.");
            return;
        }

        usedOperators.add(selectedOperator);

        const operationString = `${nombre1} ${selectedOperator} ${nombre2} = ${resultatOperation}`;
        operationsHistory.push(operationString);

        // Sauvegarde l'état actuel avant de modifier les nombres
        saveState();

        nombres[index1] = resultatOperation;
        nombres.splice(index2, 1);

        // Réinitialise les sélections
        selectedNumbers = [];
        selectedOperator = "";
        updateDisplay();
        updateHistory();

        if (nombres.includes(cible)) {
            const totalScore = calculateScore();
            solutions.push({ operation: operationsHistory.join(' ; '), score: totalScore });
            updateSolutions();
            alert(`Félicitations ! Vous avez atteint la cible ${cible} avec un score de ${totalScore} points.`);
        }
    } else {
        alert("Veuillez sélectionner deux nombres et un opérateur pour effectuer un calcul.");
    }
});

// Calcule le score total en fonction des opérateurs utilisés
function calculateScore() {
    let score = 0;
    operationsHistory.forEach(operation => {
        const opMatch = operation.match(/[\+\-\*\/]/);
        if (opMatch) {
            const op = opMatch[0];
            score += operatorPoints[op] || 0;
        }
    });

    if (usedOperators.size === 4) {
        score += 10; // Bonus de 10 points
    }

    return score;
}

// Met à jour l'affichage de l'historique des opérations
function updateHistory() {
    historyElement.innerHTML = '';
    operationsHistory.forEach(operation => {
        const div = document.createElement('div');
        div.textContent = operation;
        div.classList.add('operation-entry');
        historyElement.appendChild(div);
    });
}

// Met à jour l'affichage des solutions proposées
function updateSolutions() {
    solutionsBody.innerHTML = '';
    solutions.forEach(solution => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${solution.operation}</td>
            <td>${solution.score} pts</td>
        `;
        solutionsBody.appendChild(row);
    });
}

// Fonction pour annuler l'état précédent
function undoState() {
    if (historyStack.length > 1) {
        historyStack.pop();
        const previousState = historyStack[historyStack.length - 1];

        nombres = [...previousState.nombres];
        selectedNumbers = [...previousState.selectedNumbers];
        selectedOperator = previousState.selectedOperator;
        operationsHistory = [...previousState.operationsHistory];
        usedOperators = new Set(previousState.usedOperators);

        updateDisplay();
        updateHistory();
    } else {
        alert("Aucune action à annuler.");
    }
}

// Gérer le clic sur les boutons de contrôle
newGameButton.addEventListener('click', startNewGame);
nextStudentButton.addEventListener('click', nextStudent);
undoButton.addEventListener('click', undoState);

// Gérer le clic sur le bouton "Magique"
magicButton.addEventListener('click', findBestSolutions);

// Fonction pour trouver les meilleures solutions
function findBestSolutions() {
    const bestSolutions = getAllSolutions();
    if (bestSolutions.length > 0) {
        // Affiche les meilleures solutions dans les solutions proposées
        solutions = solutions.concat(bestSolutions);
        updateSolutions();
        alert(`Voici les solutions avec le score maximum de ${bestSolutions[0].score} points.`);
    } else {
        alert("Aucune solution trouvée pour atteindre la cible.");
    }
}

// Fonction pour générer toutes les solutions possibles
function getAllSolutions() {
    const initialNumbers = initialNombres;
    const target = cible;

    const results = [];
    const maxScore = { value: 0 };

    // Appel de la fonction récursive pour trouver les solutions
    const allSolutions = findSolutionsRecursive(initialNumbers, [], maxScore, new Set());

    // Filtrer les solutions qui atteignent la cible avec le score maximum
    const bestSolutions = allSolutions.filter(sol => sol.result === target && sol.score === maxScore.value);

    // Formater les solutions pour les afficher
    return bestSolutions.map(sol => {
        return {
            operation: sol.operations.join(' ; '),
            score: sol.score
        };
    });
}

// Fonction récursive pour trouver toutes les combinaisons possibles
function findSolutionsRecursive(numbers, operations, maxScore, usedOps) {
    const solutions = [];

    if (numbers.length === 1) {
        const result = numbers[0];
        const score = calculateOperationsScore(operations, usedOps);
        if (result === cible) {
            if (score > maxScore.value) {
                maxScore.value = score;
            }
            solutions.push({ result, operations: [...operations], score });
        }
        return solutions;
    }

    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            if (i !== j) {
                const a = numbers[i];
                const b = numbers[j];
                const remaining = numbers.filter((_, idx) => idx !== i && idx !== j);

                for (const op in operationsFunctions) {
                    const func = operationsFunctions[op];
                    let result = func(a, b);

                    if (result === null || !isFinite(result) || !Number.isInteger(result)) continue;

                    const newOperations = [...operations, `${a} ${op} ${b} = ${result}`];
                    const newNumbers = [result, ...remaining];

                    const newUsedOps = new Set(usedOps);
                    newUsedOps.add(op);
                    const score = calculateOperationsScore(newOperations, newUsedOps);

                    if (score + (remaining.length * 5) >= maxScore.value) {
                        const sols = findSolutionsRecursive(newNumbers, newOperations, maxScore, newUsedOps);
                        solutions.push(...sols);
                    }
                }
            }
        }
    }

    return solutions;
}

// Fonctions des opérations mathématiques (pour éviter les conflits avec les variables globales)
const operationsFunctions = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => (b !== 0 && a % b === 0) ? a / b : null
};

// Fonction pour calculer le score d'une suite d'opérations
function calculateOperationsScore(operations, usedOps) {
    let score = 0;

    operations.forEach(operation => {
        const opMatch = operation.match(/[\+\-\*\/]/);
        if (opMatch) {
            const op = opMatch[0];
            score += operatorPoints[op] || 0;
        }
    });

    if (usedOps.size === 4) {
        score += 10; // Bonus de 10 points
    }

    return score;
}

// Initialiser le jeu avec une nouvelle partie
startNewGame();
// Variables pour le chronomètre
let timerInterval;
let timerDuration = 4 * 60; // 4 minutes en secondes
let currentTime = timerDuration;

// Sélection des éléments du DOM pour le chronomètre
const timerDisplay = document.getElementById('timer-display');
const startTimerButton = document.getElementById('start-timer-button');

// Fonction pour démarrer le chronomètre
function startTimer() {
    clearInterval(timerInterval); // Réinitialiser le chronomètre si déjà en cours
    currentTime = timerDuration; // Réinitialiser le temps à 4 minutes
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        if (currentTime <= 0) {
            clearInterval(timerInterval);
            alert("Le temps est écoulé !");
        }
    }, 1000); // Décrémente chaque seconde
}

// Fonction pour mettre à jour l'affichage du chronomètre
function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Ajoute un événement pour le bouton de démarrage du chronomètre
startTimerButton.addEventListener('click', startTimer);
// Variable pour suivre l'état d'affichage des solutions
let solutionsVisible = true;

// Mettre à jour la fonction "findBestSolutions"
function findBestSolutions() {
    // Bascule l'affichage des solutions
    solutionsVisible = !solutionsVisible;
    const solutionsContainer = document.querySelector('.solutions-container');

    if (solutionsVisible) {
        const bestSolutions = getAllSolutions();
        if (bestSolutions.length > 0) {
            // Affiche les meilleures solutions dans les solutions proposées
            solutions = solutions.concat(bestSolutions);
            updateSolutions();
            solutionsContainer.style.display = 'block'; // Affiche les solutions
            alert(`Voici les solutions avec le score maximum de ${bestSolutions[0].score} points.`);
        } else {
            alert("Aucune solution trouvée pour atteindre la cible.");
        }
    } else {
        // Cache les solutions
        solutionsContainer.style.display = 'none';
    }
}
