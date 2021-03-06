"use strict";

import Sequelize from "sequelize";
import SchemaLoader from "./server/schema/SchemaLoader";
import { getCurrentMonth } from "./core/utils";

function padded(val) {
  const padding = val < 10 ? "0" : "";
  return padding + val;
}

function format(date) {
  return date.getFullYear() + "-" +
    padded(date.getMonth() + 1) + "-" + 
    padded(date.getDate()); 
}

function currentPeriod(baseDate, periodType) {
 
  let periodStart = null;

  if (periodType === "M") {
    periodStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);  
  } else if (periodType === "W") {
    const offset = baseDate.getDay() !== 0 ? baseDate.getDay() - 1 : 6; 
    periodStart = new Date(baseDate.getFullYear(), 
                           baseDate.getMonth(), baseDate.getDate() - offset);  
  } else {
    periodStart = new Date(baseDate.getFullYear(), 
                           baseDate.getMonth(), baseDate.getDate());  
  }
  
  return format(periodStart);

}

const dbUser = process.env.DB_USER || "omatalous";
const dbPassword = process.env.DB_PASSWORD || "omatalous";
const sequelize = new Sequelize("omatalous", dbUser, dbPassword, {  
  host: process.env.DB_HOSTNAME || process.env.PG_PORT_5432_TCP_ADDR || "localhost",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

const schemaLoader = new SchemaLoader(sequelize);
const [ User, Transaction, Copy ] = [
  schemaLoader.loadSchema("User"),
  schemaLoader.loadSchema("Transaction"),
  schemaLoader.loadSchema("Copy")
];

const now = process.env.NOW ? new Date(process.env.NOW) : new Date();
console.log("BASE DATE", now);
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
const monthDay = now.getDate() === lastDay ? { $gte: lastDay } : now.getDate();
Transaction.selectAll({ 
  type: "repeating",
  $or: [
    { repeats: "D" },
    { repeatValue: now.getDay(), repeats: "W" },
    { repeatValue: monthDay, repeats: "M" }
  ]
})
.then(async (transactions) => {
  
  console.log(`Found ${transactions.length} repeating txs`);
  for (let tx of transactions) {

    try {

      const period = currentPeriod(now, tx.repeats);
      const today = format(now);
      console.log("Check for copies at", today, "for", period, "(", tx.repeats, ")");
      const copies = await Copy.selectAll({ 
        transaction: tx.uuid,
        period: period
      });
      
      console.log("Found copies", copies.length);

      if (copies.length === 0) {

        let copy = Object.assign({}, tx.json());
        console.log("Copying tx", tx.uuid);
        delete copy.uuid;
        delete copy.repeats;
        delete copy.repeatValue;
        copy.type = "copy";
        copy.month = getCurrentMonth();
        copy.createdAt = now;

        copy = await Transaction.schema.create(copy);
        console.log("Created copy", copy.uuid); 
        
        const copyRecord = await Copy.schema.create({
          user: tx.user,
          transaction: tx.uuid,
          copy: copy.uuid,
          amount: tx.amount,
          date: today,
          period: period
        });
        
        console.log(`Copy record: ${copyRecord.transaction} => ${copyRecord.copy}`);

      }

    } catch (err) {
      console.log("TX COPY ERR!!!", err);
    }

  }

})
.catch((err) => {
  console.log("UPDATE ERROR!!!", err);
});

