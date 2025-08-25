

import ClaimsScreen from './ClaimsScreen';

function App() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div>
      <nav className="nav nav-tabs justify-content-center mt-3">
        <button
          className={`nav-link${activeTab === 'login' ? ' active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          className={`nav-link${activeTab === 'payment' ? ' active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Payment
        </button>
        <button
          className={`nav-link${activeTab === 'claims' ? ' active' : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          Claims
        </button>
      </nav>
      <div className="container-fluid">
        {activeTab === 'login' && <LoginScreen />}
        {activeTab === 'payment' && <PaymentScreen />}
        {activeTab === 'claims' && <ClaimsScreen />}
  // Example usage of DefectAnalysisReport in App.jsx
  import DefectAnalysisReport from "./DefectAnalysisReport";
  return <DefectAnalysisReport />;
      </div>
    </div>
  );
}

export default App;
