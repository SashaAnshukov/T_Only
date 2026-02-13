import './App.scss';
import { Data } from './Data';
import Ellipse from './components/Ellipse/Ellipse';

const App = () => {
  const data = Data;
  return (
    <div className="App">
      <Ellipse periods={data}/>
    </div>
  );
};

export default App;