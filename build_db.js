const sqlite3 = require('sqlite3').verbose();

// use a persistent database named myDb.sqlite
const db = new sqlite3.Database('./restaurants.sqlite');


/**
 * Executes the SQL statements one at a time.
 *
 * Note the use of try/finally to ensure resources get closed
 * whether an error occurs or not
 *
 */
try {
    db.serialize(function () { // serialize means execute one statement at a time
        db.run('drop table restaurant;')
        db.run('drop table menu;')
        db.run('drop table menu_item;')


        // create the empty table with specific columns and column types
        db.run("create table restaurant\n" +
            "(\n" +
            "    id    integer primary key autoincrement,\n" +
            "    name  text,\n" +
            "    link  text\n" +
            ");");


        db.run("create table menu\n" +
            "(\n" +
            "    id            integer primary key autoincrement,\n" +
            "    title         text,\n" +
            "    restaurant_id INT,\n" +
            "    FOREIGN KEY (restaurant_id) REFERENCES restaurant (id)\n" +
            "\n" +
            ");")

        db.run("create table menu_item\n" +
            "(\n" +
            "    id      integer primary key autoincrement,\n" +
            "    name    text,\n" +
            "    price   integer,\n" +
            "    menu_id INT,\n" +
            "    FOREIGN KEY (menu_id) REFERENCES menu (id)\n" +
            ");\n")


        let stmt;
        let stmt2;
        let stmt3;
        // insert 2 rows
        try {
            stmt = db.prepare("INSERT INTO restaurant (id, name, link) VALUES \n" +
                "(1, 'Bayroot', 'https://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/England/Brighton/brighton-restaurants-hotel-du-vin-bistro.jpg'),\n" +
                "(2, 'Byron', 'www.byron.com'),\n" +
                "(3, 'Ostereo', 'https://www.osteriabasilico.co.uk/');");
            stmt.run();
            stmt2 = db.prepare("insert into menu (id, title, restaurant_id) VALUES\n" +
                "(1, 'Breakfast', 2),\n" +
                "(2, 'Lunch', 2),\n" +
                "(3, 'Wine', 2),\n" +
                "(4, 'Dinner', 3);");
            stmt2.run();
            stmt3 = db.prepare("insert into menu_item (id, name, price, menu_id) VALUES\n" +
                "(1, 'Burger', 10, 2),\n" +
                "(2, 'Cheese Burger', 12, 2),\n" +
                "(3, 'Bacon Sandwich', 5, 1),\n" +
                "(4, 'Malbec', 15, 3),\n" +
                "(5, 'Pizza', 16, 4),\n" +
                "(6, 'Pizza 2', 10, 4),\n" +
                "(7, 'Pizza 3', 12, 4),\n" +
                "(8, 'Pizza 4', 6, 4),\n" +
                "(9, 'Pizza 5', 15, 4)\n" +
                ";");
            stmt3.run();
        } finally {
            // release resources
            stmt.finalize();
            stmt2.finalize();
            stmt3.finalize();
        }

        // select the rows and print them out
        db.each("SELECT * FROM restaurant",
            function (err, rows) {  // this is a callback function
                console.log(rows);  // rows contains the matching rows
            });
        db.each("SELECT * FROM menu",
            function (err, rows) {  // this is a callback function
                console.log(rows);  // rows contains the matching rows
            }
        );
    });


} finally {
    db.close();
}