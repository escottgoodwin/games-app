export const baseUrl = 'http://localhost:8000'

export async function postRequest(url, data){
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    });
    return await response.json(); 
  }

export async function getRequest(url){
  const response = await fetch(url)
  return await response.json()
}
  