#!/usr/bin/env node

import readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';

const ASCII_ART = `
██████╗ ██╗     ██╗   ██╗███████╗██████╗ ██████╗ ██╗███╗   ██╗████████╗ █████╗ ██╗
██╔══██╗██║     ██║   ██║██╔════╝██╔══██╗██╔══██╗██║████╗  ██║╚══██╔══╝██╔══██╗██║
██████╔╝██║     ██║   ██║█████╗  ██████╔╝██████╔╝██║██╔██╗ ██║   ██║   ███████║██║
██╔══██╗██║     ██║   ██║██╔══╝  ██╔═══╝ ██╔══██╗██║██║╚██╗██║   ██║   ██╔══██║██║
██████╔╝███████╗╚██████╔╝███████╗██║     ██║  ██║██║██║ ╚████║   ██║   ██║  ██║██║
╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝
`;

console.log(chalk.cyanBright.bold(ASCII_ART));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(chalk.yellow('⚡ Enter your BlueprintAI Sync ID: '), async (syncId) => {
  const id = syncId.trim();
  if (!id) {
    console.log(chalk.red('Error: Sync ID cannot be empty.'));
    rl.close();
    return;
  }

  const spinner = ora('Establishing secure A2A connection...').start();

  try {
    let response;
    
    // Attempt local first, fallback to production
    try {
      response = await fetch(`http://localhost:3000/api/agent-sync?blueprint_id=${id}`);
      // If local returns 404 on the fetch level (meaning server running but no endpoint), it won't throw. 
      // But if fetch itself throws (server off), we catch it.
    } catch (localError) {
      response = await fetch(`https://blueprintagent.dev/api/agent-sync?blueprint_id=${id}`);
    }

    if (!response.ok) {
      let errorMessage = 'Network error occurred.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || \`HTTP Error \${response.status}\`;
      } catch (e) {
        errorMessage = \`HTTP Error \${response.status}\`;
      }
      spinner.fail(chalk.red(errorMessage));
      rl.close();
      return;
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.agent_directives) {
      spinner.fail(chalk.red('Failed to parse successful response from server.'));
      rl.close();
      return;
    }

    const directives = data.agent_directives;
    
    // Write directives locally to .clinerules
    await fs.writeFile('.clinerules', directives, 'utf8');

    spinner.succeed(chalk.green('✔ A2A Configuration Locked. Your local AI is now synced with BlueprintAI.'));
    
  } catch (error) {
    spinner.fail(chalk.red(\`Fatal Error: \${error.message}\`));
  } finally {
    rl.close();
  }
});
