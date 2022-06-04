const newGameBtn = document.querySelector('.new-game')
const container = document.querySelector('.box');
const timerScoreText = document.querySelector('.timerScore')
const scoreText = document.querySelector('.scoreNum')


//audio stuff
const animation_audio = new Audio();
animation_audio.src = "./sounds/clickSound.mp3"
const tile_audio = new Audio();
tile_audio.src = "./sounds/animationSound.mp3"
const lose_audio = new Audio();
lose_audio.src = "./sounds/loseSound.mp3"
const win_audio = new Audio();
win_audio.src = "./sounds/winSound.mp3"






//size of the matrix
let size = 0;

let order = 1; // if the things has to be given in an order


function RefereshButtons() { //refresh the button layout every new game and when you click another button

    GameSizeFour.style.backgroundColor = "#DCE2C8";
    GameSizeFour.style.fontWeight = "200"

    GameSizeSix.style.backgroundColor = "#DCE2C8";
    GameSizeSix.style.fontWeight = "200"

    multiplayer.style.backgroundColor = "#DCE2C8";
    multiplayer.style.color = "black"
    multiplayer.style.fontWeight = "200"

}




const multiplayer = document.querySelector(".multiplayer")

//if four is clicked
const GameSizeFour = document.querySelector(".game_size_four")
GameSizeFour.addEventListener('click', () => {

    RefereshButtons();

    //make four highlighted
    size = 4
    order = 0
    GameSizeFour.style.backgroundColor = "#A8DCD1";
    GameSizeFour.style.fontWeight = "bold"
})
const GameSizeSix = document.querySelector(".game_size_six")

GameSizeSix.addEventListener('click', () => {

    RefereshButtons();

    //make six highlighted
    size = 6
    order = 1
    GameSizeSix.style.backgroundColor = "#A8DCD1";
    GameSizeSix.style.fontWeight = "bold"


})
multiplayer.addEventListener('click', () => {

    RefereshButtons();

    array = []

    multiplayer.style.backgroundColor = "#F96900";
    multiplayer.style.color = "#DCE2C8"
    multiplayer.style.fontWeight = "bold"

})





let count = 0

//timer things
let time_element = document.querySelector(".timerNum")

let timer = setInterval(timerFunc, Infinity);
let sec = 0;

let score = 0

//function to run the countdown.
function timerFunc() {
    time_element.textContent = sec;
    sec--;

    if (sec < 0) {
        clearInterval(timer);

        //end game if the seconds go to zero during the game
        if (count != 0) {
            lose_audio.play();
            gameEnd();
        }
    }

}







//create an array based on the size and randomize
let array = [];

function ArrayCreate() {
    for (let i = 0; i < size * size; i++) {
        array.push(i);
    }
    array = array.sort((a, b) => 0.5 - Math.random())
}



const GameSelector = document.querySelector(".game_selector")
const ButtonSelections = document.querySelector(".buttons")

//function to start game on pressing the button
newGameBtn.addEventListener('click', NewGame)

const multiplayerPlayer = document.querySelector(".multiplayer_player")

function NewGame() { // it happens when you click the button during mulitplayer mode
    if (newGameBtn.classList.contains(".multiplayer")) {
        NewGameMultiplayer();
    } else if (multiplayer.style.fontWeight == "bold") { // happens when you click multiplayer for the first time
        multiplayerPlayer.style.display = "inline-block"
        ArrayMakeMultiplayer();
    } else if (newGameBtn.classList.contains(".started")) {
        //end game if the button is clicked while playing the game
        lose_audio.play();
        gameEnd()

    } else {

        if (size == 0) {
            //if size is not selected
            alert("Enter Size by clicking the respective button")
        } else {

            //change the button to end game (while playing)
            newGameBtn.textContent = "End Game"
            newGameBtn.classList.add(".started")

            //remove the game selector and change orientation
            GameSelector.style.display = "none"
            ButtonSelections.style.flexDirection = "row"

            //show the timer and score from hidden
            timerScoreText.style.display = "inline-block"

            //start a time of 30 seconds
            sec = 30
            timer = setInterval(timerFunc, 1000);

            //count and score
            score = 0
            count = 1

            ArrayCreate();
            //start game
            gameOn(count, size)
        }
    }


}



//removes all the children elements
function removeChildren() {
    let buttons = document.querySelectorAll('.sub_button')
    buttons.forEach((button) => {
        button.parentElement.removeChild(button)
    });



}



//validates for unordered sequence
function checkChildrenOne(count) {
    let num = 0;
    let buttons = document.querySelectorAll('.correct')
    buttons.forEach((button) => {
        num++; //finds the number of the buttons with the class correct
    });
    if (num == count) { //would increase the cound and give
        if (count == size * size) { //ie it reached the end of the game()
            GameContinue();

        } else {
            gameOn(count + 1, size) //move onto the next game
        }
    }

}



