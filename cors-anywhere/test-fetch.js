(async ()=>{
  try {
    const res = await fetch('http://localhost:8080/https://api.deezer.com/chart', {
      headers: { origin: 'http://localhost:5173' }
    });
    console.log('Status:', res.status);
    console.log('Headers:');
    for (const [k,v] of res.headers) console.log(k+':', v);
    const txt = await res.text();
    console.log('---BODY START---');
    console.log(txt.slice(0,2000));
    console.log('---BODY END---');
  } catch (err) {
    console.error('Fetch error:', err);
    process.exit(1);
  }
})();
