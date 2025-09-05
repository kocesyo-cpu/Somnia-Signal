import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUBGRAPH_URL = 'https://subgraph.somnia.network/graphql';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const query = `
{
  transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    id
    from
    to
    value
    token {
      id
      name
      type
    }
    blockTimestamp
  }
}
`;

async function fetchData() {
  try {
    const response = await axios.post(SUBGRAPH_URL, { query });
    const transfers = response.data.data.transfers;

    const assets = transfers.map(tx => ({
      id: tx.id,
      type: tx.token.type,
      name: tx.token.name,
      owner: tx.to,
      last_price: parseFloat(tx.value),
      tx_hash: tx.id,
      timestamp: new Date(parseInt(tx.blockTimestamp) * 1000)
    }));

    const { data, error } = await supabase.from('assets').upsert(assets);
    if (error) console.error('Supabase Error:', error);
    else console.log('Assets saved:', data);

  } catch (err) {
    console.error('Error fetch subgraph:', err);
  }
}

fetchData();
