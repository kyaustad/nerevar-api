import { NextRequest, NextResponse } from "next/server";

// Function to escape problematic characters in JSON strings
function escapeJsonString(str: string): string {
  return str
    .replace(/\\/g, "\\\\") // Escape backslashes first
    .replace(/"/g, '\\"') // Escape double quotes
    .replace(/\n/g, "\\n") // Escape newlines
    .replace(/\r/g, "\\r") // Escape carriage returns
    .replace(/\t/g, "\\t") // Escape tabs
    .replace(/\f/g, "\\f") // Escape form feeds
    .replace(/\b/g, "\\b"); // Escape backspaces
}

// Function to attempt to fix malformed JSON
function fixMalformedJson(jsonString: string): string {
  try {
    // First, try to parse as-is
    JSON.parse(jsonString);
    return jsonString;
  } catch (error) {
    console.log("Initial JSON parse failed, attempting to fix...");

    // Common fixes for malformed JSON
    let fixed = jsonString;

    // Fix unescaped quotes in string values
    // This regex finds string values and escapes unescaped quotes within them
    fixed = fixed.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match, content) => {
      // Escape any unescaped quotes within the string content
      const escapedContent = content.replace(/(?<!\\)"/g, '\\"');
      return `"${escapedContent}"`;
    });

    // Fix trailing commas
    fixed = fixed.replace(/,(\s*[}\]])/g, "$1");

    // Fix missing quotes around keys
    fixed = fixed.replace(
      /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g,
      '$1"$2":'
    );

    // Try to parse the fixed JSON
    try {
      JSON.parse(fixed);
      console.log("Successfully fixed malformed JSON");
      return fixed;
    } catch (secondError) {
      console.log("Could not fix JSON, returning original");
      return jsonString;
    }
  }
}

// Function to safely parse JSON with fallback handling
async function parseServersJson(response: Response): Promise<any> {
  const text = await response.text();
  console.log(`Received ${text.length} characters of server data`);
  console.log("First 500 characters:", text.substring(0, 500));
  console.log(
    "Last 500 characters:",
    text.substring(Math.max(0, text.length - 500))
  );

  // Try to parse the JSON directly first
  try {
    const parsed = JSON.parse(text);
    console.log("Successfully parsed JSON directly");
    return parsed;
  } catch (error) {
    console.log(
      "Direct JSON parse failed, attempting to fix malformed entries..."
    );
    console.log("JSON parse error:", error);

    // Try to fix the JSON by removing malformed entries
    try {
      const fixedJson = fixMalformedJsonEntries(text);
      const parsed = JSON.parse(fixedJson);
      console.log("Successfully parsed fixed JSON");
      return parsed;
    } catch (fixError) {
      console.log("JSON fixing failed, attempting manual extraction...");

      // Last resort: try to extract any valid server entries using a more permissive approach
      try {
        return extractServersPermissive(text);
      } catch (permissiveError) {
        console.error("Permissive extraction also failed:", permissiveError);
        throw new Error("Unable to parse server data from external API");
      }
    }
  }
}

// Function to fix malformed JSON by removing problematic entries
function fixMalformedJsonEntries(text: string): string {
  console.log("Attempting to fix malformed JSON entries...");

  // First, try to find the main structure
  const mainMatch = text.match(/^(\{"list servers":\{)(.*)(\}\})$/);
  if (!mainMatch) {
    console.log("Could not find main JSON structure");
    return text;
  }

  const prefix = mainMatch[1];
  const content = mainMatch[2];
  const suffix = mainMatch[3];

  console.log(
    `Found main structure, processing ${content.length} characters of content`
  );

  // Split content by server entries and validate each one
  const validEntries: string[] = [];
  let currentPos = 0;

  while (currentPos < content.length) {
    // Find the start of a server entry
    const keyStart = content.indexOf('"', currentPos);
    if (keyStart === -1) break;

    const keyEnd = content.indexOf('"', keyStart + 1);
    if (keyEnd === -1) break;

    const serverKey = content.substring(keyStart + 1, keyEnd);

    // Find the opening brace
    const braceStart = content.indexOf("{", keyEnd);
    if (braceStart === -1) break;

    // Find the matching closing brace
    let braceCount = 0;
    let braceEnd = braceStart;
    let inString = false;
    let escapeNext = false;

    for (let i = braceStart; i < content.length; i++) {
      const char = content[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === "\\") {
        escapeNext = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === "{") {
          braceCount++;
        } else if (char === "}") {
          braceCount--;
          if (braceCount === 0) {
            braceEnd = i;
            break;
          }
        }
      }
    }

    if (braceCount === 0) {
      // Extract the complete server entry
      const serverEntry = content.substring(keyStart, braceEnd + 1);

      // Try to validate this entry by parsing it
      try {
        const testObj = JSON.parse(`{${serverEntry}}`);
        if (testObj[serverKey] && typeof testObj[serverKey] === "object") {
          validEntries.push(serverEntry);
          console.log(`Valid server entry: ${serverKey}`);
        } else {
          console.log(`Invalid server object structure: ${serverKey}`);
        }
      } catch (error) {
        console.log(`Malformed server entry removed: ${serverKey}`);
      }

      currentPos = braceEnd + 1;
    } else {
      console.log(`Unmatched braces, skipping: ${serverKey}`);
      currentPos = keyEnd + 1;
    }
  }

  console.log(`Found ${validEntries.length} valid server entries`);

  // Reconstruct the JSON
  const fixedContent = validEntries.join(",");
  const fixedJson = prefix + fixedContent + suffix;

  return fixedJson;
}

