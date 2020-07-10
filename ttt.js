'use strict';

class Render {

    init(game){


        this.game=game;
        this.initEventHandlers();

    }

    render(type) {
        for (let i = 0; i < 3; i++) {
            let tr = document.createElement('tr');
            this.game.gameTable.appendChild(tr);
            for (let j = 0; j < 3; j++) {
                let td = document.createElement('td');
                //td.innerText="row="+j+' col'+i;
                td.dataset.row = i.toString();
                td.dataset.col = j.toString();
                if (type == 1) {
                    //put background color;
                    //render array
                    td.innerText = this.game.mapValues[i][j];
                    this.game.path.forEach(function (item) {
                            if ((item[0]==i) && (item[1]==j)){
                            td.setAttribute('style', 'background-color:magenta;');
                        }
                    })

                }
                this.game.gameTable.appendChild(td);
            }
        }
    }

    clear(){//it doesnt work
        document.getElementById("gam").deleteRow(0);
        document.getElementById("gam").deleteRow(0);
        document.getElementById("gam").deleteRow(0);
        ///document.location.reload(true);
    }

    initEventHandlers(){
      this.game.gameTable.addEventListener('click',event=>this.cellClick(event));
    }

    isCorrect(event){
      return this.game.isStatusPlay() && this.isClickByCell(event) && this.isCellEmpty(event);
    }

    cellClick(event){
        if(!this.isCorrect(event)){
            return;
        }
        this.fillCell(event);

        if (this.game.hasWon()){
            this.game.setStatus('stop');
            let message=this.game.winner+ ' win! '+this.game.path;
            alert(message);
            console.log(this.game.path);

           // this.clear();
            this.render(1);

        }
        if (this.game.hasTie()){
            this.game.setStatus('stop');
            let message='Tie!';
            alert(message);
        }
        this.game.togglePhase();
    }

    fillCell(event){
        let row = +event.target.dataset.row;
        let col = +event.target.dataset.col;
        this.game.mapValues[row][col] = this.game.phase;
        event.target.textContent = this.game.phase;

    }

    isClickByCell(event){
        return event.target.tagName==='TD';
    }

    isCellEmpty(event){
        let row = +event.target.dataset.row;
        let col = +event.target.dataset.col;
        return this.game.mapValues[row][col] === '';
    }

}

class Game {

    constructor() {
        this.gameTable=document.getElementById('gam');
       this.status='';
       this.mapValues=[
            ["","",""],
            ["","",""],
            ["","",""],
        ];
       this.phase='X';
       this.winner='';
       this.path=[[0,0],[0,0],[0,0]];
    }

    init(render){
        this.render = render;
    }



    isStatusPlay(){
        return this.status === 'play';
    }

    setStatus(status){
        this.status=status;
    }

    togglePhase(){
        if (this.phase==="X"){
            this.phase='O';
        }else{
            this.phase='X';
        }
    }

    hasTie(){
        let Tie=1;
        this.mapValues.forEach(function (item) {
            item.forEach(function (item) {
                if (item == '') {
                    Tie=0;
                };
            });

        });
        return Tie;
    }

    hasWon() {
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 3; i++) {
                if (this.checkLines(j, i) == true) {
                    return true;
                }
            }
        }
        return false;
    }

    checkLines(dir,row){
        let i =0;
        let Xcnt=0;
        let Ocnt=0;
        let el='';
        while (i<3)
        {
            switch (dir) {
                case 0:
                    el=this.mapValues[row][i];
                    this.path[i][0]=row;
                    this.path[i][1]=i;
                    break;
                case 1:
                    el=this.mapValues[i][row];
                    this.path[i][0]=i;
                    this.path[i][1]=row;
                    break;
                case 2:
                    el=this.mapValues[i][i];
                    this.path[i][0]=i;
                    this.path[i][1]=i;
                    break;
                case 3:
                    el=this.mapValues[2-i][i];
                    this.path[i][0]=2-i;
                    this.path[i][1]=i;
                    break;
            };

            if (el === '') {
                return false;
            } else{
                if (el ==='X'){
                    Xcnt++;
                } else {Ocnt++};
            }
            i++;
        }
        if (Xcnt==3) {
            this.winner='Xs';
            return true;
        }
        if (Ocnt==3) {
            this.winner='Os';
            return true;
        }
        return false;
    }
};


window.addEventListener('load', () => {
    //render - все что связано с html отрисовка + обработка клика
    const render = new Render();
    // game - все остальное, данные состояния проверки тп тд
    const game = new Game();

    game.init(render);
    render.init(game);

    render.render(0);

    game.setStatus('play');

});