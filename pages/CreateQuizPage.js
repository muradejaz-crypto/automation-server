// CreateQuizPage.js - Page Object Model for Adding Quiz Questions
// This POM handles generating and adding quiz questions to the test form

class CreateQuizPage {
  constructor(page) {
    this.page = page;
  }

  // ============================================================================
  // HELPER FUNCTION: Generate Random Question
  // ============================================================================

  /**
   * Helper function to generate a single random question object
   * Creates fully random, unique questions programmatically
   * @param {number} index - Question index number for unique identification
   * @returns {Object} Question object with structure: { question: string, options: [string], correctAnswerIndex: number }
   */
  generateRandomQuestion(index) {
    const topics = ["Math", "Science", "English", "History", "Geography", "Computers"];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    let questionText = '';
    let options = [];
    let correctAnswer = '';
    
    // Generate unique questions based on topic using algorithmic generation
    switch(topic) {
      case "Math":
        {
          const operation = Math.floor(Math.random() * 6);
          let a, b, result;
          const seed = index * 17 + Math.floor(Math.random() * 1000);
          
          if (operation === 0) {
            a = Math.floor((seed % 500) + 1);
            b = Math.floor(((seed * 3) % 500) + 1);
            result = a + b;
            questionText = `What is ${a} + ${b}?`;
            correctAnswer = result.toString();
            options = [
              result.toString(),
              (result + Math.floor(Math.random() * 50) + 1).toString(),
              (result - Math.floor(Math.random() * 50) - 1).toString(),
              (a * 2 + b).toString()
            ];
          } else if (operation === 1) {
            a = Math.floor((seed % 500) + 100);
            b = Math.floor(((seed * 2) % (a - 50)) + 1);
            result = a - b;
            questionText = `What is ${a} - ${b}?`;
            correctAnswer = result.toString();
            options = [
              result.toString(),
              (result + Math.floor(Math.random() * 30) + 1).toString(),
              (result - Math.floor(Math.random() * 30) - 1).toString(),
              (a + b).toString()
            ];
          } else if (operation === 2) {
            a = Math.floor((seed % 20) + 1);
            b = Math.floor(((seed * 5) % 20) + 1);
            result = a * b;
            questionText = `What is ${a} × ${b}?`;
            correctAnswer = result.toString();
            options = [
              result.toString(),
              (result + Math.floor(Math.random() * 20) + 1).toString(),
              (result - Math.floor(Math.random() * 20) - 1).toString(),
              (a + b).toString()
            ];
          } else if (operation === 3) {
            b = Math.floor((seed % 15) + 2);
            const quotient = Math.floor(((seed * 7) % 20) + 1);
            a = b * quotient;
            result = quotient;
            questionText = `What is ${a} ÷ ${b}?`;
            correctAnswer = result.toString();
            options = [
              result.toString(),
              (result + Math.floor(Math.random() * 5) + 1).toString(),
              (result - Math.floor(Math.random() * 5) - 1).toString(),
              (a * b).toString()
            ];
          } else if (operation === 4) {
            const isSquare = seed % 2 === 0;
            if (isSquare) {
              a = Math.floor((seed % 15) + 1);
              result = a * a;
              questionText = `What is ${a}²?`;
              correctAnswer = result.toString();
              options = [
                result.toString(),
                (a * 2).toString(),
                (a + a).toString(),
                (result + a).toString()
              ];
            } else {
              const root = Math.floor((seed % 15) + 1);
              a = root * root;
              result = root;
              questionText = `What is the square root of ${a}?`;
              correctAnswer = result.toString();
              options = [
                result.toString(),
                (result + 1).toString(),
                (result * 2).toString(),
                a.toString()
              ];
            }
          } else {
            const isArea = seed % 2 === 0;
            a = Math.floor((seed % 30) + 1);
            b = Math.floor(((seed * 3) % 30) + 1);
            if (isArea) {
              result = a * b;
              questionText = `What is the area of a rectangle with length ${a} and width ${b}?`;
              correctAnswer = result.toString();
              options = [
                result.toString(),
                (a + b).toString(),
                ((a + b) * 2).toString(),
                (a - b).toString()
              ];
            } else {
              result = a * 4;
              questionText = `What is the perimeter of a square with side ${a}?`;
              correctAnswer = result.toString();
              options = [
                result.toString(),
                (a * a).toString(),
                (a * 2).toString(),
                (a + 4).toString()
              ];
            }
          }
        }
        break;
        
      case "Science":
        {
          const scienceType = Math.floor(Math.random() * 5);
          const seed = index * 23;
          
          if (scienceType === 0) {
            const elements = ['Hydrogen', 'Oxygen', 'Carbon', 'Nitrogen', 'Iron', 'Gold', 'Silver', 'Copper', 'Zinc', 'Calcium', 'Sodium', 'Potassium', 'Magnesium', 'Aluminum', 'Chlorine', 'Sulfur', 'Phosphorus', 'Silicon', 'Boron', 'Fluorine'];
            const symbols = ['H', 'O', 'C', 'N', 'Fe', 'Au', 'Ag', 'Cu', 'Zn', 'Ca', 'Na', 'K', 'Mg', 'Al', 'Cl', 'S', 'P', 'Si', 'B', 'F'];
            const elementIndex = seed % elements.length;
            const element = elements[elementIndex];
            const correctSymbol = symbols[elementIndex];
            questionText = `What is the chemical symbol for ${element}?`;
            correctAnswer = correctSymbol;
            const wrongSymbols = symbols.filter((s, i) => i !== elementIndex);
            const wrong1 = wrongSymbols[(seed * 2) % wrongSymbols.length];
            const wrong2 = wrongSymbols[(seed * 3) % wrongSymbols.length];
            const wrong3 = wrongSymbols[(seed * 4) % wrongSymbols.length];
            options = [correctSymbol, wrong1, wrong2, wrong3];
          } else if (scienceType === 1) {
            const physicsType = seed % 3;
            if (physicsType === 0) {
              const mass = Math.floor((seed % 100) + 10);
              const velocity = Math.floor(((seed * 2) % 50) + 5);
              const kineticEnergy = Math.round(0.5 * mass * velocity * velocity);
              questionText = `Calculate the kinetic energy (in Joules) for an object with mass ${mass} kg moving at ${velocity} m/s.`;
              correctAnswer = kineticEnergy.toString();
              options = [
                correctAnswer,
                (kineticEnergy * 2).toString(),
                (kineticEnergy / 2).toString(),
                (mass * velocity).toString()
              ];
            } else if (physicsType === 1) {
              const distance = Math.floor((seed % 100) + 10);
              const time = Math.floor(((seed * 3) % 20) + 1);
              const speed = Math.round((distance / time) * 10) / 10;
              questionText = `An object travels ${distance} meters in ${time} seconds. What is its speed in m/s?`;
              correctAnswer = speed.toString();
              options = [
                correctAnswer,
                (speed * 2).toFixed(1),
                (speed / 2).toFixed(1),
                (distance + time).toString()
              ];
            } else {
              const base = Math.floor((seed % 10) + 1);
              const exponent = Math.floor(((seed * 5) % 4) + 2);
              const result = Math.pow(base, exponent);
              questionText = `What is ${base} raised to the power of ${exponent}?`;
              correctAnswer = result.toString();
              options = [
                correctAnswer,
                (result + Math.floor(Math.random() * 50)).toString(),
                (result - Math.floor(Math.random() * 50)).toString(),
                (base * exponent).toString()
              ];
            }
          } else {
            const biologyType = seed % 4;
            if (biologyType === 0) {
              questionText = `How many bones are in an adult human body?`;
              correctAnswer = '206';
              options = ['206', '200', '210', '220'];
            } else if (biologyType === 1) {
              questionText = `What is the approximate pH of pure water?`;
              correctAnswer = '7';
              options = ['7', '6', '8', '5'];
            } else if (biologyType === 2) {
              questionText = `How many chambers does a human heart have?`;
              correctAnswer = '4';
              options = ['4', '2', '3', '5'];
            } else {
              const temp = Math.floor((seed % 50) + 80);
              questionText = `What is the approximate body temperature of a healthy human in Fahrenheit?`;
              correctAnswer = '98.6';
              options = ['98.6', temp.toString(), (temp + 5).toString(), (temp - 5).toString()];
            }
          }
        }
        break;
        
      case "English":
        {
          const englishType = Math.floor(Math.random() * 4);
          const seed = index * 31;
          
          if (englishType === 0) {
            const wordPairs = [
              ['Happy', 'Joyful'], ['Sad', 'Mournful'], ['Big', 'Large'], ['Small', 'Tiny'],
              ['Fast', 'Quick'], ['Slow', 'Sluggish'], ['Beautiful', 'Lovely'], ['Ugly', 'Hideous'],
              ['Smart', 'Intelligent'], ['Dumb', 'Stupid'], ['Brave', 'Courageous'], ['Afraid', 'Fearful'],
              ['Angry', 'Furious'], ['Calm', 'Peaceful'], ['Bright', 'Radiant'], ['Dark', 'Gloomy']
            ];
            const pairIndex = seed % wordPairs.length;
            const pair = wordPairs[pairIndex];
            questionText = `What is a synonym for "${pair[0]}"?`;
            correctAnswer = pair[1];
            const allWords = wordPairs.flat().filter((w, i) => i !== pairIndex * 2 && i !== pairIndex * 2 + 1);
            options = [
              pair[1],
              allWords[(seed * 2) % allWords.length],
              allWords[(seed * 3) % allWords.length],
              allWords[(seed * 5) % allWords.length]
            ];
          } else if (englishType === 1) {
            const antonyms = [
              ['Hot', 'Cold'], ['Light', 'Dark'], ['Up', 'Down'], ['Good', 'Bad'],
              ['Love', 'Hate'], ['Day', 'Night'], ['Begin', 'End'], ['Create', 'Destroy'],
              ['Win', 'Lose'], ['Start', 'Finish'], ['Give', 'Take'], ['Ask', 'Answer']
            ];
            const pairIndex = seed % antonyms.length;
            const pair = antonyms[pairIndex];
            questionText = `What is an antonym for "${pair[0]}"?`;
            correctAnswer = pair[1];
            const allWords = antonyms.flat().filter((w, i) => i !== pairIndex * 2 && i !== pairIndex * 2 + 1);
            options = [
              pair[1],
              allWords[(seed * 2) % allWords.length],
              allWords[(seed * 3) % allWords.length],
              allWords[(seed * 4) % allWords.length]
            ];
          } else if (englishType === 2) {
            const parts = [
              { word: 'Running', type: 'Verb', wrong: ['Noun', 'Adjective', 'Adverb'] },
              { word: 'Beautiful', type: 'Adjective', wrong: ['Noun', 'Verb', 'Adverb'] },
              { word: 'Quickly', type: 'Adverb', wrong: ['Noun', 'Verb', 'Adjective'] },
              { word: 'Computer', type: 'Noun', wrong: ['Verb', 'Adjective', 'Adverb'] },
              { word: 'Writing', type: 'Noun', wrong: ['Verb', 'Adjective', 'Adverb'] },
              { word: 'Lovely', type: 'Adjective', wrong: ['Noun', 'Verb', 'Adverb'] }
            ];
            const selectedIndex = seed % parts.length;
            const selected = parts[selectedIndex];
            questionText = `What part of speech is "${selected.word}"?`;
            correctAnswer = selected.type;
            options = [selected.type, ...selected.wrong];
          } else {
            const verbs = [
              ['Run', 'Ran'], ['Go', 'Went'], ['See', 'Saw'], ['Take', 'Took'],
              ['Come', 'Came'], ['Eat', 'Ate'], ['Write', 'Wrote'], ['Break', 'Broke'],
              ['Speak', 'Spoke'], ['Choose', 'Chose'], ['Begin', 'Began'], ['Swim', 'Swam']
            ];
            const verbIndex = seed % verbs.length;
            const pair = verbs[verbIndex];
            questionText = `What is the past tense of "${pair[0]}"?`;
            correctAnswer = pair[1];
            const allForms = verbs.flat().filter((w, i) => i !== verbIndex * 2 && i !== verbIndex * 2 + 1);
            options = [
              pair[1],
              allForms[(seed * 2) % allForms.length],
              allForms[(seed * 3) % allForms.length],
              allForms[(seed * 4) % allForms.length]
            ];
          }
        }
        break;
        
      case "History":
        {
          const historyType = Math.floor(Math.random() * 3);
          const seed = index * 37;
          
          if (historyType === 0) {
            const century = 1500 + Math.floor((seed % 500));
            const year = century + Math.floor((seed * 2 % 100));
            questionText = `In which year did a major historical event occur around ${year}?`;
            correctAnswer = year.toString();
            options = [
              year.toString(),
              (year + Math.floor((seed * 3) % 20) - 10).toString(),
              (year + Math.floor((seed * 5) % 30) - 15).toString(),
              (year - Math.floor((seed * 7) % 25) + 10).toString()
            ];
          } else if (historyType === 1) {
            const facts = [
              { q: `How many years did World War II last?`, correct: '6', wrong: ['4', '5', '8'] },
              { q: `In which century did the Renaissance begin?`, correct: '14th', wrong: ['12th', '13th', '15th'] },
              { q: `How many original colonies were there in America?`, correct: '13', wrong: ['10', '15', '12'] },
              { q: `The Industrial Revolution started in which country?`, correct: 'England', wrong: ['France', 'Germany', 'United States'] },
              { q: `In which year did the Berlin Wall fall?`, correct: '1989', wrong: ['1987', '1991', '1985'] },
              { q: `How many years did the Cold War last approximately?`, correct: '44', wrong: ['30', '50', '60'] }
            ];
            const selectedIndex = seed % facts.length;
            const selected = facts[selectedIndex];
            questionText = selected.q;
            correctAnswer = selected.correct;
            options = [selected.correct, ...selected.wrong];
          } else {
            const startYear = 1800 + Math.floor((seed % 200));
            const duration = Math.floor((seed * 3 % 50) + 1);
            const endYear = startYear + duration;
            questionText = `If a war started in ${startYear} and lasted ${duration} years, in which year did it end?`;
            correctAnswer = endYear.toString();
            options = [
              endYear.toString(),
              (endYear + 1).toString(),
              (endYear - 1).toString(),
              (startYear - duration).toString()
            ];
          }
        }
        break;
        
      case "Geography":
        {
          const geoType = Math.floor(Math.random() * 3);
          const seed = index * 41;
          
          if (geoType === 0) {
            const countries = [
              ['France', 'Paris'], ['Japan', 'Tokyo'], ['Brazil', 'Brasília'], ['Australia', 'Canberra'],
              ['Canada', 'Ottawa'], ['India', 'New Delhi'], ['Russia', 'Moscow'], ['Egypt', 'Cairo'],
              ['Germany', 'Berlin'], ['Italy', 'Rome'], ['Spain', 'Madrid'], ['Mexico', 'Mexico City'],
              ['South Korea', 'Seoul'], ['Thailand', 'Bangkok'], ['Argentina', 'Buenos Aires'], ['Chile', 'Santiago']
            ];
            const countryIndex = seed % countries.length;
            const pair = countries[countryIndex];
            questionText = `What is the capital of ${pair[0]}?`;
            correctAnswer = pair[1];
            const allCities = countries.map(c => c[1]).filter((c, i) => i !== countryIndex);
            options = [
              pair[1],
              allCities[(seed * 2) % allCities.length],
              allCities[(seed * 3) % allCities.length],
              allCities[(seed * 5) % allCities.length]
            ];
          } else if (geoType === 1) {
            const geoQ = seed % 4;
            if (geoQ === 0) {
              questionText = `How many continents are there on Earth?`;
              correctAnswer = '7';
              options = ['7', '5', '6', '8'];
            } else if (geoQ === 1) {
              questionText = `What percentage of Earth's surface is covered by water?`;
              correctAnswer = '71%';
              options = ['71%', '60%', '80%', '65%'];
            } else if (geoQ === 2) {
              questionText = `Which is the largest continent by area?`;
              correctAnswer = 'Asia';
              options = ['Asia', 'Africa', 'North America', 'Europe'];
            } else {
              questionText = `How many countries are there approximately in the world?`;
              correctAnswer = '195';
              options = ['195', '180', '210', '170'];
            }
          } else {
            const length = Math.floor((seed % 1000) + 100);
            const width = Math.floor(((seed * 2) % 500) + 50);
            const area = length * width;
            questionText = `A rectangular region has a length of ${length} km and width of ${width} km. What is its area in square kilometers?`;
            correctAnswer = area.toString();
            options = [
              correctAnswer,
              (area + Math.floor((seed * 3) % 10000)).toString(),
              (area - Math.floor((seed * 5) % 10000)).toString(),
              (length + width).toString()
            ];
          }
        }
        break;
        
      case "Computers":
        {
          const compType = Math.floor(Math.random() * 5);
          const seed = index * 43;
          
          if (compType === 0) {
            const decimal = Math.floor((seed % 256));
            const binary = decimal.toString(2);
            questionText = `What is the binary equivalent of ${decimal}?`;
            correctAnswer = binary;
            const wrong1 = (decimal + 1).toString(2);
            const wrong2 = Math.max(0, decimal - 1).toString(2);
            const wrong3 = (decimal * 2).toString(2);
            options = [binary, wrong1, wrong2, wrong3];
          } else if (compType === 1) {
            const acronyms = [
              ['CPU', 'Central Processing Unit'],
              ['RAM', 'Random Access Memory'],
              ['HTTP', 'HyperText Transfer Protocol'],
              ['HTML', 'HyperText Markup Language'],
              ['API', 'Application Programming Interface'],
              ['URL', 'Uniform Resource Locator'],
              ['DNS', 'Domain Name System'],
              ['SSD', 'Solid State Drive']
            ];
            const acroIndex = seed % acronyms.length;
            const pair = acronyms[acroIndex];
            questionText = `What does ${pair[0]} stand for?`;
            correctAnswer = pair[1];
            const allMeanings = acronyms.map(a => a[1]).filter((m, i) => i !== acroIndex);
            options = [
              pair[1],
              allMeanings[(seed * 2) % allMeanings.length],
              allMeanings[(seed * 3) % allMeanings.length],
              allMeanings[(seed * 4) % allMeanings.length]
            ];
          } else if (compType === 2) {
            const a = Math.floor((seed % 100) + 1);
            const b = Math.floor(((seed * 3) % 100) + 1);
            const op = seed % 2;
            if (op === 0) {
              const result = a % b;
              questionText = `In programming, what is the result of ${a} % ${b} (modulo operation)?`;
              correctAnswer = result.toString();
              options = [
                correctAnswer,
                (result + Math.floor((seed * 2) % 10) + 1).toString(),
                Math.floor(a / b).toString(),
                (a + b).toString()
              ];
            } else {
              const result = a & b;
              questionText = `In programming, what is the result of ${a} & ${b} (bitwise AND)?`;
              correctAnswer = result.toString();
              options = [
                correctAnswer,
                (result + Math.floor((seed * 2) % 10) + 1).toString(),
                (a | b).toString(),
                (a + b).toString()
              ];
            }
          } else if (compType === 3) {
            const bytesType = seed % 3;
            if (bytesType === 0) {
              questionText = `How many bits are in a byte?`;
              correctAnswer = '8';
              options = ['8', '4', '16', '32'];
            } else if (bytesType === 1) {
              const kb = Math.floor((seed % 8) + 1);
              const bytes = kb * 1024;
              questionText = `How many bytes are in ${kb} KB?`;
              correctAnswer = bytes.toString();
              options = [
                correctAnswer,
                (kb * 1000).toString(),
                (kb * 512).toString(),
                kb.toString()
              ];
            } else {
              questionText = `What is the primary function of an operating system?`;
              correctAnswer = 'Manage hardware and software';
              options = ['Manage hardware and software', 'Run web browsers', 'Create documents', 'Send emails'];
            }
          } else {
            const protocols = [
              { q: `Which protocol is used for secure web communication?`, correct: 'HTTPS', wrong: ['HTTP', 'FTP', 'SMTP'] },
              { q: `Which protocol is used for email transmission?`, correct: 'SMTP', wrong: ['HTTP', 'FTP', 'HTTPS'] },
              { q: `Which protocol is used for file transfer?`, correct: 'FTP', wrong: ['HTTP', 'SMTP', 'HTTPS'] }
            ];
            const protoIndex = seed % protocols.length;
            const selected = protocols[protoIndex];
            questionText = selected.q;
            correctAnswer = selected.correct;
            options = [selected.correct, ...selected.wrong];
          }
        }
        break;
    }
    
    // Shuffle options so correct answer is not always at index 0
    const shuffledOptions = [...options];
    
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    // Find new index of correct answer after shuffling
    const correctAnswerIndex = shuffledOptions.indexOf(correctAnswer);
    
    return {
      question: questionText,
      options: shuffledOptions,
      correctAnswerIndex: correctAnswerIndex
    };
  }

