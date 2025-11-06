## Installation

### Clone this Project

Run the following commands to clone the repository and navigate into the project directory:

```bash
  git clone https://github.com/RealTun/api-search-jobs-vietnamworks
  cd api-search-jobs-vietnamworks
```

### Install Dependencies

Install the required Node.js modules:

```bash
  npm install
```

## Run the Project

Start the server with the following command:

```bash
  node --watch server.js
```

## Testing the API

Use the following endpoint to test the API:

### Endpoint:
```
  http://localhost:3000/api/jobs/search
```

### Body Request Example:
```json
{
  "keyword": "java backend"
}
```

Replace the value of `"keyword"` with your desired search term to customize the job search.