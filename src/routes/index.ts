import usersRouter from "./users";
import authRoter from "./auth";
import plansRoter from "./plans";
import pagesRouter from "./pages";
import companiesRouter from "./companies";

export default [
  { name: "users", router: usersRouter },
  { name: "auth", router: authRoter },
  { name: "plans", router: plansRoter },
  { name: "pages", router: pagesRouter },
  { name: "companies", router: companiesRouter },
];
