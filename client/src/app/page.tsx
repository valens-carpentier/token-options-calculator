import Calculator from '../components/Calculator';

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Token Options Calculator
      </h1>
      <Calculator />
    </div>
  );
}
