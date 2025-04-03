import { Layout } from './components/layout/Layout';
import { IntroSection } from './components/sections/IntroSection';
import { CustomerProfileSection } from './components/sections/CustomerProfileSection';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Layout>
        <IntroSection />
        <CustomerProfileSection />
        {/* Additional sections will be added here */}
      </Layout>
    </AppProvider>
  );
}

export default App;
