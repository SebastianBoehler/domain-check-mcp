import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios, { AxiosError } from 'axios';
import { z } from 'zod';

// API Configuration
const IONOS_BASE_URL = "https://www.ionos.com/shop-api/v1/api/shop";
const HEADERS = {
  "accept": "application/json",
  "user-agent": "Mozilla/5.0",
  "x-market": "US",
  "site-id": "CP.DS.US",
  "referer": "https://www.ionos.com/"
};

// Initialize MCP server
const server = new McpServer({
  name: "Domain Check MCP",
  version: "1.0.0"
});


// Domain Availability Check
server.tool("check_domain_availability", 
  { domain: z.string().min(1) },
  async ({ domain }) => {
    const endpoint = "/domain/status";
    const url = `${IONOS_BASE_URL}${endpoint}?domainNames=${domain}&fallbackTldCheck=true`;
    
    try {
      const response = await axios.get(url, { headers: HEADERS });
      return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
    } catch (error) {
      const axiosError = error as AxiosError;
      return { 
        content: [{ type: "text", text: `Error: ${axiosError.message}` }] 
      };
    }
  }
);

// Domain Recommendations
server.tool("get_domain_recommendations",
  { 
    domain: z.string().min(1),
    limit: z.number().int().positive().default(10) 
  },
  async ({ domain, limit }) => {
    const endpoint = "/domain/domrec";
    const url = `${IONOS_BASE_URL}${endpoint}?domainNames=${domain}&offset=0&limit=${limit}&useAiSearch=false`;
    
    try {
      const response = await axios.get(url, { headers: HEADERS });
      return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
    } catch (error) {
      const axiosError = error as AxiosError;
      return { 
        content: [{ type: "text", text: `Error: ${axiosError.message}` }] 
      };
    }
  }
);

// Sedo Domain Offers
server.tool("get_sedo_offers",
  { domain: z.string().min(1) },
  async ({ domain }) => {
    const endpoint = "/domain/sedo";
    const url = `${IONOS_BASE_URL}${endpoint}?domainNames=${domain}`;
    
    try {
      const response = await axios.get(url, { headers: HEADERS });
      return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
    } catch (error) {
      const axiosError = error as AxiosError;
      return { 
        content: [{ type: "text", text: `Error: ${axiosError.message}` }] 
      };
    }
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
