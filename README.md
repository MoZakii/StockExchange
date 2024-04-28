# StockExchange
 
Setting up the backend:

1- Open appsettings.json and replace the "DefaultConnection"'s value by your SQL Connection path.
2- Open Nuget Package Manager in visual studio.
3- In the console write:
     -  Update-Database -Context OrderContext
     -  Update-Database -Context StockContext
     -  Update-Database -Context UserDbContext
4- After running all 3 commands. You should find the database tables generated in your database.
5- Run the project  (Swagger GUI will open).


Setting up the frontend:

1- Open the commandline on StocksFrontEnd\StockExchange directory.
2- Run the "ng serve --o" command (A webpage will open on your default browser).
