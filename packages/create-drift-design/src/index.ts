#!/usr/bin/env node

import { runInitCommand } from "./commands/init.js";

runInitCommand(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n[create-drift-design] ${message}`);
  process.exit(1);
});
