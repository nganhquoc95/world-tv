const { loadData } = require('../../_data');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { code } = req.query;
    const { query } = req;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Country code is required'
      });
    }

    const data = loadData();
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 50;
    const skip = (page - 1) * limit;

    const allChannels = data.channels
      .filter(channel => channel.country === code.toUpperCase())
      .sort((a, b) => a.name.localeCompare(b.name));

    const total = allChannels.length;
    const paginatedChannels = allChannels.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      countryCode: code.toUpperCase(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      count: paginatedChannels.length,
      data: paginatedChannels
    });
  } catch (error) {
    console.error('Error fetching channels by country:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channels'
    });
  }
}
