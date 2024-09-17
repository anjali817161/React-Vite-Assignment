import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import MyDataTable from './component/MyTable'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="App">
    <h1>PrimeReact DataTable with Server-Side Pagination</h1>
    <MyDataTable />
</div>
  )
}

export default App
