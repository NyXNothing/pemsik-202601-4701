// output di js

console.log("Saya Suka Kamu");

// lakukan: ctrl + shift + b untuk menjalankan file js di terminal
// lakukan: ctrl + shift + p 
// pilih: quokka: start current file

// variable 3 cara: var, let, const

const nama = "Irghy";
const nim = 'A11.2024.15858';
const umur = 19;
const nilai = [100, 100, 100, 100, 100];

// console.log(nama);
// console.log(nim);
// console.log(umur);
// console.log(nilai);

// konsep es6 pertama

// cara literal outpu , ngoding output dnegan keindahan
console.log(`Nama saya ${nama}, nim saya ${nim}, umur saya ${umur} tahun, dan nilai ${nilai}`);

//  kosnep es6 kedua
// function cara keindahan
const data_diri = (nama, nim, umur, nilai) => (`Nama saya ${nama}, nim saya ${nim}, umur saya ${umur} tahun, dan nilai ${nilai}`);

console.log(data_diri(nama, nim, umur, nilai));

// cara lama function
function penjumlahan(bil1, bil2) {
    return bil1 + bil2;
}   

const penjumalah2 = (bil1, bil2) => bil1 + bil2;

console.log(penjumlahan(10, 20));
console.log(penjumalah2(10, 20));