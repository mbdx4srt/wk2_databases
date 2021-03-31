const fsp = require('fs').promises; // Node.js file system module with promises
const sqlite3 = require('sqlite3').verbose();

async function load() {
    console.log('calling load');
    // wait for the restaurant data file to be read
    const buffer = await fsp.readFile('./restaurants.json');
    const restaurants = (JSON.parse(String(buffer)));
    return restaurants;
}

async function write() {
    let restaurants = await load()
    const db = new sqlite3.Database('./restaurants_load.sqlite');
    let xr = 1
    let xm = 1
    let xi = 1
    for (const r in restaurants) {
        // console.log('Restaurant ' + xr)
        // console.log(restaurants[r])
        db.serialize(function () {
                let stmt
                try {
                    console.log(xr, restaurants[r].name, restaurants[r].image)
                    stmt = db.prepare("INSERT INTO restaurant (id, name, link) VALUES (?,?,?)"
                        , xr, restaurants[r].name, restaurants[r].image);
                    stmt.run();
                } finally {
                    stmt.finalize();
                }
            }
        )
        xr = xr + 1

        for (const m in restaurants[r].menus) {
            db.serialize(function () {
                let stmt
                try {
                    console.log(xm, restaurants[r].menus[m].title)
                    stmt = db.prepare("INSERT INTO menu (id, title, restaurant_id) VALUES (?,?,?)",
                        xm, restaurants[r].menus[m].title, xr);
                    stmt.run();
                } finally {
                    stmt.finalize();
                }
            })
            xm = xm + 1


            for (const i in restaurants[r].menus[m].items) {
                db.serialize(function () {
                        let stmt
                        try {
                            console.log(restaurants[r].menus[m].items[i])
                            stmt = db.prepare("INSERT INTO menu_item (id, name, price, menu_id) VALUES (?,?,?,?)",
                                xi, restaurants[r].menus[m].items[i].name,
                                restaurants[r].menus[m].items[i].price, xm);
                            stmt.run();
                        } finally {
                            stmt.finalize();
                        }
                    }
                )
                xi = xi + 1
            }

        }

    }
}


write()