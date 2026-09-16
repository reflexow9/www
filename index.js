import jsonfile from "jsonfile";
import moment from "moment";

const path = "./data.json";
const date = moment().format("YYYY-MM-DD HH:mm:ss");

const data = {
  date: date,
};

jsonfile.writeFileSync(path, data);
