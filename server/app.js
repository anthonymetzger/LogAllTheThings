const { log } = require('console');
const express = require('express');
const fs = require('fs');
const { send } = require('process');
const { json } = require('stream/consumers');
const app = express();

//I needed a small bit of help on this project. I looked for a few examples of logging '
//middleware to get the syntax down. I attempted to use an object to hold the log data but
//couldn't get it to format correctly so I did some research on CSV formatting and implemented
//it that way. After modifying the code a small bit from several examples I found online I was
//able to get it to work. 

// I want to try to understand how this code works line by line, I am going to comment
//above every line understand completely, and will notate any questions, if any, that I have.

//Since I was unable to do this completely on my own, I want to ensure that I understand
//everything that is happening here... especially since this is such a new area of js for me.

//during the last project, I was finally able to nail down what req and res does (to a point).
// the next is new, but to my udnerstanding it is a function that is called to move on to the next
//section of code.
//I am able to do a lot with req and res. I'm not completely sure how it is recieved or if
//those are some sort of default objects that are always there. I need to research that more.       ****Completed Research****vv
//app.use is a method to use middleware in the express application. Here, it is being used to log               //NEW UNDERSTAND!!! req and res are objects that represent the HTTP request and response, respectively.
//information about each incoming request. When you use 'app.use', you are telling the app to use               //Middleware functions run IN THE ORDER THEY ARE DEFINED! Each middleware function has access to the req and res objects.
//the specified middleware function for all incoming requests. This is similar to a regular function,           //req and res in this case are not parameters being used in a function. I previously thought that they were being passed in
//but it has access to the request and response objects, as well as the next function to pass control           //the app.use method as parameters. They are actually objects that are always present in the context of an HTTP request in Express.   
//to the next middleware in the stack.                                                                          //in this case, they are being used to access certain properties of the HTTP request and response that is the same across all other                                     
app.use((req, res, next) => {                                                                                   //req and res objects in this project. They are the same across all functions in this project at all times.*/
    // Create CSV-formatted log line
    //declares a constant variable agent that holds the user-agent string from the request headers
    //this string is enclosed in backticks so I can easily include other variables without
    //using concatenation.
    const agent = `${req.get('User-Agent')}`;
    //declares a constant variable time that holds the current date and time in ISO format
    //I am unsure what ISO format is exactly, I need to research that more.                         ****Completed Research****vv    
    const time = new Date().toISOString();                                                                      //****NEW UNDERSTAND!!! ISO stands for International Organization for Standardization. It is a standardized format for 
    //declares a constant variable method that holds the HTTP method of the request (GET, POST, etc.)           // representing date and time. The toISOString() method converts the date to a string in the ISO 8601 format.
    const method = req.method;
    //declares a constant variable resource that holds the original URL of the request
    const resource = req.originalUrl;
    //declares a constant variable version that holds the HTTP version of the request
    //it also utilizes backticks to format the string, something that I should start
    //being used to by now.
    const version = `HTTP/${req.httpVersion}`;
    //declares a constant variable status that holds the HTTP status code of the response
    const status = res.statusCode;
    //creates a CSV-formatted string using the previously declared variables. also utilizes
    //backticks for formatting. Each variable is separated by a comma, and the line ends with a newline character.
    const csvLine = `${agent},${time},${method},${resource},${version},${status}\n`;

    // Append the line to log.csv
    //fs is a new module. Fs stands for file system and it allows you to work with the file system 
    //on your computer. Here, it is being used to append the csvLine string to a file named 'log.csv'.
    //If the file does not exist, it will be created. The callback function handles any errors that
    //may occur during the file operation.
    fs.appendFile('log.csv', csvLine, (err) => {
      if (err) console.error('Error writing to log file:', err);
    });
    //logs the csvLine to the console.
    console.log(csvLine);
    //***Note that above, I am appending the data to the file and also sending it to the log.  
    //I can send anything I want to the log, whether it be a string, array or object. I am not completely
    // sure if it has to be in a certain format at this point. I am thinking it isn't as strict as
    // the other function below, at least with the tests. I'd like to do a little more research and testing
    // with this to see if the log has to be as strict as the JSON object below.  */

  next();
});


