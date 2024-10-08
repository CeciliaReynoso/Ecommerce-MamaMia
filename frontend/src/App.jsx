import './App.css';
import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Cart from './pages/Cart';
import Footer from './components/Footer';
import NavbarComponent from './components/Navbar';
import HomeComponent from './pages/Home';
import PizzaComponent from './pages/Pizza';
import Register from './pages/Register';
import Login from './pages/Login';
import ProfileComponent from './pages/Profile';
import NotFound from './pages/NotFound';


const App = () => {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (pizza) => {
    setCart(prevCart => {
      const pizzaInCart = prevCart.find(item => item.id === pizza.id);
      if (pizzaInCart) {
        return prevCart.map(item =>
          item.id === pizza.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...pizza, quantity: 1 }];
      }
    });
  };

  const handleIncreaseQuantity = (id) => {
    setCart(prevCart => prevCart.map(pizza =>
      pizza.id === id ? { ...pizza, quantity: pizza.quantity + 1 } : pizza
    ));
  };

  const handleDecreaseQuantity = (id) => {
    setCart(prevCart => prevCart
      .map(pizza =>
        pizza.id === id
          ? { ...pizza, quantity: Math.max(pizza.quantity - 1, 0) }
          : pizza
      )
      .filter(pizza => pizza.quantity > 0)
    );
  };

  const getTotal = () => {
    return cart.reduce((total, pizza) => total + (pizza.price * pizza.quantity), 0);
  };

  // Componente que recibe el ID de la pizza y lo pasa al PizzaComponent de pizza.jsx
  const PizzaWithId = () => {
    const { pizzaId } = useParams(); // Obtiene el ID de la pizza desde la URL
    return <PizzaComponent pizzaId={pizzaId} onAddToCart={handleAddToCart} />;
  };

  return (
    <div>
      <NavbarComponent total={getTotal()} />
      <Routes>
        <Route
          path="/"
          element={<HomeComponent onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/profile"
          element={<ProfileComponent />}
        />
        <Route
          path="/cart"
          element={<Cart
            cart={cart}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
          />}
        />
        {/* Ruta dinámica para pizzas */}
        <Route
          path="/pizza/:pizzaId"
          element={<PizzaWithId />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
