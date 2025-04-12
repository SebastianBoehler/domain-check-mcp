import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios, { AxiosError } from 'axios';
import { z } from 'zod';

// API Configuration
const IONOS_BASE_URL = "https://www.ionos.com/shop-api/v1/api/shop";

const Market = z.enum(["DE", "US"]);
type Market = z.infer<typeof Market>;

const getHeaders = (market: Market) => ({
  "accept": "application/json",
  "user-agent": "Mozilla/5.0",
  "x-market": market,
  "site-id": `CP.DS.${market}`,
  "referer": "https://www.ionos.com/"
});

// Initialize MCP server
const server = new McpServer({
  name: "Domain Check MCP",
  version: "1.0.0"
});

// Domain Availability Check
server.tool("check_domain_availability", 
  { 
    domain: z.string().min(1),
    market: Market.default("US")
  },
  async ({ domain, market }) => {
    const endpoint = "/domain/status";
    const url = `${IONOS_BASE_URL}${endpoint}?domainNames=${domain}&fallbackTldCheck=true`;
    
    try {
      const response = await axios.get(url, { headers: getHeaders(market) });
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
    limit: z.number().int().positive().default(10),
    market: Market.default("US")
  },
  async ({ domain, limit, market }) => {
    const endpoint = "/domain/domrec";
    const url = `${IONOS_BASE_URL}${endpoint}?domainNames=${domain}&offset=0&limit=${limit}&useAiSearch=false`;
    
    try {
      const response = await axios.get(url, { headers: getHeaders(market) });
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
  { 
    domain: z.string().min(1),
    market: Market.default("US")
  },
  async ({ domain, market }) => {
    const endpoint = "/domain/sedo";
    const url = `${IONOS_BASE_URL}${endpoint}?domainNames=${domain}`;
    
    try {
      const response = await axios.get(url, { headers: getHeaders(market) });
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
