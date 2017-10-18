## POC docker scanner in TypeScript

### Development

```bash
npm run dev
```

### Running tests

```bash
npm test
```

## API Documentation

**fetchImage**
   ----
   Pulls image from docker hub, if correct name is provided

   * **URL**

     `localhost:3000/api/fetchImage`

   * **Method:**

     `POST`

   *  **URL Params**

     None

   * **Data Params**

     ```javascript
       {
         name: String
       }
     ```

   * **Success Response:**

   ```javascript
    {
        "message": "image successfully pulled"
    }
   ```

**extractContainer**
   ----
   Runs container, exports it into tar and extracts the tar

   * **URL**

     'localhost:3000/api/extractContainer'

   * **Method:**

     `POST`

   *  **URL Params**

     None

   * **Data Params**

     ```javascript
       {
         name: String
       }
     ```

   * **Success Response:**

   ```javascript
   {
       "message": "container extracted"
   }
   ```

**analyzeSourceCode**
   ----
   Runs container, exports it into tar and extracts the tar

   * **URL**

     'localhost:3000/api/analyzeSourceCode'

   * **Method:**

     `POST`

   *  **URL Params**

     None

   * **Data Params**

     ```javascript
       {
         path: String
       }
     ```

   * **Success Response:**

   ```javascript
   {
       // output of nsp check
   }
   ```

**bumpDependencies**
   ----
   bumps dependencies using ncu

   * **URL**

     'localhost:3000/api/bumpDependencies'

   * **Method:**

     `POST`

   *  **URL Params**

     None

   * **Data Params**

     ```javascript
       {
         path: String
       }
     ```

   * **Success Response:**

   ```javascript
   {
          "message": "dependencies updated"
      }
   ```

**runTests**
   ----
   Runs regression tests

   * **URL**

     'localhost:3000/api/runTests'

   * **Method:**

     `POST`

   *  **URL Params**

     None

   * **Data Params**

     ```javascript
       {
         path: String
       }
     ```

   * **Success Response:**

   ```javascript
   {
          //output of test resutls
   }
   ```