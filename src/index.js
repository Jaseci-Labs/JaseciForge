#!/usr/bin/env node
const { program } = require("commander");
const createApp = require("./commands/create-app");
const addModule = require("./commands/add-module");
const cleanupApp = require("./commands/cleanup-app");
const taurifyApp = require("./commands/taurify-app");

program
  .version("0.1.0")
  .arguments("<app_name>")
  .description("Generate a JaseciStack Front-End template")
  .action(createApp);

// Add new command for creating modules
program
  .command("add-module <module_name>")
  .description("Add a new module to the JaseciStack application")
  .option("--node <node_name>", "Add a node for the module")
  .option(
    "--path <route_path>",
    'Custom route path (e.g., "dashboard/products" or "(admin)/users")'
  )
  .option(
    "--apis <endpoints>",
    'Comma-separated list of API endpoints (e.g., "list,get,create,update,delete")'
  )
  .option(
    "--node-type <type_definition>",
    'Custom node type definition (e.g., "id:string,name:string,price:number,status:active|inactive")'
  )
  .option(
    "--auth <yes|no>",
    "Whether to wrap the page with ProtectedRoute and use private_api (default: yes)"
  )
  .option(
    "--api-base <base_path>",
    "Base path for API endpoints (e.g., '/todos' for JSONPlaceholder)"
  )
  .action(addModule);

// Add new command for cleaning up example app
program
  .command("cleanup")
  .description("Remove the example task manager app and its related files")
  .action(cleanupApp);

// Add new command for converting to Tauri app
program
  .command("taurify")
  .description("Convert your Next.js app to a Tauri desktop application")
  .option(
    "--package-manager <manager>",
    "Package manager to use (npm/yarn/pnpm)",
    "npm"
  )
  .action(taurifyApp);

program.parse(process.argv);
