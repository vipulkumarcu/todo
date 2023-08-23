// Form submit event
    var form = document.getElementById('todo');
    form.addEventListener('submit', addItem);

// Number of rows added to the "pending_tasks" table
    var count = 0;

// Number of rows added to the "completed_tasks" table
    var count2 = 0;

// Maintaining a serial variable to be used as a unique key in the table and database
    var serial = 0;

// Adding saved data from the database to the Web Page every time the page is loaded
    window.addEventListener ('DOMContentLoaded', async () => 
    {
        try 
        {
            const response = await axios.get ('https://crudcrud.com/api/e4463d0a333b4d3f8dbd23e72688eb40/todoList');
            response.data.forEach(item => createTableRow(item, 'pending_tasks'));
        } 
        
        catch (error) 
        {
            console.log (error);
        }
    });

// Function to create a table row for tasks
    function createTableRow (response, tableId) 
    {
        // Extracting Data from the Object
            var taskID = response._id;
            var taskDate = response.Date;
            var taskName = response.Task;
            var taskDescription = response.Description;
            var taskStatus = response.Status;

        // Creating a new Table
            var table = document.getElementById(tableId);

        // Creating new Table row
            var row = table.insertRow();

        // Creating new Cells in the newly created row
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            var cell4 = row.insertCell(4);
            var cell5 = row.insertCell(5);
            var cell6 = row.insertCell(6);

        // Adding ID
            cell0.innerHTML = taskID;
            cell0.style.display = "none";

        // Adding 5th Column for maintaining serial number and setting its display property to none
            cell4.innerHTML = ++serial;
            cell4.style.display = "none";

        // Appending the data to the table
            cell1.innerHTML = taskDate;
            cell2.innerHTML = taskName;
            cell3.innerHTML = taskDescription;

        // Creating Check Box element
            var completed = document.createElement('input');
            completed.type = "checkbox";

        // Onclick Function Call
            completed.addEventListener('change', function() 
            {
                if (this.checked)
                {
                    completedTasks(response, taskStatus, this);
                }
            });

        // Appending Check Box to the column
            cell5.appendChild(completed);

        // Creating Delete button element
            var deleteBtn = document.createElement('button');

        // Adding class to Delete button
            deleteBtn.className = 'btn btn-danger';
            deleteBtn.textContent = 'Delete';

        // Onclick Function Call
            deleteBtn.onclick = function() 
            {
                removeItem(response);
            };

        // Appending Delete button to the column
            cell6.appendChild(deleteBtn);
    }

// Add item
    async function addItem (e)
    {
        e.preventDefault();

        var taskDate = document.getElementById('task_date').value;
        var taskName = document.getElementById('task_name').value;
        var taskDescription = document.getElementById('task_description').value;

        var myObj = {
            Date: taskDate,
            Task: taskName,
            Description: taskDescription,
            Status: "Pending",
        };

        try 
        {
            await axios.post ('https://crudcrud.com/api/e4463d0a333b4d3f8dbd23e72688eb40/todoList', myObj);
            alert ('Task Added Successfully');
            form.reset();
            location.reload();
        } 

        catch (error)
        {
            console.log (error);
        }
    }
  
// Function to create the delete button element for the row
    function createDeleteButton (response)
    {
        var deleteBtn = document.createElement ('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete';

        deleteBtn.addEventListener('click', function () 
        {
            removeItem (response);
        });

        return deleteBtn;
    }

// Remove item
    async function removeItem (response)
    {
        var serialNumber = response._id;

        try
        {
            await axios.delete (`https://crudcrud.com/api/e4463d0a333b4d3f8dbd23e72688eb40/todoList/${serialNumber}`);
            alert ('Task Deleted');
            location.reload();
        }

        catch (error)
        {
            console.error (error);
        }
    }

// Completed Tasks Table
    async function completedTasks (response, taskStatus, deleteItem)
    {
        var rowCount = deleteItem.parentNode.parentNode.rowIndex;

        // Storing the _id from the database in a variable
            var serialNumber = response._id;

        // Update the status to completed
            var updatedResponse = Object.assign({}, response);
            updatedResponse.Status = "Completed";

        try 
        {
            // Making a DELETE and updating the completed status in the Table
                await axios.delete (`https://crudcrud.com/api/e4463d0a333b4d3f8dbd23e72688eb40/todoList/${serialNumber}`, updatedResponse);
                alert ('Task Completed Successfully');

            // Adding a new row to the "completed_tasks" table
                addCompletedRow (updatedResponse);

            // Deleting the row from the "pending_tasks" table
                document.getElementById('pending_tasks').deleteRow(rowCount);
        } 

        catch (error)
        {
            console.error (error);
        }
    }

// Adding a new row to the "completed_tasks" table
    function addCompletedRow (response)
    {
        // Creating new Table row
            var table = document.getElementById('completed_tasks');
            var row = table.insertRow(++count2);

        // Creating new Cells in the newly created row
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            var cell4 = row.insertCell(4);

        // Adding data to the respective cells of the row
            cell0.innerHTML = response._id;
            cell0.style = 'display: none';
            cell1.innerHTML = response.Date;
            cell2.innerHTML = response.Task;
            cell3.innerHTML = response.Description;
            cell4.innerHTML = response.Status;
    }