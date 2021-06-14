import React from 'react'

export default function SearchButton({
    text,
    handleSearch,
    styleClass,
}){
    return(
        <button onClick={handleSearch} className={styleClass}>
            {text}
        </button>
    )
}