//function when all the things are cleared in a round
function GameContinue() {
    win_audio.play();
    array = [];
    ArrayCreate();
    score += sec;
    sec += 3
    gameOn(1, size)

}



//end the game
function gameEnd(count) {
    //cheange the button context to new game
    newGameBtn.textContent = "New Game"
    newGameBtn.classList.remove(".started")


    //change the orientation and maek teh game selectos come from hidden
    GameSelector.style.display = "inline-block"
    ButtonSelections.style.flexDirection = "column"


    //stop timer
    clearInterval(timer)
    let name = prompt(`Game Ended. Your score is ${score}\n\nEnter your name to save score to leaderboard\n`)

    //does the leaderboard
    SaveHighScore(name);

    //removes the timer and score
    timerScoreText.style.display = "none"
    time_element.textContent = ''

    size = 0;
    RefereshButtons();

    //removes the children
    removeChildren()
}




//leaderBoard saving functions things
localStorage.setItem("highScores", JSON.stringify([]));

//list of the highscores saved in local storage
const highScores = JSON.parse(localStorage.getItem("highScores"));



function SaveHighScore(name) {
    if (name == '') {
        name = 'Player'
    }
    //save as a dictionary for the highscores
    const scores_dict = {
        score_val: score,
        name: name
    }
    highScores.push(scores_dict);

    SortHighScore(); //sort new leaderboard
    RemoveLeaderboard(); // remove the current leaderboard
    DisplayLeaderboard(); //display the new leaderboard
}


//sorts the highscore
function SortHighScore() {
    let size = highScores.length
        //bubble sort
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (highScores[j].score_val < highScores[i].score_val) {
                let temp = highScores[i]
                highScores[i] = highScores[j]
                highScores[j] = temp
            }
        }
    }

}

const leaderBoard_stats = document.querySelector('.leaderboard_stats')

//keeps only the first 5 parts of the leaderboard
function RemoveLeaderboard() {
    let leaderboard_statistics = document.querySelectorAll(".leaderboard_stats > *")
    leaderboard_statistics.forEach((leaderBoard_unit) => {
        leaderBoard_unit.parentElement.removeChild(leaderBoard_unit);
    })
}


//display the leaaderboard
function DisplayLeaderboard() {

    LeaderboardSize = ((highScores.length < 5) ? highScores.length : 5) //takes only upto 5 leaderboard spaces

    for (let i = 0; i < LeaderboardSize; i++) {
        const leaderboardText = document.createElement('p')
        leaderboardText.textContent = `${highScores[i].name} - ${highScores[i].score_val}`;
        leaderBoard_stats.append(leaderboardText)
    }
}





function gameOn(count, size) {

    //add the score (based on the previous one)
    if (count != 1) {
        score += sec
    }

    scoreText.textContent = score


    //timer increase per round
    sec += 3 * (count - 1);

    let sequenceCheck = 0;

    //round start audio button
    animation_audio.play();
    let x = container.offsetHeight / size;

    //removes the previous grid elements
    removeChildren();


    for (let i = 0; i < size * size; i++) {


        //creates an element
        const button = document.createElement('div');
        button.id = i;
        button.classList.add('sub_button');
        button.textContent = '';

        //add the dimensions that are according ot the size calculated before
        button.style.height = `${x}px`;
        button.style.width = `${x}px`;

        //add the abosolute positiioning of the elements
        button.style.left = `${x* (i%size)}px`;
        button.style.top = `${x* ((i - i%size)/size)}px`

        //do the animation if they are inside the array
        for (let j = 0; j < count; j++) {
            if (i == array[j]) {
                button.classList.add('animate_button')
                button.style.animationDelay = `${(j+1)*2}s`
            }
        }


        //validate the button clicks
        button.addEventListener('click', () => {


            let correctButton = 0
            for (let j = 0; j < count; j++) {
                if (i == array[j]) {
                    //if it is correct, then it would change to 1
                    correctButton = 1
                }
            }
            if (correctButton == 0) {
                //lose game if the wrong button is clicked
                gameEnd(count - 1, size);
                lose_audio.play();

            } else { //when the button is correct

                if (order == 0) { // during the first case

                    //add a class to the right buttons (to check if all buttons are there later)
                    button.classList.add('correct')
                    tile_audio.play();
                    checkChildrenOne(count); //checks if there is req no of buttons with correct class


                } else {
                    if (i == array[sequenceCheck]) { //here we check if each one of them would be in the right sequence
                        sequenceCheck++; // then would shift it so as to check the next one
                        tile_audio.play();

                        if (sequenceCheck == count) { //if the entire sequence of the round is validated

                            if (count == array.length) {
                                GameContinue();

                            } else {
                                gameOn(count + 1, size);
                            } //goes to the next round
                        }


                    } else { //if it is not right sequence
                        lose_audio.play();
                        gameEnd(count - 1, size);


                    }
                }
            }
        })
        container.appendChild(button)
    }
}



