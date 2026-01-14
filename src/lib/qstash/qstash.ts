import { Client } from '@upstash/qstash';
import { QSTASH_TOKEN } from 'astro:env/server';

const qstash = new Client({ token: QSTASH_TOKEN });

export default qstash;
