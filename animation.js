function animation(obj) {
    const {clear, update, render} = obj
    let pTime = 0
    requestAnimationFrame(service)

    function service(timestamp) {
        requestAnimationFrame(service)

        // diff - час за який оновлюється кліент
        const diff = timestamp - pTime
        pTime = timestamp
        // fps кількість кадрів в секунду
        const fps = Math.ceil(1000 / diff)
        // secondPart обернена величина до к-сті кадрів ,
        // потрібна для правильного оновлення
        const secondPart = diff / 1000
        const params = {
            diff,
            timestamp,
            pTime,
            fps,
            secondPart,
        };

        update(params)
        clear()
        render(params)
    }

}