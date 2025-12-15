#!/usr/bin/env node

/**
 * Script to show a summary of lint errors by project
 * Usage: node tools/lint-summary.js
 */

const { execSync } = require('child_process');

// Projects to check (apps and libs)
const projects = [
  'web',
  'ai-gateway',
  'wallet',
  'data-hooks',
  'trading-charts',
  'shared-utils',
  'export-services',
  'ai-config',
  'rag-services',
];

function runLintForProject(projectName) {
  try {
    const output = execSync(`nx lint ${projectName}`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    // Check if the project is being ignored
    if (
      output.includes('All files matching the following patterns are ignored')
    ) {
      return {
        success: true,
        project: projectName,
        ignored: true,
      };
    }

    return { success: true, project: projectName };
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || error.message;

    // Check if it's only a warning about ignored files
    if (
      errorOutput.includes(
        'All files matching the following patterns are ignored'
      )
    ) {
      return {
        success: true,
        project: projectName,
        ignored: true,
      };
    }

    // Extract only the relevant lines from the error
    const errorLines = errorOutput
      .split('\n')
      .filter((line) => {
        // Filter out Nx progress lines
        return (
          !line.includes('NX') &&
          !line.includes('Running target') &&
          !line.includes('Linting') &&
          line.trim().length > 0
        );
      })
      .slice(0, 10); // First 10 relevant lines

    return {
      success: false,
      project: projectName,
      error: errorLines.join('\n') || errorOutput.substring(0, 200),
    };
  }
}

function runLintSummary() {
  console.log('🔍 Analyzing lint errors...\n');
  console.log(`Checking ${projects.length} projects...\n`);

  const results = projects.map((project) => runLintForProject(project));

  const projectsWithErrors = results.filter((r) => !r.success);
  const projectsSuccessful = results.filter((r) => r.success && !r.ignored);
  const projectsIgnored = results.filter((r) => r.ignored);

  if (projectsWithErrors.length === 0) {
    console.log('✅ No lint errors found!\n');

    if (projectsSuccessful.length > 0) {
      console.log(`✅ ${projectsSuccessful.length} projects with no errors:\n`);
      projectsSuccessful.forEach(({ project }) => {
        console.log(`   ✓ ${project}`);
      });
      console.log('');
    }

    if (projectsIgnored.length > 0) {
      console.log(
        `ℹ️  ${projectsIgnored.length} projects ignored (no files for lint):\n`
      );
      projectsIgnored.forEach(({ project }) => {
        console.log(`   ⊘ ${project}`);
      });
      console.log('');
    }

    return;
  }

  console.log(`❌ Found errors in ${projectsWithErrors.length} projects:\n`);

  projectsWithErrors.forEach(({ project, error }) => {
    console.log(`📁 ${project}`);
    console.log(`   ${error}\n`);
  });

  if (projectsSuccessful.length > 0) {
    console.log(`\n✅ ${projectsSuccessful.length} projects with no errors:\n`);
    projectsSuccessful.forEach(({ project }) => {
      console.log(`   ✓ ${project}`);
    });
  }

  if (projectsIgnored.length > 0) {
    console.log(
      `\nℹ️  ${projectsIgnored.length} projects ignored (no files for lint):\n`
    );
    projectsIgnored.forEach(({ project }) => {
      console.log(`   ⊘ ${project}`);
    });
  }

  console.log('\n💡 Tip: Run "pnpm lint:debug" to see detailed output');
  console.log('💡 Tip: Run "pnpm lint:fix" to automatically fix errors');
  console.log(
    `💡 Tip: Run "nx lint <project>" to see details of a specific project\n`
  );

  process.exit(1);
}

runLintSummary();
