# History Library Demo

This is a simple library to demonstrate the usage of both **Hash History** and **Browser History** for client-side routing. This demo shows how to create and manipulate navigation history using custom `hash` and `browser` history objects.

## Features
- Supports **Hash History**: Routing with URLs containing `#` (e.g., `/home#page1`).
- Supports **Browser History**: Clean URLs (e.g., `/home`).

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone <your-repository-url>
   cd <your-project-directory>

### Install dependencies:

``` bash
Copy code
npm install
Build the project:
```
To bundle and prepare the project for production, run the following command:
```
```bash
Copy code
npm run build
Run the development server:
```
To start the local development server and view the DEMO, use:

```bash
Copy code
npm run dev
```

### Usage
In the src/history.js file, the createHashHistory and createBrowserHistory functions are provided to create different types of history objects. Here's an example of how to use them:

Example Code:
```javascript
Copy code
import { createBrowserHistory } from "./history.js";
import { createHashHistory } from "./history.js";

// Create an instance of Hash History
const hashHistory = createHashHistory({});

// Create an instance of Browser History
const browserHistory = createBrowserHistory({});

// Choose which history you want to use
let history = hashHistory;

// Navigate to '/home' using Hash History
history.push('/home');

// Alternatively, you can switch to Browser History
// history = browserHistory;
// history.push('/home');
```
### How It Works:
Hash History: When using the hash history, URLs will include a # symbol, making it possible to handle client-side routing without refreshing the page.

Browser History: This provides a more standard way of using paths in URLs (i.e., /home), which is more SEO-friendly and compatible with most server-side routing setups.