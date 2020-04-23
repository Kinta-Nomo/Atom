
// window.addEventListener('load', function(){

'use strict';

let scene = [];

function setup(){
    createCanvas(400, 400);
    background(0);
}

function draw(){
    for (let element of scene){
        stroke(255);
        strokeWeight(5);
        noFill();
        rect(element.group*10, element.period*10, 10, 10);
    }
}

const azimuthal = ['s', 'p', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'q', 'r', 't', 'u', 'v', 'w', 'x', 'y', 'z']

class Atom {
    constructor(atomic_number = 1) {

        this.atomic_number = (atomic_number <= 0) ? 1 : atomic_number;

        this.charge = 0;

        this.protons = this.atomic_number;
        this.neutrons = this.atomic_number;

        this.electrons;
        
        this.period;
        this.group;
        this.updateElectron();

        this.atomic_mass = this.protons * 1.00727661 + this.neutrons * 1.00866520;
    }
}
Atom.prototype.updateElectron = function() {
    /* アウフバウ原理に基づいて電子を満たしていく */

    this.electrons = {}; // 自身の原子変数を空にする
    let electrons_buffer = this.protons - this.charge; // 残った電子のバッファ
    let electrons_buffer_absolute = this.protons; // 残った電子のバッファ

    let i = 0;
    while (true) { // 電子バッファが負数になればループが止まる

        const shell_index = Math.floor(i/2+1); 

        for (let j = 0; j < shell_index; j++) {

            const sub_shell_name_index = shell_index - j - 1; // サブ殻のアルファベット部分のインデックス
            const sub_shell_num = j+(Math.floor((i+1)/2))+1; // サブ殻の数字
            const sub_shell = sub_shell_num + azimuthal[sub_shell_name_index]; // サブ殻ストリング

            const shell_name = String.fromCharCode(74+sub_shell_num) // 殻ストリング

            if (!this.electrons[shell_name]) {
                this.electrons[shell_name] = {};
            }
            if (!this.electrons[shell_name][sub_shell]) {
                this.electrons[shell_name][sub_shell] = 0;
            }

            electrons_buffer -= (2 + (sub_shell_name_index*4))
            electrons_buffer_absolute -= (2 + (sub_shell_name_index*4))

            
            if (electrons_buffer_absolute <= 0){
                this.electrons[shell_name][sub_shell] += (2 + (sub_shell_name_index*4)) - (Math.abs(electrons_buffer));
                let outermost_electrons = 0;
                for (let temp of Object.keys(this.electrons[Object.keys(this.electrons)[Object.keys(this.electrons).length-1]])){
                    outermost_electrons += this.electrons[Object.keys(this.electrons)[Object.keys(this.electrons).length-1]][temp]
                }
                console.log(outermost_electrons)
                console.log(sub_shell_num)
                this.period = sub_shell_num-1;
                this.group = outermost_electrons;

                this.electrons[shell_name][sub_shell] -= (2 + (sub_shell_name_index*4)) - (Math.abs(electrons_buffer));
            }

            if (electrons_buffer <= 0) {
                this.electrons[shell_name][sub_shell] += (2 + (sub_shell_name_index*4)) - (Math.abs(electrons_buffer));
                return;
            }else {
                this.electrons[shell_name][sub_shell] += (2 + (sub_shell_name_index*4));
            }
        }
        i++;
    }
}
Atom.prototype.modifyCharge = function(n){
    if (this.charge + n < this.protons){
        this.charge += n;
        this.updateElectron();
        return;
    }
    return false;
}

// })