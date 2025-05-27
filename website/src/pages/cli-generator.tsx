import React, { useState } from "react";
import Layout from "@theme/Layout";
import {
  Card,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./cli-generator.module.css";

const CliGenerator = () => {
  const { siteConfig } = useDocusaurusContext();
  const theme = useTheme();
  const isDarkMode =
    document.documentElement.getAttribute("data-theme") === "dark";

  const [moduleName, setModuleName] = useState("");
  const [nodeName, setNodeName] = useState("");
  const [routePath, setRoutePath] = useState("");
  const [apiEndpoints, setApiEndpoints] = useState("");
  const [nodeType, setNodeType] = useState("");
  const [auth, setAuth] = useState(true);
  const [apiBase, setApiBase] = useState("");

  const generateCommand = () => {
    let command = `npx create-jaseci-app add-module ${moduleName}`;

    if (nodeName) command += ` --node ${nodeName}`;
    if (routePath) command += ` --path "${routePath}"`;
    if (apiEndpoints) command += ` --apis "${apiEndpoints}"`;
    if (nodeType) command += ` --node-type "${nodeType}"`;
    if (!auth) command += " --auth no";
    if (apiBase) command += ` --api-base "${apiBase}"`;

    return command;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCommand());
  };

  const textFieldProps = {
    sx: {
      "& .MuiInputLabel-root": {
        color: isDarkMode ? "var(--ifm-color-emphasis-400)" : "inherit",
      },
      "& .MuiOutlinedInput-root": {
        color: isDarkMode ? "var(--ifm-color-emphasis-100)" : "inherit",
        "& fieldset": {
          borderColor: isDarkMode ? "var(--ifm-color-emphasis-300)" : "inherit",
        },
        "&:hover fieldset": {
          borderColor: isDarkMode ? "var(--ifm-color-emphasis-400)" : "inherit",
        },
        "&.Mui-focused fieldset": {
          borderColor: "var(--ifm-color-primary)",
        },
      },
      "& .MuiFormHelperText-root": {
        color: isDarkMode ? "var(--ifm-color-emphasis-500)" : "inherit",
      },
    },
  };

  return (
    <Layout
      title="CLI Generator"
      description="Generate Jaseci Forge CLI commands with ease"
    >
      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>CLI Command Generator</h1>
            <p className={styles.subtitle}>
              Generate the add-module command with your desired options
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.form}>
              <TextField
                label="Module Name"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                required
                helperText="The name of your module (e.g., users, products)"
                fullWidth
                className={styles.field}
                {...textFieldProps}
              />

              <TextField
                label="Node Name"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                helperText="Custom node name for the module"
                fullWidth
                className={styles.field}
                {...textFieldProps}
              />

              <TextField
                label="Route Path"
                value={routePath}
                onChange={(e) => setRoutePath(e.target.value)}
                helperText='Custom route path (e.g., "dashboard/products" or "(admin)/users")'
                fullWidth
                className={styles.field}
                {...textFieldProps}
              />

              <TextField
                label="API Endpoints"
                value={apiEndpoints}
                onChange={(e) => setApiEndpoints(e.target.value)}
                helperText='Comma-separated list of API endpoints (e.g., "list,get,create,update,delete")'
                fullWidth
                className={styles.field}
                {...textFieldProps}
              />

              <TextField
                label="Node Type"
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value)}
                helperText='Custom node type definition (e.g., "id:string,name:string,price:number,status:active|inactive")'
                fullWidth
                className={styles.field}
                {...textFieldProps}
              />

              <TextField
                label="API Base Path"
                value={apiBase}
                onChange={(e) => setApiBase(e.target.value)}
                helperText="Base path for API endpoints (e.g., '/todos' for JSONPlaceholder)"
                fullWidth
                className={styles.field}
                {...textFieldProps}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={auth}
                    onChange={(e) => setAuth(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "var(--ifm-color-primary)",
                        "& + .MuiSwitch-track": {
                          backgroundColor: "var(--ifm-color-primary)",
                        },
                      },
                    }}
                  />
                }
                label="Enable Authentication"
                className={styles.field}
                sx={{
                  color: isDarkMode
                    ? "var(--ifm-color-emphasis-400)"
                    : "inherit",
                }}
              />
            </div>

            <div className={styles.preview}>
              <Card className={styles.commandCard}>
                <div className={styles.commandHeader}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: isDarkMode
                        ? "var(--ifm-color-emphasis-400)"
                        : "text.secondary",
                    }}
                  >
                    Generated Command:
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={copyToClipboard}
                    size="small"
                    sx={{
                      backgroundColor: "var(--ifm-color-primary)",
                      "&:hover": {
                        backgroundColor: "var(--ifm-color-primary-darker)",
                      },
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <pre className={styles.command}>{generateCommand()}</pre>
              </Card>

              <div className={styles.instructions}>
                <h2>Usage Instructions</h2>
                <ol>
                  <li>
                    Fill in the form fields above to customize your module
                  </li>
                  <li>Copy the generated command using the copy button</li>
                  <li>Run the command in your project directory</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default CliGenerator;
