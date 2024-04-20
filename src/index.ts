import * as core from '@actions/core';

import fs from 'fs';
import replaceSection from 'replace-section';
import { generateHtml } from './generate-html.js';

async function run() {
  try {
    const FARCASTER_USERNAME = core.getInput('FARCASTER_USERNAME', {
      required: true,
    });
    const NEYNAR_API_KEY = core.getInput('NEYNAR_API_KEY', { required: true });
    const DUNE_API_KEY = core.getInput('DUNE_API_KEY', { required: true });
    const code = await generateHtml({
      farcasterUsername: FARCASTER_USERNAME,
      neynarApiKey: NEYNAR_API_KEY,
      duneApiKey: DUNE_API_KEY,
    });

    const file = core.getInput('file');
    const readme = await fs.promises.readFile(file, 'utf8');
    const startWith = '<!-- replace-degen-sponsors -->';
    const endWith = startWith;
    await fs.promises.writeFile(
      file,
      replaceSection({
        input: readme,
        startWith,
        endWith,
        replaceWith: `${startWith}
${code}
${endWith}`,
      }),
      'utf-8',
    );
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

void run();