const { loadData } = require('./_data');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const data = loadData();
    const countries = data.countries.sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json({
      success: true,
      count: countries.length,
      data: countries
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch countries'
    });
  }
}
