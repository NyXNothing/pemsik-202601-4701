import Menyapa from "./Menyapa";

function Biodata({nama,nim}){
  return <> 
  <table border="1">
    <tr>
      <td>Nama</td>
      <td>NIM</td>
    </tr>
    <tr>
      <td>{nama}</td>
      <td>{nim}</td>
    </tr>
  </table>
  </>
}


function App() {
  return (
    <>
      <Menyapa/>
      <Biodata nama="kasrung" nim="15858" />
    </>
  )
}

export default App;