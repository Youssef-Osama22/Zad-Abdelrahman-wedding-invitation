# Guest message sheet setup

1. Create a Google Sheet for the wedding messages.
2. In that sheet, open **Extensions → Apps Script** and paste in `Code.gs`.
3. Deploy the script as a **Web app**, set **Execute as** to yourself, and allow access to **Anyone**. This lets invitees submit without signing in; anyone with the deployment URL can post a message.
4. Copy the web app URL ending in `/exec` into `message-config.js`:

   ```js
   window.WEDDING_MESSAGE_ENDPOINT = 'YOUR_WEB_APP_URL';
   ```

The first message creates a `Guest Messages` tab with timestamp, guest name, and message columns. Both `index.html` and `wedding.html` read the same endpoint config.
