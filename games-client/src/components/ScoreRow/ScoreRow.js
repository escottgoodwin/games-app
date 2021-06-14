import React from 'react'

export default function ScoreRow({
    name, 
    score, 
    color
   }){
     return(
       <tr>
         <td className={color}>
           {name}
           </td>
         <td className={color}>
           {score}
         </td>
       </tr>
     )
   }