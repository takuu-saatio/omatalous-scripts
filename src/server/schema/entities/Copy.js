"use strict";

import Sequelize from "sequelize";
import BaseEntity from "./BaseEntity";

class Copy extends BaseEntity {

  constructor() {
    
    super();

    this.fields = Object.assign(this.fields, {

      user: { type: Sequelize.STRING },
      transaction: { type: Sequelize.STRING },
      copy: { type: Sequelize.STRING },
      amount: { type: Sequelize.FLOAT },
      date: { type: Sequelize.STRING },
      period: { type: Sequelize.STRING }

    });

    this.hiddenFields = this.hiddenFields.concat([]);

  }

  extend() { 
    super.extend();
  }

}

module.exports = new Copy();
