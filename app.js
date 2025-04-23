const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Lead Searcher</h1>
    <input type="text" placeholder="Search businesses..." className="border p-2 mb-4 w-full" id="searchInput" />
    <div id="loader" className="hidden">Loading...</div>
    <table id="results" className="w-full border-collapse"></table>
    <div id="pagination"></div>
    <button id="downloadCsv" className="bg-blue-500 text-white p-2 mt-4">Download CSV</button>
  </div>
);

document.getElementById('searchInput').addEventListener('change', async (e) => {
  const query = e.target.value;
  const loader = document.getElementById('loader');
  const resultsTable = document.getElementById('results');
  loader.classList.remove('hidden');
  resultsTable.innerHTML = '';
  try {
    const response = await fetch(`/api/proxy?url=https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&radius=5000&key=AIzaSyCgs-CDi8cZS1pwvJy_ZKB43yFAgdU8yMo`);
    const data = await response.json();
    if (data.status !== "OK") {
      throw new Error(data.status);
    }
    loader.classList.add('hidden');
    data.results.slice(0, 10).forEach(business => {
      const row = document.createElement('tr');
      row.innerHTML = `<td class="border p-2">${business.name}</td><td class="border p-2">${business.formatted_phone_number || 'N/A'}</td>`;
      resultsTable.appendChild(row);
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    loader.classList.add('hidden');
    resultsTable.innerHTML = '<tr><td colspan="2" class="border p-2 text-red-500">Error fetching data. Please try again.</td></tr>';
  }
});