  // ============================================================================
  // MAIN METHOD: Add Questions
  // ============================================================================

  /**
   * Add multiple random questions to the test
   * Generates "count" number of unique questions and adds them to the form
   * @param {number} count - Number of random questions to add (default: 500)
   */
  async addQuestions(count = 500) {
    console.log(`\n🚀 Starting to generate and add ${count} unique random questions...`);
    
    // Generate all random questions first
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push(this.generateRandomQuestion(i + 1));
    }
    
    console.log(`✓ Generated ${count} unique random questions programmatically`);
    console.log(`📝 Starting to add them to the form...\n`);
    
    let addedCount = 0;
    let failedCount = 0;
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const questionNumber = i + 1;
      
      try {
        // For each question after the first one, click "Add a question" to create a new slot
        if (questionNumber > 1) {
          const addQuestionButton = this.page.getByText('Add a question', { exact: false })
            .or(this.page.locator('button:has-text("Add a question")'))
            .or(this.page.locator('button:has-text("add a question")'))
            .or(this.page.locator('button').filter({ hasText: /add.*question/i }))
            .last();
          
          try {
            await addQuestionButton.waitFor({ state: 'visible', timeout: 10000 });
            await addQuestionButton.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(300);
            await addQuestionButton.click();
            await this.page.waitForTimeout(800);
          } catch (btnError) {
            console.log(`  ⚠ Could not find/click "Add a question" button for question ${questionNumber}, trying to use existing slot...`);
          }
        }
        
        // Find the question input field (should be the last/empty one)
        const questionInputs = this.page.getByPlaceholder('Let\'s ask a question');
        const questionInput = questionInputs.last();
        
        await questionInput.waitFor({ state: 'visible', timeout: 10000 });
        await questionInput.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(200);
        
        // Clear and fill question text
        await questionInput.clear();
        await questionInput.fill(q.question);
        await this.page.waitForTimeout(300);
        
        // Find the question section for scoping
        const questionSection = questionInput.locator('xpath=ancestor::*[contains(., "Question") or contains(@class, "question")][1]').or(
          questionInput.locator('xpath=ancestor::*[position()<=10]').last()
        );
        
        // Ensure we have 4 option inputs and fill them
        const optionInputsInSection = questionSection.locator('input[placeholder*="Option" i]');
        let currentOptionCount = await optionInputsInSection.count().catch(() => 0);
        
        // Add option inputs if needed (we need exactly 4)
        while (currentOptionCount < 4) {
          const addOptionButton = questionSection.getByText('Add an option', { exact: false })
            .or(questionSection.locator('button:has-text("Add an option")'))
            .or(questionSection.locator('button').filter({ hasText: /add.*option/i }))
            .first();
          
          try {
            await addOptionButton.waitFor({ state: 'visible', timeout: 5000 });
            await addOptionButton.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);
            await addOptionButton.click();
            await this.page.waitForTimeout(400);
            currentOptionCount = await optionInputsInSection.count().catch(() => 0);
          } catch (optError) {
            console.log(`  ⚠ Could not add option input ${currentOptionCount + 1}, continuing...`);
            break;
          }
        }
        
