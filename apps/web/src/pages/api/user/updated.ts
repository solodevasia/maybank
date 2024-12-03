import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const result = await fetch(`http://localhost:4000/api/v1/user/${req.url?.split('user=')[1]}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${req.headers.cookie?.split('token=').join('')}`
        },
        body: req.body
    }).then(async(resp) => await resp.json())
    res.status(result.status).json(result)
}