let players = ['Player1', 'Player2']

let playerPosition = 0


function ChangePlayerPosition() {
    if (playerPosition == 0) {
        playerPosition = 1
    } else {
        playerPosition = 0
    }
}



function ArrayMakeMultiplayer() {

    GameSelector.style.display = "none"


    size = prompt("Enter size of array")

    players[0] = prompt("Enter name of Player 1")
    players[1] = prompt("Enter name of Player 2")

    newGameBtn.classList.add(".multiplayer")

    NewGameChoose();



}


function NewGameChoose() {


    newGameBtn.textContent = `End Selection`
    if (newGameBtn.classList.contains(".multiplayer") == 0) {
        newGameBtn.classList.add(".multiplayer")
    }
    newGameBtn.classList.remove(".started")

    array = [];
    removeChildren();

    multiplayerPlayer.textContent = `${players[playerPosition]} Choosing`

    ChangePlayerPosition();

    let x = container.offsetHeight / size;

    for (let i = 0; i < size * size; i++) {


        //creates an element
        const button = document.createElement('div');
        button.id = i;
        button.classList.add('sub_button');
        button.textContent = '';

        //add the dimensions that are according ot the size calculated before
        button.style.height = `${x}px`;
        button.style.width = `${x}px`;

        //add the abosolute positiioning of the elements
        button.style.left = `${x* (i%size)}px`;
        button.style.top = `${x* ((i - i%size)/size)}px`


        //validate the button clicks
        button.addEventListener('click', () => {
            if (button.style.backgroundColor != "#DBB4A7") {
                array.push(i);
            }
            button.style.backgroundColor = "#DBB4A7";

            if (array.length == size * size) {
                alert("Starting Game")
                NewGameMultiplayer();

            }



        })
        container.appendChild(button)
    }


}




//end the game
function gameEndMultiplayer(count) {
    //cheange the button context to new game

    size = 0;

    multiplayerPlayer.style.display = "none"

    newGameBtn.textContent = "New Game"
    newGameBtn.classList.remove(".started")
    newGameBtn.classList.remove(".multiplayer")
    alert("youlost")

    GameSelector.style.display = "inline-block"
    ButtonSelections.style.flexDirection = "column"

    RefereshButtons();


    removeChildren();
}




function NewGameMultiplayer() {
    if (newGameBtn.classList.contains(".started")) {
        //end game if the button is clicked while playing the game
        lose_audio.play();
        gameEndMultiplayer()

    } else {

        if (size == 0) {
            //if size is not selected
            alert("Enter Size by clicking the respective button")
        } else {

            //change the button to end game (while playing)
            newGameBtn.textContent = "End Game"
            newGameBtn.classList.add(".started")


            count = 1

            //start game
            gameOnMultiplayer(count, size)
        }
    }

}



function gameOnMultiplayer(count, size) {


    multiplayerPlayer.textContent = `${players[playerPosition]} Playing`

    let sequenceCheck = 0;

    //round start audio button
    animation_audio.play();
    let x = container.offsetHeight / size;

    //removes the previous grid elements
    removeChildren();


    for (let i = 0; i < size * size; i++) {


        //creates an element
        const button = document.createElement('div');
        button.id = i;
        button.classList.add('sub_button');
        button.textContent = '';

        //add the dimensions that are according ot the size calculated before
        button.style.height = `${x}px`;
        button.style.width = `${x}px`;

        //add the abosolute positiioning of the elements
        button.style.left = `${x* (i%size)}px`;
        button.style.top = `${x* ((i - i%size)/size)}px`

        //do the animation if they are inside the array
        for (let j = 0; j < count; j++) {
            if (i == array[j]) {
                button.classList.add('animate_button')
                button.style.animationDelay = `${(j+1)*2}s`
            }
        }


        //validate the button clicks
        button.addEventListener('click', () => {


            let correctButton = 0
            for (let j = 0; j < count; j++) {
                if (i == array[j]) {
                    //if it is correct, then it would change to 1
                    correctButton = 1
                }
            }
            if (correctButton == 0) {
                //lose game if the wrong button is clicked
                gameEndMultiplayer(count - 1, size);
                lose_audio.play();

            } else { //when the button is correct

                if (i == array[sequenceCheck]) { //here we check if each one of them would be in the right sequence
                    sequenceCheck++; // then would shift it so as to check the next one
                    tile_audio.play();

                    if (sequenceCheck == count) { //if the entire sequence of the round is validated

                        if (count == array.length) {

                            win_audio.play();
                            NewGameChoose();
                        } else {
                            gameOnMultiplayer(count + 1, size);
                        } //goes to the next round
                    }


                } else { //if it is not right sequence
                    lose_audio.play();
                    gameEndMultiplayer(count - 1, size);


                }

            }
        })
        container.appendChild(button)
    }
}