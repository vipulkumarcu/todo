// Form submit event
var form = document.getElementById('todo');
form.addEventListener('submit', addItem);


// Delete event
var deleteTask = document.getElementsByClassName('btn-danger');


// Count Variable for maintaining Row Count in Pending Tasks
var count = 0;


// Count Variable for maintaining Row Count in Pending Tasks
var count2 = 0;


// Maintaining a serial variable to be used as a unique key in the table and database
var serial = 0;




// Adding saved data from the database to the Web Page every time the page is loaded
window.addEventListener ("DOMContentLoaded", () => 
{
    // GET Request
        axios.get ("https://crudcrud.com/api/028ebb3ee27e487cb54b93c39cdb6dc3/todoList")
            .then ((response) => 
            {
                for (let i = 0; i < response.data.length; i++)
                {
                    logInput (response.data[i]);
                }
            })
            .catch (error => console.log (error));
});




// Add item
function addItem(e)
{
    e.preventDefault();

    // Storing the input values from the user in variables
        var taskDate = document.getElementById("task_date").value;
        var taskName = document.getElementById('task_name').value;
        var taskDescription = document.getElementById('task_description').value;

    // Creating an Object and storing the data
        var myObj = {
            Date: taskDate,
            Task: taskName,
            Description: taskDescription,
            Status: false
        };

    // POST Request
        axios.post ("https://crudcrud.com/api/028ebb3ee27e487cb54b93c39cdb6dc3/todoList", myObj)
            .then (alert("Task Added Successfully"))
            .catch (error => console.log (error));
    
    // Resetting the form
        form.reset();
    
    // Refreshing the entire page
        location.reload();
}




function logInput(response)
{       
    // Extracting Data from the Object
        var taskID = response._id;
        var taskDate = response.Date;
        var taskName = response.Task;
        var taskDescription = response.Description;
        var isCompleted = response.Status;

    // Creating a new Table
        var table = document.getElementById("pending_tasks");
    
    // Creating new Table row
        var row = table.insertRow(++count);

    // Creating new Columns in the newly created row
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        var cell5 = row.insertCell(5);
        var cell6 = row.insertCell(6);



    // Adding ID
        cell0.innerHTML = taskID;
        cell0.style = "display: none";

    // Adding 5th Column for maintaing serial number and setting its display property to none
        cell4.innerHTML = ++serial;
        cell4.style = "display: none";

    // Appending the data to the table
        cell1.innerHTML = taskDate;
        cell2.innerHTML = taskName;
        cell3.innerHTML = taskDescription;

    

    // Creating Edit button element
        var completed = document.createElement('INPUT');
        completed.setAttribute("type", "checkbox");

    // Onclick Function Call
        completed.addEventListener('change', function() {
            if (this.checked)
            {
                completedTaks(response, isCompleted, this);
            } 
        });

    // Appending text node
        document.body.appendChild(completed);

    // Appending Edit button to the column
        cell5.appendChild(completed);



        
    // Creating Delete button element
        var deleteBtn = document.createElement('button');

    // Adding class to Delete button
        deleteBtn.className = 'btn btn-danger';

    // Onclick Function Call
        deleteBtn.onclick = function(){removeItem(response);};

    // Appending text node
        deleteBtn.appendChild(document.createTextNode('Delete'));

    // Appending Delete button to the column
        cell6.appendChild(deleteBtn);
}




// Remove item
function removeItem(deleteItem)
{
    // Storing the _id from the database in a variable
        var serialNumber = deleteItem._id;

    // DELETE request
        axios.delete (`https://crudcrud.com/api/028ebb3ee27e487cb54b93c39cdb6dc3/todoList/${serialNumber}`)
            .then (alert("Task Deleted"))
            .catch(error => console.error(error));
    
    // Refreshing the entire page
        location.reload();
}



// Completed Taks Table
function completedTaks(response, isCompleted, deleteItem)
{
    var rowCount = (deleteItem.parentNode.parentNode.rowIndex);

    // Storing the _id from the database in a variable
    var serialNumber = response._id;

    isCompleted = true;
    response.Status = isCompleted;

    console.log (response);

    // Updating Tasks Status in Database
    axios.put (`https://crudcrud.com/api/028ebb3ee27e487cb54b93c39cdb6dc3/todoList/${serialNumber}`, response)
            .then (alert("Task Completed Successfully"))
            .catch(error => console.error(error));

    // Extracting Data from the Object
        var taskID = response._id;
        var taskDate = response.Date;
        var taskName = response.Task;
        var taskDescription = response.Description;
        
    // Creating a new Table
        var table = document.getElementById("completed_tasks");

    // Creating new Table row
        var row = table.insertRow(++count2);

    // Creating new Columns in the newly created row
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);



    // Adding ID
        cell0.innerHTML = taskID;
        cell0.style = "display: none";

    // Appending the data to the table
        cell1.innerHTML = taskDate;
        cell2.innerHTML = taskName;
        cell3.innerHTML = taskDescription;
        cell4.innerHTML = isCompleted;

        document.getElementById("pending_tasks").deleteRow(rowCount);
}
