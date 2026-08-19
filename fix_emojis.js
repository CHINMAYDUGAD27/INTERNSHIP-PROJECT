const fs = require('fs');
const path = require('path');

const map = {
  'âš ï¸ ': '⚠️',
  'â€”': '—',
  'â‚¹': '₹',
  'â†’': '→',
  'â€“': '–',
  'â”€': '─',
  'âœ…': '✅',
  'â ³': '⏳',
  'à¤†à¤ªà¤¤à¥ à¤•à¤¾à¤²à¥€à¤¨ à¤¸à¤‚à¤ªà¤°à¥ à¤• à¤•à¥ à¤°à¤®à¤¾à¤‚à¤•': 'आपत्कालीन संपर्क क्रमांक',
  'à¤†à¤ªà¤¤à¥ à¤¤à¥€ à¤µà¥ à¤¯à¤µà¤¸à¥ à¤¥à¤¾à¤ªà¤¨': 'आपत्ती व्यवस्थापन',
  'à¤¬à¤¾à¤² à¤¸à¥ à¤°à¤•à¥ à¤·à¤¾ à¤µ à¤•à¤²à¥ à¤¯à¤¾à¤£': 'बाल सुरक्षा व कल्याण',
  'à¤®à¤¹à¤¿à¤²à¤¾ à¤¸à¥ à¤°à¤•à¥ à¤·à¤¾': 'महिला सुरक्षा',
  'à¤—à¥‹à¤ªà¤¨à¥€à¤¯ à¤—à¥ à¤¨à¥ à¤¹à¤¾': 'गोपनीय गुन्हा',
  'à¤†à¤ªà¤¤à¥ à¤•à¤¾à¤²à¥€à¤¨ à¤®à¤¦à¤¤': 'आपत्कालीन मदत',
  'à¤ªà¥‹à¤²à¥€à¤¸ à¤®à¤¦à¤¤': 'पोलीस मदत',
  'à¤°à¥ à¤—à¥ à¤£à¤µà¤¾à¤¹à¤¿à¤•à¤¾': 'रुग्णवाहिका'
};

const dir = path.join(__dirname, 'frontend/src/components');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const [bad, good] of Object.entries(map)) {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    replaceInFile(path.join(dir, file));
  }
});
