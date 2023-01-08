const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');
const { Client,LocalAuth  } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer:{headless: true, exheadless: true, executablePath: 'usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox']}
});

let kaynak = '12813108039@c.us';

const numaralar = [
    '12813108039@c.us',     // Furkan PARLAK
    '905071177117@c.us',    // Oktay DURMAZ
    '905536312900@c.us',    // Z�ht� G�REN
    '905424351516@c.us',    // Niyazi G�NEY
    '905336358317@c.us'    // Mesut KAMI�LI
];

const yemek = ["", "", "", "", "", "", "", "", "", "", "", ""];
const yemekTalepleri = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const payload = [" ", " ", " ", " ", " ", " "];
const savePoint = [];
const brakePoint = [];

let yemekIstekFlag = false;
let savePointIndex = 0;
let brakePointIndex = 0;
let brakeFlag = false;

const kisiler = [{
    name: "Furkan",
    surname: "Parlak",
    number: "12813108039@c.us",
    foodStatus: 0,
    mainFood: "",
    soup: "",
    rices: "",
    salad: ""
},{
    name: "Niyazi",
    surname: "Guney",
    number: "905424351516@c.us",
    foodStatus: 0,
    mainFood: "",
    soup: "",
    rices: "",
    salad: ""
},{
    name: "Oktay",
    surname: "Durmaz",
    number: "905071177117@c.us",
    foodStatus: 0,
    mainFood: "",
    soup: "",
    rices: "",
    salad: ""
},{
    name: "Zuhtu",
    surname: "Guren",
    number: "905536312900@c.us",
    foodStatus: 0,
    mainFood: "",
    soup: "",
    rices: "",
    salad: ""
},{
    name: "Mesut",
    surname: "Kamisli",
    number: "905336358317@c.us",
    foodStatus: 0,
    mainFood: "",
    soup: "",
    rices: "",
    salad: ""
}];

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Cihaz Hazir!');
    mesajiYolla(kisiler[0].number, "Device is Ready!")
});

client.on('message', message => {
    if (message.from == kaynak) {
        console.log('Mesaj Geldi');
        if ((Array.from(message.body)[0] + Array.from(message.body)[1] + Array.from(message.body)[2] + Array.from(message.body)[3] + Array.from(message.body)[4] == "Lezze")) {
            for (let i = 0; i < message.body.length; i++) {
                console.log(i + " - " + Array.from(message.body)[i] + " " + Array.from(message.body)[i].charCodeAt(0));
                if (Array.from(message.body)[i] == ">") {
                    savePoint[savePointIndex] = i;
                    brakeFlag = true;
                    savePointIndex++;
                }
                if (Array.from(message.body)[i].charCodeAt(0) == 10 && brakeFlag) {
                    brakePoint[brakePointIndex] = i;
                    brakePointIndex++;
                    brakeFlag = false;
                }
            }
            console.log("YAZMA YERI");
            for (let x = 0; x < savePointIndex; x++) {
                yemek[x] = "";
                for (let y = savePoint[x] + 2; y < brakePoint[x]; y++) {
                    yemek[x] += Array.from(message.body)[y];
                }
                console.log("[ " + x + " ] - " + yemek[x]);
            }
            payloadDoldur();
            yemekIstekFlag = true;
            for (let hh = 0; hh < 1; hh++) {
                mesajiYolla(kisiler[hh].number, payload[0]);
                mesajiYolla(kisiler[hh].number, payload[1]);
                kisiler[hh].foodStatus = 0;
            }
        }
    }
    if (message.body === '!yemek') {
        if (yemekIstekFlag) {
            for (let i = 0; i < numaralar.length; i++) {
                if (numaralar[i] == message.from) {
                    //yemekTalepleri[i] = 0;
                    mesajiYolla(numaralar[i], payload[0]);
                    mesajiYolla(numaralar[i], payload[1]);
                }
            }
        } else {
            mesajiYolla(message.from, "Yemek saati gecti");
        }
            //console.log("message",message)
            //client.sendMessage('12813108039@c.us', "Oldu");
    }
    if (message.body === '!tamam') {
        if (yemekIstekFlag) {
            for (let i = 0; i < numaralar.length; i++) {
                if (numaralar[i] == message.from) {
                    yemekTamamla();
                }
            }
        } else {
            mesajiYolla(message.from, "Yemek saati gecti");
        }
        //console.log("message",message)
        //client.sendMessage('12813108039@c.us', "Oldu");
    }
    for (let hh = 0; hh < kisiler.length; hh++) {
        if (message.from == kisiler[hh].number && yemekIstekFlag) {
            console.log(kisiler[hh].name + " Mesaj Yazdi.");
        }// Yemek Talep D���

    }
    
});

setInterval(myTimer, 1000*60);

function mesajiYolla(numara, mesaj) {
    client.sendMessage(numara, mesaj);
    console.log(numara + " Numaraya - " + mesaj + " gonderildi.")
}
function myTimer() {
    const d = new Date();
    //console.log(d.toLocaleTimeString());
    console.log(d.getHours() + " " + d.getMinutes());
    if (d.getHours() == 11 && d.getMinutes() > 15) {
        yemekTamamla();
    }
}

