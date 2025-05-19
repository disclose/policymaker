// Simple test script to see how the expires field is generated in security.txt

const fs = require('fs');
const path = require('path');

// Read the security.txt template file
const templatePath = path.join(__dirname, 'static', 'templates', 'securitytxt', 'securitytxt.md');
const template = fs.readFileSync(templatePath, 'utf8');

// Sample configuration
const config = {
  organizationName: 'Test Organization',
  language: 'en-US',
  channels: [
    { prefix: 'mailto:', address: 'security@example.com' },
    { prefix: 'https://', address: 'example.com/security' }
  ],
  hostUrl: { prefix: 'https://', address: 'example.com/policy' }
};

// Simple implementation of the renderSecurityTxt function
function renderSecurityTxt(template, config) {
  let securitytxt = template || "";

  // Replace Organization Name
  securitytxt = securitytxt.replace(/{{organization}}/gm, config.organizationName);

  // Replace Channels
  const channelURIs = config.channels.map(channel => `${channel.prefix}${channel.address}`);
  const contactFields = channelURIs.map(uri => `Contact: ${uri}`).join("\n");
  securitytxt = securitytxt.replace(/{{channel}}/gm, contactFields);

  // Replace Policy URL
  const policyUrl = `${config.hostUrl.prefix}${config.hostUrl.address}`;
  securitytxt = securitytxt.replace(/{{policy_url}}/gm, policyUrl);

  // Replace language
  securitytxt = securitytxt.replace(/{{languages}}/gm, config.language);
  
  // Replace expires field with a date 1 year in the future
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const formattedExpiryDate = expiryDate.toISOString().split('.')[0] + 'z'; // Format as per RFC 3339
  securitytxt = securitytxt.replace(/{{expires}}/gm, formattedExpiryDate);

  return securitytxt;
}

// Render the template
const renderedSecurityTxt = renderSecurityTxt(template, config);

// Print the result
console.log("========= Generated security.txt =========");
console.log(renderedSecurityTxt);
console.log("========================================");

// Save to a file for inspection
fs.writeFileSync('generated-security.txt', renderedSecurityTxt);
console.log("Generated security.txt has been saved to 'generated-security.txt'"); 