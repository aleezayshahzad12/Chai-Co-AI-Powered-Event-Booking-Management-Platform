import { useState } from 'react'
import SavedUserForms from './components/SavedUserForms';

function App() {
  const [chosenForms, setchosenForms] = useState(null)
  const [clicked, setClicked] = useState('')

  return (
    <div className="min-h-screen bg-pink-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SavedUserForms 
          setchosenForms={setchosenForms} 
          setClicked={setClicked} 
        />
      </main>
    </div>
  )
}

export default App