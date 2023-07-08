const ambientSound = new Audio('/sounds/ambient.mp3')

const playHitSound = () =>
{

    ambientSound.volume = 0.6
    ambientSound.currentTime = 0
    ambientSound.loop = true
    ambientSound.play()
}

const stopHitSound = () =>
{
    ambientSound.volume = 0
}

export {playHitSound, stopHitSound}