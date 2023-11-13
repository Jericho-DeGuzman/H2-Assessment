const readline = require('readline');

// to read user input.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// questionaire
const questionaire = [
    {
        id: 1,
        question: `You went to a party last night and when you arrived at school the next day, everybody is talking about something you didn’t do. What will you do?`,
        choices: [`a. Avoid everything and go with your friends`, `b. Go and talk with the person that started the rumors`, `c. Go and talk with the teacher`]
    },
    {
        id: 2,
        question: `What quality do you excel in the most?`,
        choices: [`a. Empathy`, `b. Curiosity`, `c. Perseverance`]
    },
    {
        id: 3,
        question: `You are walking down the street when you see an old lady trying to cross, what will you do?`,
        choices: ['a. Go and help her', `b. Go for a policeman and ask him to help`, `c. Keep walking ahead`]
    },
    {
        id: 4,
        question: `You had a very difficult day at school, you will maintain a ____ attitude`,
        choices: [`a. Depends on the situation`, `b. Positive`, `c. Negative`]
    },
    {
        id: 5,
        question: `You are at a party and a friend of yours comes over and offers you a drink, what do you do?`,
        choices: [`a. Say no thanks`, `b. Drink it until it is finished`, `c. Ignore him and get angry at him`]
    },
    {
        id: 6,
        question: `You just started in a new school, you will...`,
        choices: [`a. Go and talk with the person next to you`, `b. Wait until someone comes over to you`, `c. Not talk to anyone`]
    },
    {
        id: 7,
        question: `In a typical Friday, you would like to..`,
        choices: [`a. Go out with your close friends to eat`, `b. Go to a social club and meet more people`, `c. Invite one of your friends to your house`]
    },
    {
        id: 8,
        question: `Your relationship with your parents is..`,
        choices: ['a. I like both equally', `b. I like both equally`, `c. I like my Mom the most`]
    }
];

// result 
const result = [`Self-Management You manage yourself well; You take responsibility for your own behavior and well-being.`,
    `Empathy You are emphatic. You see yourself in someone else’s situation before doing decisions. You tend to listen to other’s voices.`,
    `Self-Awareness You are conscious of your own character, feelings, motives, and desires.The process can be painful but it leads to greater self-awareness.`]

// start.
exam();

async function exam() {
    // hold questionaire order.
    const questionaireOrder = [];
    // user answers.
    const answers = {};
    // count how many times each choice was answered.
    const answersCount = {
        'a': 0,
        'b': 0,
        'c': 0
    }
    // get questions.
    const questions = await shuffleQuestion([...questionaire]);

    // display questions.
    console.log('\n');
    for (const _question of questions) {
        const { id, question, choices } = _question;
        // store question arrangement based on the shuffled question.
        questionaireOrder.push(id);

        console.log(`Question ${id}: ${question}`);
        for (let choice of choices) {
            console.log(`- ${choice}`);
        }
        console.log('\n');
    }

    // Get user answers sequentially based on the shuffled order.
    console.log('Enter you answer below: ')
    for (const num of questionaireOrder) {
        try {
            const answer = await userAnswer(num);
            await validateAnswer(answer);
            answers[num] = answer.toLowerCase();
            answersCount[answer] = answersCount[answer] + 1
        } catch (err) {
            console.log(err?.message);
            // make user answer correctly.
            const answer = await userAnswer(num);
            await validateAnswer(answer);
            answers[num] = answer.toLowerCase();
            answersCount[answer] = answersCount[answer] + 1
        }
    }

    // print how many times each choice was answered.
    console.log('\n');
    for (const ans in answersCount) {
        console.log(`count(${ans}): ${answersCount[ans]}`);
    }
    console.log(`Total Answers: ${Object.keys(answers).length}`);

    const _result = checkResult(answersCount);
    console.log('\n');
    console.log('Result:');
    console.log(`${result[_result - 1]}`);
}

function checkResult(answers) {
    let a = 0;
    let b = 0;
    let c = 0;

    for (const answer in answers) {
        if (answer == 'a') a = answers[answer];
        if (answer == 'b') b = answers[answer];
        if (answer == 'c') c = answers[answer];
    }

    if (a > b && a > c) {
        return 2;
    } else if (b > a && b > c) {
        return 3;
    } else if (c > a && b > c) {
        return 1;
    } else {
        return 3;
    }
}

// Get user answer for a specific question.
function userAnswer(question) {
    return new Promise((resolve) => {
        rl.question(`Question ${question}: `, (input) => {
            resolve(input);
        });
    });
}

// Check if user answer is in the options.
function validateAnswer(ans) {
    const _ans = ans.toLowerCase();
    return new Promise((resolve, reject) => {
        if (_ans == 'a' || _ans == 'b' || _ans == 'c') {
            resolve(true);
        } else {
            reject(new Error('Please select a valid option from A, B, or C.'));
        }
    });
}

// Randomly order list of questions.
async function shuffleQuestion(questions) {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    return questions;
}
