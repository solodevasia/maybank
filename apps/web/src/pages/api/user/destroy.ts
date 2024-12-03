import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const result = await fetch(`http://localhost:4000/api/v1/user/${req.url?.split('user=')[1]}`,{
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${req.headers.cookie?.split('token=').join('')}`}
    }).then(async(resp) => await resp.json())
    res.status(result.status).json(result)
}