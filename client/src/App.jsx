import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}

export default App;