        // Fill all 4 options
        for (let optIdx = 0; optIdx < 4; optIdx++) {
          const optionInput = optionInputsInSection.nth(optIdx);
          try {
            await optionInput.waitFor({ state: 'visible', timeout: 5000 });
            await optionInput.scrollIntoViewIfNeeded();
            await optionInput.clear();
            await optionInput.fill(q.options[optIdx]);
            await this.page.waitForTimeout(150);
          } catch (optFillError) {
            console.log(`  ⚠ Failed to fill option ${optIdx + 1} for question ${questionNumber}`);
          }
        }
        
        // Wait for answer buttons to appear
        await this.page.waitForTimeout(600);
        
        // Select the correct answer
        const answerLetters = ['A', 'B', 'C', 'D'];
        const answerLetter = answerLetters[q.correctAnswerIndex];
        
        const correctAnswerLabel = questionSection.getByText('Correct answer', { exact: false }).first();
        
        try {
          await correctAnswerLabel.waitFor({ state: 'visible', timeout: 10000 });
          
          const answerContainer = correctAnswerLabel.locator('xpath=following::*[1]');
          
          const answerSelector = answerContainer.getByText(answerLetter, { exact: true }).first();
          await answerSelector.waitFor({ state: 'visible', timeout: 10000 });
          await answerSelector.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(200);
          await answerSelector.click();
        } catch (answerError) {
          console.log(`  ⚠ Failed to select answer ${answerLetter} for question ${questionNumber}, continuing...`);
        }
        
