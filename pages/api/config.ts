import type { NextApiRequest, NextApiResponse } from 'next';

export const apiConfig = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export const apiHandler = (handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>) => async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  // Only allow certain file types to be uploaded
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    const contentType = req.headers['content-type'];
    if (!contentType.includes('image/png') && !contentType.includes('image/jpeg') && !contentType.includes('image/jpg')) {
      res.status(400).json({ error: 'Invalid file type' });
      return;
    }
  }

  await handler(req, res);
};