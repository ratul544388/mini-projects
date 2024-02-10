import { redirect } from "next/navigation";

const Home = () => {
  redirect("/tic-tac-toe");
  return <div></div>;
};

export default Home;