// Most permissive extraction method - extracts any data that looks like server info
function extractServersPermissive(text: string): any {
  const servers: any = {};
  console.log("Attempting permissive extraction...");

  // Use a more aggressive approach - find all IP:port patterns and try to extract their data
  const ipPortPattern = /"([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+)":\s*\{/g;
  let match;

  while ((match = ipPortPattern.exec(text)) !== null) {
    const serverKey = match[1];
    const startPos = match.index;

    console.log(`Found server key: ${serverKey} at position ${startPos}`);

    // Find the opening brace position
    const braceStart = text.indexOf("{", startPos);
    if (braceStart === -1) continue;

    // Find the matching closing brace
    let braceCount = 0;
    let braceEnd = braceStart;
    let inString = false;
    let escapeNext = false;

    for (let i = braceStart; i < text.length; i++) {
      const char = text[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === "\\") {
        escapeNext = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === "{") {
          braceCount++;
        } else if (char === "}") {
          braceCount--;
          if (braceCount === 0) {
            braceEnd = i;
            break;
          }
        }
      }
    }

    if (braceCount === 0) {
      // Extract the server data
      const serverDataStr = text.substring(braceStart + 1, braceEnd);

      try {
        // Try to parse the server data as JSON
        const serverData = JSON.parse(`{${serverDataStr}}`);

        // Extract individual fields
        const serverObj: any = {};

        // Extract common fields using regex
        const modnameMatch = serverDataStr.match(/"modname":\s*"([^"]*)"/);
        if (modnameMatch) serverObj.modname = modnameMatch[1];

        const hostnameMatch = serverDataStr.match(/"hostname":\s*"([^"]*)"/);
        if (hostnameMatch) serverObj.hostname = hostnameMatch[1];

        const playersMatch = serverDataStr.match(/"players":\s*(\d+)/);
        if (playersMatch) serverObj.players = parseInt(playersMatch[1]);

        const maxPlayersMatch = serverDataStr.match(/"max_players":\s*(\d+)/);
        if (maxPlayersMatch)
          serverObj.max_players = parseInt(maxPlayersMatch[1]);

        const portMatch = serverDataStr.match(/"query_port":\s*(\d+)/);
        if (portMatch) serverObj.query_port = parseInt(portMatch[1]);

        const versionMatch = serverDataStr.match(/"version":\s*"([^"]*)"/);
        if (versionMatch) serverObj.version = versionMatch[1];

        const passwMatch = serverDataStr.match(/"passw":\s*(true|false)/);
        if (passwMatch) serverObj.passw = passwMatch[1] === "true";

        const lastUpdateMatch = serverDataStr.match(/"last_update":\s*(\d+)/);
        if (lastUpdateMatch)
          serverObj.last_update = parseInt(lastUpdateMatch[1]);

        // Only add if we have at least some valid data
        if (Object.keys(serverObj).length >= 3) {
          servers[serverKey] = serverObj;
          console.log(`Successfully extracted server: ${serverKey}`);
        } else {
          console.log(`Insufficient data for server: ${serverKey}`);
        }
      } catch (error) {
        console.log(`Failed to parse server data for: ${serverKey}`);
      }
    }
  }

  console.log(
    `Permissive extraction found ${Object.keys(servers).length} servers`
  );
  return { "list servers": servers };
}

