import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <AppRouter />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