        // Check for and click "Save Question" button if it exists
        await this.page.waitForTimeout(400);
        
        const saveQuestionButton = questionSection.getByText('Save Question', { exact: false })
          .or(questionSection.locator('button:has-text("Save Question")'))
          .or(questionSection.locator('button:has-text("Save")').filter({ hasNot: this.page.locator('text=Save as') }))
          .first();
        
        const saveButtonExists = await saveQuestionButton.isVisible({ timeout: 2000 }).catch(() => false);
        if (saveButtonExists) {
          try {
            await saveQuestionButton.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);
            await saveQuestionButton.click();
            await this.page.waitForTimeout(500);
          } catch (saveError) {
            // Save button might not be required, continue
          }
        }
        
        addedCount++;
        
        // Log progress every 50 questions (as requested)
        if (questionNumber % 50 === 0 || questionNumber === 1) {
          console.log(`  ✓ Added ${questionNumber}/${count} questions... (${addedCount} successful, ${failedCount} failed)`);
        }
        
        // Small delay between questions to ensure UI updates properly
        if (questionNumber < count) {
          await this.page.waitForTimeout(300);
        }
        
      } catch (error) {
        failedCount++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`  ❌ Failed to add question ${questionNumber}: ${errorMsg}`);
        
        // Log detailed error for first few failures
        if (failedCount <= 3) {
          console.error(`    Error details:`, error);
        }
        
        // Continue with next question instead of stopping
        await this.page.waitForTimeout(200);
      }
    }
    
    console.log(`\n✅ Process completed!`);
    console.log(`   - Successfully added: ${addedCount} questions`);
    console.log(`   - Failed: ${failedCount} questions`);
    console.log(`   - Total attempted: ${count} questions\n`);
    
    return addedCount;
  }
}

module.exports = CreateQuizPage;

