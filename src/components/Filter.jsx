import React from 'react'

const Filter = ({nameSearch, handleNameSearch}) => {
  return (
    <div >
        <input 
        value={nameSearch}
        onChange={handleNameSearch}
        placeholder="search name or exact phone number"
        className="mt-4 form-label border border-blue-400 rounded-md w-full"/>
        
        
      
    </div>
  )
}

export default Filter