const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./restaurants_load.sqlite');

db.serialize(function () { // serialize means execute one statement at a time
    db.run('drop table restaurant;')
    db.run('drop table menu;')
    db.run('drop table menu_item;')
})

try {
    db.serialize(function () {
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
    })

} finally {
    db.close();
}