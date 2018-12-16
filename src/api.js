const API_BASE = "./api";

function request(suburl, body=null)
{
    const url = `${API_BASE}${suburl}`;
    const haveBody = body !== null;
    
    return fetch(url,
        {
            method: haveBody ? "POST" : "GET",
            body: haveBody ? JSON.stringify(body) : null,
            mode: "cors", //FIXME: change to sameorigin
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

export async function isApiAvailable()
{
    try
    {
        const response = await request("/");
        
        return response.status == 200;
    }
    catch(err)
    {
        return false;
    }
}

export async function saveList(list)
{
    const response = await request("/new", list);
    
    return (await response.json());
}

export async function getList(key)
{
    const response = await request(`/get/${key}`);
    
    return response.json();
}

window.getList = getList;
