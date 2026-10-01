const fetchGET = async(url) =>{
    const response = await fetch(process.env.API_URL + url,{
        method:'GET',
        headers:{
            'Content-Type': 'application/json'
        },
    });

    console.log(response);

    const data = await response.json();
    return data;
}

const fetchPOST = async(url, body) =>{
    const response = await fetch(url,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
    });

    const data = await response.json();
    return data;
}

module.exports = {
    fetchGET,
    fetchPOST
}