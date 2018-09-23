export default class {
    constructor(conteiner, btnClass, infoClass) {
        this.box = conteiner;
        this.btnClass = btnClass;
        this.infoClass = infoClass;
        this.fps = 50;
        this.time = 400;
    }
    _enterEventHandler(event) {
        if(event.keyCode === 13) {
            this._activeHandler(event);
        }
    }
    _showInfoAnimation(target, fps = 50, time = 400) {
        let frame = 1000 / fps;
        let steps = Math.round(time / frame);
        let value = 180 / steps;
        var deg = 0;
        let title = target.querySelector(`.${this.btnClass}`);
        let info = target.querySelector(`.${this.infoClass}`);
        
        var render = () => {
            var id = requestAnimationFrame(render);
            deg += value;
            target.style.transform = `rotateX(${deg}deg)`;
            steps--;
            if (Math.round(deg) === 90) {
                console.log(steps, deg)
                title.style.opacity = 0;
                info.classList.remove('visually-hidden');
            }
            if (steps <= 0) {
                target.removeAttribute('style');
                cancelAnimationFrame(id);
                target.querySelector('.clan_close').addEventListener('click', this._closeInfoHandler);
            }
        }
        render();
    }
    _closeInfoHandler(event) {
        event.preventDefault();
        this._closeInfoAnimation(event.target.closest('.clan'));
    }
    _closeInfoAnimation(target, fps = 50, time = 400) {
        let frame = 1000 / fps;
        let steps = Math.round(time / frame);
        let value = 180 / steps;
        var deg = 180;
        let title = target.querySelector(`.${this.btnClass}`);
        let info = target.querySelector(`.${this.infoClass}`);
        
        var render = () => {
            var id = requestAnimationFrame(render);
            deg -= value;
            target.style.transform = `rotateX(${deg}deg)`;
            steps--;
            if (Math.round(deg) === 90) {
                console.log(steps, deg)
                title.removeAttribute('style');
                info.classList.add('visually-hidden');
            }
            if (steps <= 0) {
                target.removeAttribute('style');
                cancelAnimationFrame(id);
                target.querySelector('.clan_close').removeEventListener('click', this._closeInfoHandler);
            }
        }
        render();
    }
    _removeActiveClassHandler(event) {
        event.preventDefault();
        if(event.animationName === 'clan-info-active') {
            let target = event.target;
            target.classList.remove(`${this.btnClass}--active`);
            target.blur();
            
            this._showInfoAnimation(target.parentElement);
            
            document.removeEventListener('animationend', this._removeActiveClassHandler);
        }
    }
    _activeHandler(event) {
        event.preventDefault();
        let target = event.target.closest(`.${this.btnClass}`);
        if(!target) {
            return;
        }
        target.classList.add(`${this.btnClass}--active`);
        document.addEventListener('animationend', function(event) {
            
        })
        document.addEventListener('animationend', this._removeActiveClassHandler);
        //target.addEventListener('keyup', this._removeActiveClassHandler);
    }
    init() {
        this._activeHandler = this._activeHandler.bind(this);
        this._showInfo = this._showInfoAnimation.bind(this);
        this._enterEventHandler = this._enterEventHandler.bind(this);
        this._closeInfoHandler = this._closeInfoHandler.bind(this);
        this._removeActiveClassHandler = this._removeActiveClassHandler.bind(this);
        this.box.addEventListener('mousedown', this._activeHandler);
        this.box.addEventListener('keydown', this._enterEventHandler);
    }
}