function yemekTamamla() {
    if (yemekIstekFlag) {
        yemekIstekFlag = false;
        let mes = "";
        for (let i = 0; i < yemekTalepleri.length-1; i++) {
            if (yemekTalepleri[i] > 0) {
                mes += yemekTalepleri[i] + " ad " + yemek[i];
                mes += String.fromCharCode(10);
            }
        }
        mesajiYolla(kaynak, mes);
    }
}
function payloadDoldur() {
    payload[0] = " ";
    payload[1] = " ";
    payload[2] = " ";
    payload[3] = " ";
    payload[4] = " ";
    payload[5] = " ";
    payload[0] += "Ana Yemekler";
    payload[0] += String.fromCharCode(10);
    payload[0] += "- " + yemek[0];
    payload[0] += String.fromCharCode(10);
    payload[0] += "- " + yemek[1];
    payload[0] += String.fromCharCode(10);
    payload[0] += "- " + yemek[2];
    payload[0] += String.fromCharCode(10);
    payload[0] += "- " + yemek[3];
    payload[0] += String.fromCharCode(10);
    payload[0] += "Corbalar";
    payload[0] += String.fromCharCode(10);
    payload[0] += "-  " + yemek[4];
    payload[0] += String.fromCharCode(10);
    payload[0] += "-  " + yemek[5];
    payload[0] += String.fromCharCode(10);
    payload[0] += "Pilavlar";
    payload[0] += String.fromCharCode(10);
    payload[0] += "-   " + yemek[6];
    payload[0] += String.fromCharCode(10);
    payload[0] += "-   " + yemek[7];
    payload[0] += String.fromCharCode(10);
    payload[0] += "-   " + yemek[8];
    payload[0] += String.fromCharCode(10);
    payload[0] += "Salatalar";
    payload[0] += String.fromCharCode(10);
    payload[0] += "-    " + yemek[9];
    payload[0] += String.fromCharCode(10);
    payload[0] += "-    " + yemek[10];
    payload[0] += String.fromCharCode(10);
    payload[0] += "-    " + yemek[11];
    payload[1] += "Ana Yemekler";
    payload[1] += String.fromCharCode(10);
    payload[1] += "[ 1 ] " + yemek[0];
    payload[1] += String.fromCharCode(10);
    payload[1] += "[ 2 ] " + yemek[1];
    payload[1] += String.fromCharCode(10);
    payload[1] += "[ 3 ] " + yemek[2];
    payload[1] += String.fromCharCode(10);
    payload[1] += "[ 4 ] " + yemek[3];
    payload[1] += String.fromCharCode(10);
    payload[1] += "[ 5 ] " + "   Ana Yemegi Rastgele Gonder.";
    payload[1] += String.fromCharCode(10);
    payload[1] += "[ 7 ] " + "   BUTUN MENUYU KARISIK GONDER.";
    payload[1] += String.fromCharCode(10);
    payload[1] += "[ 0 ] " + "   *ISTEMIYORUM.*";
    payload[1] += String.fromCharCode(10);
    payload[1] += "Secmek istediginiz yemegin numarasini yaziniz.";
    payload[2] += "Corbalar";
    payload[2] += String.fromCharCode(10);
    payload[2] += "[ 1 ] " + yemek[4];
    payload[2] += String.fromCharCode(10);
    payload[2] += "[ 2 ] " + yemek[5];
    payload[2] += String.fromCharCode(10);
    payload[2] += "[ 5 ] " + "   RASTGELE GONDER.";
    payload[2] += String.fromCharCode(10);
    payload[2] += "[ 0 ] " + "   *ISTEMIYORUM.*";
    payload[2] += String.fromCharCode(10);
    payload[2] += "Secmek istediginiz yemegin numarasini yaziniz.";
    payload[3] += "Pilavlar";
    payload[3] += String.fromCharCode(10);
    payload[3] += "[ 1 ] " + yemek[6];
    payload[3] += String.fromCharCode(10);
    payload[3] += "[ 2 ] " + yemek[7];
    payload[3] += String.fromCharCode(10);
    payload[3] += "[ 3 ] " + yemek[8];
    payload[3] += String.fromCharCode(10);
    payload[3] += "[ 5 ] " + "   RASTGELE GONDER.";
    payload[3] += String.fromCharCode(10);
    payload[3] += "[ 0 ] " + "   *ISTEMIYORUM.*";
    payload[3] += String.fromCharCode(10);
    payload[3] += "Secmek istediginiz yemegin numarasini yaziniz.";
    payload[4] += "Salatalar";
    payload[4] += String.fromCharCode(10);
    payload[4] += "[ 1 ] " + yemek[9];
    payload[4] += String.fromCharCode(10);
    payload[4] += "[ 2 ] " + yemek[10];
    payload[4] += String.fromCharCode(10);
    payload[4] += "[ 3 ] " + yemek[11];
    payload[4] += String.fromCharCode(10);
    payload[4] += "[ 5 ] " + "   RASTGELE GONDER.";
    payload[4] += String.fromCharCode(10);
    payload[4] += "[ 0 ] " + "   *ISTEMIYORUM.*";
    payload[4] += String.fromCharCode(10);
    payload[4] += "Secmek istediginiz yemegin numarasini yaziniz.";
    payload[5] += "Eger ekmek istiyorsaniz *1* yazmaniz yeterli. Istemiyorsaniz mesaji dikkate almayin."
    payload[5] += String.fromCharCode(10);
    payload[5] += "Talebini duzenlemek isterseniz. *!yemek* yaziniz.";
}

 

client.initialize();
 