// More robust function to manually extract server data
function extractServersManually(text: string): any {
  const servers: any = {};

  console.log("Attempting manual extraction...");

  // First, try to find the main JSON structure
  const mainPattern = /"list servers":\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/;
  const mainMatch = text.match(mainPattern);

  if (!mainMatch) {
    console.log("Could not find main server list structure");
    console.log("Looking for alternative patterns...");

    // Try alternative patterns
    const altPatterns = [
      /"list servers":\s*\{([\s\S]*)\}/,
      /"servers":\s*\{([\s\S]*)\}/,
      /\{([\s\S]*"modname"[\s\S]*)\}/,
    ];

    for (let i = 0; i < altPatterns.length; i++) {
      const altMatch = text.match(altPatterns[i]);
      if (altMatch) {
        console.log(`Found alternative pattern ${i + 1}`);
        return extractFromContent(altMatch[1], servers);
      }
    }

    return { "list servers": {} };
  }

  const serverListContent = mainMatch[1];
  console.log("Found main server list structure, extracting content...");
  return extractFromContent(serverListContent, servers);
}

function extractFromContent(content: string, servers: any): any {
  console.log(`Extracting from content of length: ${content.length}`);

  // Split by server entries more carefully
  // Look for patterns like "ip:port": { ... }
  const serverEntries = [];
  let currentPos = 0;

  while (currentPos < content.length) {
    // Find the start of a server entry (quoted IP:port)
    const keyStart = content.indexOf('"', currentPos);
    if (keyStart === -1) break;

    const keyEnd = content.indexOf('"', keyStart + 1);
    if (keyEnd === -1) break;

    const serverKey = content.substring(keyStart + 1, keyEnd);

    // Find the opening brace for this server
    const braceStart = content.indexOf("{", keyEnd);
    if (braceStart === -1) break;

    // Find the matching closing brace
    let braceCount = 0;
    let braceEnd = braceStart;
    let inString = false;
    let escapeNext = false;

    for (let i = braceStart; i < content.length; i++) {
      const char = content[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === "\\") {
        escapeNext = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === "{") {
          braceCount++;
        } else if (char === "}") {
          braceCount--;
          if (braceCount === 0) {
            braceEnd = i;
            break;
          }
        }
      }
    }

    if (braceCount === 0) {
      const serverData = content.substring(braceStart + 1, braceEnd);
      serverEntries.push({ key: serverKey, data: serverData });
      currentPos = braceEnd + 1;
    } else {
      // If we couldn't find matching braces, skip this entry
      console.log(`Skipping malformed server entry: ${serverKey}`);
      currentPos = keyEnd + 1;
    }
  }

  console.log(`Found ${serverEntries.length} server entries to parse`);

  // Parse each server entry
  for (const entry of serverEntries) {
    try {
      // Clean up the server data and try to parse it
      const cleanedData = cleanServerData(entry.data);
      const serverObj = JSON.parse(`{${cleanedData}}`);

      // Validate that this looks like a server object
      if (isValidServerObject(serverObj)) {
        servers[entry.key] = serverObj;
      } else {
        console.log(`Skipping invalid server object: ${entry.key}`);
      }
    } catch (error) {
      console.log(`Skipping malformed server entry: ${entry.key}`);
    }
  }

  console.log(`Successfully parsed ${Object.keys(servers).length} servers`);
  return { "list servers": servers };
}

// Helper function to clean server data
function cleanServerData(data: string): string {
  // Remove any trailing commas before closing braces
  let cleaned = data.replace(/,(\s*[}])/g, "$1");

  // Fix common JSON issues
  cleaned = cleaned.replace(/([^\\])"/g, '$1\\"'); // Escape unescaped quotes
  cleaned = cleaned.replace(/^"/g, '\\"'); // Escape leading quote
  cleaned = cleaned.replace(/"$/g, '\\"'); // Escape trailing quote

  return cleaned;
}

// Helper function to validate server object structure
function isValidServerObject(obj: any): boolean {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.modname === "string" &&
    typeof obj.hostname === "string" &&
    typeof obj.query_port === "number" &&
    typeof obj.players === "number" &&
    typeof obj.max_players === "number"
  );
}

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching server list from external API...");

    const serversResponse = await fetch(
      "http://master.tes3mp.com:8081/api/servers",
      {
        headers: {
          "User-Agent": "Nerevar-API/1.0",
          Accept: "application/json",
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }
    );

    if (!serversResponse.ok) {
      throw new Error(
        `External API returned ${serversResponse.status}: ${serversResponse.statusText}`
      );
    }
    console.log("serversResponse:", serversResponse);

    console.log("Successfully fetched server data, parsing...");

    // Parse the JSON with error handling
    const serversData = await parseServersJson(serversResponse);

    console.log(
      `Successfully parsed ${
        Object.keys(serversData["list servers"] || {}).length
      } servers`
    );

    return NextResponse.json({
      success: true,
      data: serversData["list servers"],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching server list:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
