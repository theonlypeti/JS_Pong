const lpad = document.getElementById("lpad");
const rpad = document.getElementById("rpad");
const lscore = document.getElementById("lscore");
const rscore = document.getElementById("rscore");
let lpoints = 0;
let rpoints = 0;
let angle = 0;
const maxy = window.innerHeight - lpad.offsetHeight;
const arrow = document.getElementById("pullarrow")

const ball = document.getElementById("ball");
lscore.innerText = lpoints;
rscore.innerText = rpoints;

window.onmousemove = function(event) {

    lpadd.update(event);
    lpadd.draw();
    rpadd.update(event);
    rpadd.draw();

    if (ballobj.stopped) {
        console.log(parseInt(arrow.style.top), event.clientY, parseInt(arrow.style.left), event.clientX)
        arrow.style.rotate = Math.atan2(parseInt(arrow.style.top)-event.clientY, parseInt(arrow.style.left) - event.clientX)*180/Math.PI + 270 + "deg";
        arrow.style.height = Math.min(200,Math.sqrt(Math.pow(parseInt(arrow.style.top)-event.clientY,2) + Math.pow(parseInt(arrow.style.left) - event.clientX,2))) + "px";
    }
    // console.log(arrow.style.rotate)
}

function main(){
    ballobj.update();
    ballobj.draw();
}
window.setInterval(main,1)

class Paddle{
    constructor(elem,x,y) {
        this.x = x;
        this.y = y;
        this.height = elem.offsetHeight;
        this.elem = elem;
    }
    update(event) {
        this.y = Math.min(Math.max(0,event.clientY),maxy);
    }
    draw() {
        this.elem.style.top = this.y + "px";
    }

    collision(ball) {
        if (ball.y > this.y && ball.y < this.y + this.height) {
            return this.y + this.height / 2 - ball.y;
        }
        return NaN;
    }

}

class Ball {
    constructor(x, y, vx, vy, ball) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ball = ball;
        this.stopped = false;
        this.ball.style.visibility = "visible";
    }

    stop() {
        this.vx = 0;
        this.vy = 0;
        this.x = 0;
        this.y = -100
        this.stopped = true;
        this.ball.style.visibility = "hidden";

    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        // console.log(this.x,lpad.offsetWidth)
        // console.log(lpadd.elem.offsetWidth, this.x,rpadd.x + rpadd.elem.offsetWidth)
        // console.log((lpadd.x + lpadd.elem.offsetWidth > this.x),!(this.x < rpadd.x + rpadd.elem.offsetWidth))
        if(((lpadd.x + lpadd.elem.offsetWidth > this.x) || !(this.x < rpadd.x - rpadd.elem.offsetWidth)) && !this.stopped){
            if(lpadd.x + lpadd.elem.offsetWidth > this.x)
                {
                    angle = lpadd.collision(ballobj)
                }
            else if(this.x > rpadd.x - rpadd.elem.offsetWidth)
                {
                    angle = rpadd.collision(ballobj)
                }
            else{
                angle = NaN;
            }
            if (!isNaN(angle)){
                this.vx *= -1;
                this.vy = -( angle / 40);
            }
            else{
                if(ballobj.x < 0){
                    rpoints += 1;
                    rscore.innerText = rpoints;
                    rscore.classList.remove("anim")
                    void rscore.offsetWidth
                    rscore.classList.add("anim")
                    this.stop()
                }else if(ballobj.x > window.innerWidth){
                    lpoints += 1;
                    lscore.innerText = lpoints;
                    lscore.classList.remove("anim")
                    void lscore.offsetWidth
                    lscore.classList.add("anim")
                    this.stop()
                }
            }
        }
        if (this.y > window.innerHeight || this.y < 0) {
            this.vy *= -1;
        }
    }
    draw() {
        ball.style.left = this.x + "px";
        ball.style.top = this.y + "px";
    }
}

ballobj = new Ball(window.outerWidth/2, window.outerHeight/2, -2, 1, ball);
ballobj.stop();

lpadd = new Paddle(lpad,0,0);
rpadd = new Paddle(rpad,window.innerWidth - rpad.offsetWidth,0);

let startpos = 0;
window.onmousedown = function(event) {
    startpos = event
    document.getElementById("tutorial").style.visibility = "hidden";
    if (ballobj.stopped){
        startarrow(event)
    }
}


window.onmouseup = function(event) {
    if (ballobj.stopped){
        if (Math.abs(startpos.clientX - event.clientX) > 50) {
        ballobj = new Ball(startpos.clientX, startpos.clientY,
            Math.max(Math.min((startpos.clientX - event.clientX)/10,2),-2), Math.max(Math.min((startpos.clientY - event.clientY)/50,2),-2), ball);
        }
        arrow.style.visibility = "hidden";
    }
}

function startarrow(event){
    arrow.style.left = event.clientX + "px";
    arrow.style.top = event.clientY + "px";
    arrow.style.visibility = "visible";
    console.log(arrow.style.top, arrow.style.left)
}