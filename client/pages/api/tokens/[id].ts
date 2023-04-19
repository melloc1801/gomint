import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;

    res.status(200).json({
      name: `GOMINT #${id}`,
      external_url: 'https://www.gomint.art',
      image: 'ipfs://QmYbnGqe6z7RhfMnC4yytf3U9pH6C5ohjHMcgQo1VWuLsC',
      animation_url: 'ipfs://QmNRAN2cupVWGdrGrzqS7LDm1QvAcSBe5zb8oWqPEajRKU',
    });
  }
}
