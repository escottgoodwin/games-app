import React from 'react'

export default function Error({error,message}){
    return(
        <div>
            {error && 
                <h4 className="loser">
                    {message}
                </h4>
            }
        </div>
    )
}