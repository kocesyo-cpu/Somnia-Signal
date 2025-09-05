import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function fetchAssets() {
      const { data } = await supabase
        .from('assets')
        .select('*')
        .order('timestamp', { ascending: false });
      setAssets(data);
    }
    fetchAssets();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Somnia Signal – Free Tier</h1>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Owner</th>
            <th>Last Price</th>
            <th>Tx Hash</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(a => (
            <tr key={a.id}>
              <td>{a.type}</td>
              <td>{a.name}</td>
              <td>{a.owner}</td>
              <td>{a.last_price}</td>
              <td>{a.tx_hash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
