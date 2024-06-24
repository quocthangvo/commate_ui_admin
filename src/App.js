import { ToastContainer } from "react-toastify";
import useRouterElement from "./routers";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const routersElement = useRouterElement();
  return (
    <main>
      {routersElement}
      <ToastContainer autoClose="2000" />
      {/* thời gian đóng thông báo */}
    </main>
  );
}

export default App;
