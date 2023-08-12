const charismaList = document.getElementById("list");
const words = ['Welcome to Charisma trainer v2', 'If you need any help dm pythe. on discord', 'click 1-8 to select words'];
const randomIndex = Math.floor(Math.random() * words.length)
let charismaItems = charismaList.querySelectorAll("button");
let charismaInfo = document.getElementById('info');

getColor();
function addNumbers() {
    let buttonNumber = 0;
    for (let i = 0; i < charismaItems.length; i++) {
        buttonNumber++
        let span = document.createElement('span');
        span.innerHTML = buttonNumber.toString()
        span.classList.add('number')
        charismaItems[i].appendChild(span);
        charismaItems[i].setAttribute('onclick',`copyClipboard(${buttonNumber})`)
    }
    console.log("Made by pythe.");
    console.log(charismaItems.length);
}

addNumbers();


let currentButton;
let buttonClone;
function copyClipboard(buttonNumber) {
    currentButton = charismaItems[buttonNumber-1];
    buttonClone = currentButton.cloneNode(true);
    buttonClone.removeChild(buttonClone.lastChild);
    buttonClone = buttonClone.innerHTML
    try {
        navigator.clipboard.writeText(buttonClone);
        console.log('Content copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

function getColor() {
    const savedData = localStorage.getItem("savedColor");
    if (savedData){

        setTimeout(function() {
        document.body.style.backgroundColor = savedData;
        }, 500);
        console.log('CORRECT COLOR');
    }

}

function colorChange(element) {
    console.log(`${window.getComputedStyle(element).backgroundColor}`)
    document.body.style.backgroundColor = window.getComputedStyle(element).backgroundColor;
    setTimeout(function() {
        saveData();
    }, 550);
}
function saveData() {
    console.log('data saved')
    localStorage.setItem("savedColor", getComputedStyle(document.body).backgroundColor)
    console.log(`saved color: ${localStorage.getItem('savedColor')}`)
}

document.addEventListener("DOMContentLoaded", function() {

    charismaInfo.innerHTML = words[randomIndex]

    document.body.addEventListener("keydown", function (e){
        let validKeys = ['1', '2', '3', '4', '5', '6', '7', '8'];
        if (validKeys.includes(e.key)){
            charismaItems[e.key-1].lastChild.classList.add('clicked');
            setTimeout(function() {
                charismaItems[e.key-1].lastChild.classList.remove('clicked');
            }, 200);
            copyClipboard(e.key);
        }
    })

})