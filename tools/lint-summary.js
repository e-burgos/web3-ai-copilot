#!/usr/bin/env node

/**
 * Script para mostrar un resumen de errores de lint
 * Uso: node tools/lint-summary.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Proyectos a verificar (apps y libs)
const projects = [
  'web',
  'ai-gateway',
  'wallet',
  'ui-components',
  'data-hooks',
  'app-state',
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
    
    // Verificar si el proyecto está siendo ignorado
    if (output.includes('All files matching the following patterns are ignored')) {
      return {
        success: true,
        project: projectName,
        ignored: true,
      };
    }
    
    return { success: true, project: projectName };
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || error.message;
    
    // Verificar si es solo un warning de archivos ignorados
    if (errorOutput.includes('All files matching the following patterns are ignored')) {
      return {
        success: true,
        project: projectName,
        ignored: true,
      };
    }
    
    // Extraer solo las líneas relevantes del error
    const errorLines = errorOutput
      .split('\n')
      .filter((line) => {
        // Filtrar líneas de progreso de Nx
        return (
          !line.includes('NX') &&
          !line.includes('Running target') &&
          !line.includes('Linting') &&
          line.trim().length > 0
        );
      })
      .slice(0, 10); // Primeras 10 líneas relevantes
    
    return {
      success: false,
      project: projectName,
      error: errorLines.join('\n') || errorOutput.substring(0, 200),
    };
  }
}

function runLintSummary() {
  console.log('🔍 Analizando errores de lint...\n');
  console.log(`Verificando ${projects.length} proyecto(s)...\n`);

  const results = projects.map((project) => runLintForProject(project));

  const projectsWithErrors = results.filter((r) => !r.success);
  const projectsSuccessful = results.filter((r) => r.success && !r.ignored);
  const projectsIgnored = results.filter((r) => r.ignored);

  if (projectsWithErrors.length === 0) {
    console.log('✅ No se encontraron errores de lint!\n');
    
    if (projectsSuccessful.length > 0) {
      console.log(`✅ ${projectsSuccessful.length} proyecto(s) sin errores:\n`);
      projectsSuccessful.forEach(({ project }) => {
        console.log(`   ✓ ${project}`);
      });
      console.log('');
    }
    
    if (projectsIgnored.length > 0) {
      console.log(`ℹ️  ${projectsIgnored.length} proyecto(s) ignorados (sin archivos para lint):\n`);
      projectsIgnored.forEach(({ project }) => {
        console.log(`   ⊘ ${project}`);
      });
      console.log('');
    }
    
    return;
  }

  console.log(`❌ Se encontraron errores en ${projectsWithErrors.length} proyecto(s):\n`);

  projectsWithErrors.forEach(({ project, error }) => {
    console.log(`📁 ${project}`);
    console.log(`   ${error}\n`);
  });

  if (projectsSuccessful.length > 0) {
    console.log(`\n✅ ${projectsSuccessful.length} proyecto(s) sin errores:\n`);
    projectsSuccessful.forEach(({ project }) => {
      console.log(`   ✓ ${project}`);
    });
  }
  
  if (projectsIgnored.length > 0) {
    console.log(`\nℹ️  ${projectsIgnored.length} proyecto(s) ignorados (sin archivos para lint):\n`);
    projectsIgnored.forEach(({ project }) => {
      console.log(`   ⊘ ${project}`);
    });
  }

  console.log('\n💡 Tip: Ejecuta "pnpm lint:debug" para ver detalles completos');
  console.log('💡 Tip: Ejecuta "pnpm lint:fix" para intentar corregir automáticamente');
  console.log(`💡 Tip: Ejecuta "nx lint <proyecto>" para ver detalles de un proyecto específico\n`);

  process.exit(1);
}

runLintSummary();

