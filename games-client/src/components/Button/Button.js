import React from 'react'

export default function SearchButton({
    handleSearch,
    loading,
    styleClass
}){
    return(
        <button onClick={handleSearch} className={styleClass}>
            {loading ? 'Searching' : 'Submit'}
        </button>
    )
}
