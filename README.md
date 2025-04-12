# Domain Check MCP Server

A Model Context Protocol (MCP) server for checking domain availability using IONOS endpoints.

## Important Legal Notice

The IONOS API endpoints used in this project are:

- **Not publicly documented**
- **Used at your own risk**

This project is provided for educational purposes only. Usage of these endpoints may violate IONOS's Terms of Service. The author assumes no liability for any legal consequences resulting from the use of this software.

## Installation

```bash
npm install -g domain-check-mcp
```

Or using npx:

```bash
npx domain-check-mcp
```

## Available Tools

- `check_domain_availability` - Checks if a domain is available
- `get_domain_recommendations` - Gets alternative domain suggestions
- `get_sedo_offers` - Checks Sedo marketplace for domain offers

## Recommended MCP Configuration

For reliable operation, use an absolute path with Node rather than npx:

```json
{
  "domain": {
    "command": "node",
    "args": ["/path/to/domain-check-mcp/dist/index.js"]
  }
}
```

Replace `/path/to/` with the actual path where you cloned this repository.
The `npx -y domain-check-mcp` command fails for some reason.

## Development

```bash
npm install
npm run build
npm start
```

## Disclaimer

The author assumes no liability for any legal consequences resulting from the use of this software.
