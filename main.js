let startText = document.getElementById('startText')
let infoDiv = document.getElementById('infoDiv')

window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyG') {
        infoDiv.style.display = 'none'
        TheGame()
    }
})
setInterval(() => {
    startText.style.color = '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase();
}, 300)