app.get('/', (req, res) => {
    // req stands for request, res stands for response. I am familiar with the bare minimum by this point.
    //It sends a status directly to the page. 200 means everything is ok. As far as my understanding goes,
    //if this were a website, the user would be able to see "ok" on the page, and not just
    //me while accessing using localhost.
  res.sendStatus(200);
});

//I am somewhat unsure how the first parameter works here. I know it is the path, but
//I am not sure how it is being interpreted.                                                        ****Completed Research****vv
app.get('/logs', (req, res) => {                                                                                    //****NEW UNDERSTAND!!! This does reffer to the URL. I just needed to refresh my server. Understood. */
    //similar to above, req stands for request, res stands for response.                                                When a GET request is made--by to localhost:3000/logs--this function is called. If it was replaced
    //This reads the log.csv file in utf8 encoding. The callback function handles any errors                            with /logs/somethingelse, that would be the new path. So localhost:3000/logs/somethingelse.
    //that may occur during the file operation and processes the file data if read successfully.
    //I see that this module uses a callback function, something I am slowly beginning to 
    //understand. What confuses me here, is the callback function has two parameters, err and data.
    //I understand that err is for error handling, but I am unsure how the data parameter
    //is being populated from here.                                                                 ****Completed Research****vv
  fs.readFile('log.csv', 'utf8', (err, data) => {                                                               //****NEW UNDERSTAND!!! err and data are not a callback function in and of itself, but they are */
    //error handling if block.                                                                                     parameters of the callback function. The fs.readFile method reads the contents of the file, and */                                   
    if (err) {                                                                                                  // when it finishes reading, it calls the callback function with two arguments: an error object (if any) which is */  
      res.status(500).send('Error reading log file');                                                           // standard practice in node.js. it is called the "error-first" callback pattern. The second argument is the data read from the file. */
      //a return statement to exit the function early.                                                          // So, 'data' is populated with the contents of 'log.csv' after it has been read successfully as a result of it being a */
      return;                                                                                                   // parameter in the callback function. */
    }
    //logs the data read from the log.csv file to the console because I am more trying to
    // understand how the 'data' parameter is being populated.
    console.log(data);
    //This is where I needed the most help in this project. the app.use method was fairly easy to understand
    //but I was struggling to figure out how to convert the CSV data into a JSON object.
    //I had to copy from someone else's example and modify it slightly to get it less bloated.
    //Essentially, it splits the data into lines based on newline characters, then maps each line
    //to a JSON object by splitting the line by commas and assigning each part to the appropriate
    //key in the object. Finally, it sends the array of JSON objects as a JSON response. I previously
    //did not know it was an array of several JSON objects, I thought it was just one object with
    //several keys. I believe that this was the most difficult portion of this particular project   ****         //The two marked lines to the left are where all the magic happens. Here, each line is split into its components
    const lines = data.split('\n');                                                                              //is formatted and prepared to be mapped into a JSON object called JSonObject. Each line is split by commas to separate the different fields.                             
    const logs = lines.map(line => {                                                                            //Then, each part is assigned to the appropriate key in the JSON object. Finally, the array of JSON objects is sent as a JSON response. */                          
      const [agent, time, method, resource, version, status] = line.split(',');                                
        //I still don't get how this is a JSON object. I understand that it is formatting
        //the data into key/value pairs, but I thought JSON objects had to tranfer in one object, not
        //several.                                                                                  ****
        let JSONObject = {Agent: agent, Time: time, Method: method, Resource: resource, Version: version, Status: Number(status)};
      return JSONObject;
    });
    //I do not know how this funciton is called. I don't want to assume anything.
    res.json(logs);
  });
});
//exports the app module. Not sure why you need to export it.
module.exports = app;

//Post thoughts on this project after research:
//Understanding how to use all this new information I've been provided has been
//extremely difficult. I feel like if I were to do this project again, I would be able
//to do it a lot easier and in a lot less time. I am dissatisfied with how much
//I had to refer to outside sources to get this done. I want to be able to do this project
//and others like it completely on my own. I think I have an appropriate grasp on how
//express js works, but I would need to do several more projects at a similar level of
//difficulty to really cement the knowledge.