// Bedah data JSON: array dan object

// array
const nilai = [100, 100, 100, 100, 100];

// destructurin array = membedah data array
const nilai2 = nilai[1]; //ambil data ke 2, berarti index ke 1
console.log(`Nilai ke 2 dari array:${nilai2}`);

// spread array = nambah / kurangi data array
const nilai_new = [99];
const array_nilai = [...nilai_new, nilai]; // ini mau menambahkan
const tambah_dibelakang = [nilai, ...nilai_new]; // ini mau menambahkan

console.log(`Kumpulan Array nilai baru: ${array_nilai}`);
console.log(`Nilai ditambah di belakang: ${tambah_dibelakang}`);

// ====================================================================

// object
const mhs ={
    nama: "Irghy",
    umur: 19,
    nilai: [100, 100, 100, 100, 100]
}

// destructuring object = membedah data object
const nama_mhs = mhs.nama; //ambil value dari key nama, dari objcet mhs
const{ nama, umur, nilaiku} = mhs; // langsung buat banyak dari banyak key

console.log(`Nama saya ${nama_mhs}, umur saya ${umur}, dan nilai saya ${nilai}`);

// spread object = tambah data ke object keyv_value ke objcet

const  nim={nim: "A11.2024.15858"};

const new_mhs = {
    ...nim,
    ...mhs,
};

console.log(new_mhs);

// array of object = artinya kumpulan object dalam array
const list_mhs = [
    {
        nama: "Irghy",
        umur: 19,
    },
    {
        nama: "memet",
        umur: 20,
    }
]    

//  adestruncturing array of objcet
const mhs_kedua = list_mhs[1].nama;

console.log(mhs_kedua);

// spread, tambah object ke array of object
const mhs_anyar = {
    nama: "Joko",
    umur: 21,
};

const list_mhs_anyar = [...list_mhs, mhs_anyar];

console.log(list_mhs_anyar);